import { supabase } from "./supabaseClient";
import { getSessionId } from "./giftsSessionId";

/*
 * Auth backfill -- runs after the first SIGNED_IN event on a device.
 *
 * Two jobs:
 *
 *   1. Re-key anonymous rows on the assessment tables. If the device has an
 *      existing `cf-gifts-session-id`, find every row keyed to that session_id
 *      that still has `user_id IS NULL` and claim it for the authenticated
 *      user. Subsequent writes will carry user_id and Supabase RLS protects
 *      those rows from cross-account reads.
 *
 *   2. Hydrate localStorage from Supabase. Whether or not a local session_id
 *      exists, pull the authenticated user's rows by user_id and write them
 *      into the localStorage keys the rest of the app reads. This is the
 *      cross-device handoff -- signing in on a fresh browser populates the
 *      dashboard without re-doing assessments.
 *
 * Idempotent: rows already keyed to this user are left alone; localStorage
 * writes overwrite with the Supabase view of truth.
 *
 * Trusted-person tables (`gifts_trusted_tokens`, `gifts_trusted_responses`)
 * are intentionally NOT re-keyed -- the token is the access secret and the
 * anonymous trusted person must continue to read/write them.
 */

const GIFTS_PROGRESS_KEY    = "cf-gifts-self-assessment"; // STORAGE_KEY in giftsAssessmentStorage.js
const TRUSTED_RESPONSES_KEY = "cf-gifts-trusted-responses";
const TRUSTED_PERSONS_KEY   = "cf-gifts-trusted-persons";

async function upsertUsersRow(user) {
  if (!supabase || !user) return;
  await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
}

async function claimLocalSessionRows(userId) {
  if (!supabase || !userId) return;
  const sessionId = getSessionId();
  if (!sessionId) return;

  // Re-key only the private assessment tables. Trusted tables stay anonymous.
  await supabase
    .from("fruit_assessments")
    .update({ user_id: userId })
    .eq("session_id", sessionId)
    .is("user_id", null);

  await supabase
    .from("gifts_sessions")
    .update({ user_id: userId })
    .eq("session_id", sessionId)
    .is("user_id", null);
}

async function hydrateLocalStorageFromSupabase(userId) {
  if (!supabase || !userId) return;

  // Find the user's gifts session row (most recently updated wins if more
  // than one local session has been claimed by the same user).
  const { data: giftsRow } = await supabase
    .from("gifts_sessions")
    .select("session_id, progress, completed_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (giftsRow?.progress) {
    const restored = { ...giftsRow.progress };
    if (!restored.completedAt && giftsRow.completed_at) {
      restored.completedAt = giftsRow.completed_at;
    }
    try {
      localStorage.setItem(GIFTS_PROGRESS_KEY, JSON.stringify(restored));
    } catch { /* ignore */ }

    // Pull any trusted responses tied to this session and merge them in.
    if (giftsRow.session_id) {
      const { data: responses } = await supabase
        .from("gifts_trusted_responses")
        .select("token, responses, completed_at")
        .eq("session_id", giftsRow.session_id);
      if (responses?.length) {
        const merged = {};
        for (const row of responses) {
          merged[row.token] = { responses: row.responses, completedAt: row.completed_at };
        }
        try { localStorage.setItem(TRUSTED_RESPONSES_KEY, JSON.stringify(merged)); } catch { /* ignore */ }
      }
      // Also fetch the trusted-persons records the inviter sent (so the
      // dashboard knows who they invited).
      const { data: tokens } = await supabase
        .from("gifts_trusted_tokens")
        .select("token, person_name, relationship, inviter_name, created_at")
        .eq("session_id", giftsRow.session_id);
      if (tokens?.length) {
        const persons = tokens.map((t) => ({
          token: t.token,
          personName: t.person_name,
          relationship: t.relationship,
          inviterName: t.inviter_name,
          createdAt: t.created_at,
        }));
        try {
          localStorage.setItem(TRUSTED_PERSONS_KEY, JSON.stringify(persons));
        } catch { /* ignore */ }
      }
    }
  }

  // Fruit assessment hydration.
  const { data: fruitRow } = await supabase
    .from("fruit_assessments")
    .select("scores, formation_edge, completed_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fruitRow) {
    // The Fruit recovery effect in FruitAssessment.jsx already pulls from
    // Supabase by session_id; we make sure cf:profile.assessment reflects the
    // server-side row here so the dashboard renders correctly on a new device.
    try {
      const raw = localStorage.getItem("cf:profile");
      const profile = raw ? JSON.parse(raw) : null;
      if (profile) {
        profile.assessment = {
          ...(profile.assessment || {}),
          fruits: fruitRow.scores,
          formationEdge: fruitRow.formation_edge,
          completedAt: fruitRow.completed_at,
        };
        profile._updated = new Date().toISOString();
        localStorage.setItem("cf:profile", JSON.stringify(profile));
      }
    } catch { /* ignore */ }
  }
}

async function writeIdentityToProfile(user, emailOptIn = null) {
  try {
    const raw = localStorage.getItem("cf:profile");
    const profile = raw ? JSON.parse(raw) : null;
    if (!profile) return;
    profile.identity = {
      ...(profile.identity || {}),
      email: user.email ?? null,
      userId: user.id,
      authedAt: profile.identity?.authedAt ?? new Date().toISOString(),
    };
    if (emailOptIn !== null) {
      profile.identity.emailOptIn = emailOptIn;
    }
    profile._updated = new Date().toISOString();
    localStorage.setItem("cf:profile", JSON.stringify(profile));
  } catch { /* ignore */ }
}

/**
 * Run the full backfill for the current authenticated user. Safe to call
 * multiple times; the second call is mostly a no-op.
 */
export async function runAuthBackfill(user) {
  if (!supabase || !user) return;
  await upsertUsersRow(user);
  await claimLocalSessionRows(user.id);
  await hydrateLocalStorageFromSupabase(user.id);
  await writeIdentityToProfile(user);
}

/**
 * Subscribe once, at app boot, to auth state. The hook handles two flows:
 *
 *   - SIGNED_IN that lands during normal app use (the magic-link callback
 *     redirects through detectSessionInUrl, which fires SIGNED_IN). We run
 *     the backfill and the auth-callback component handles navigation.
 *
 *   - INITIAL_SESSION on app boot for a returning authenticated user. We
 *     skip the claim step (rows are already owned) but make sure the local
 *     identity block reflects the live session in case localStorage was
 *     cleared since last login.
 */
let installed = false;
export function installAuthStateListener() {
  if (installed || !supabase) return;
  installed = true;
  let lastBackfillUserId = null;

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (!session?.user) return;
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
      if (lastBackfillUserId === session.user.id) return;
      lastBackfillUserId = session.user.id;
      try {
        await runAuthBackfill(session.user);
      } catch (err) {
        console.warn("Auth backfill failed:", err);
      }
    }
  });
}
