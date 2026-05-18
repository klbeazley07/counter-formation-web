import { supabase } from "./supabaseClient";
import { getSessionId } from "./giftsSessionId";

// Fire-and-forget upsert of the fruit assessment result. Mirrors the pattern
// in giftsAssessmentStorage so localStorage stays primary and Supabase is backup.
export function syncFruitToSupabase({ scores, formationEdge, completedAt }) {
  if (!supabase) return;
  const sessionId = getSessionId();
  if (!sessionId) return;
  supabase.from("fruit_assessments").upsert({
    session_id: sessionId,
    scores,
    formation_edge: formationEdge,
    completed_at: completedAt,
    updated_at: new Date().toISOString(),
  }, { onConflict: "session_id" }).then(() => {});
}

// Returns the stored fruit assessment shape if Supabase has a row for the
// current session_id. Null otherwise. Used by the results screen as a
// fallback when localStorage is empty (iOS context switches, fresh device).
export async function recoverFruitFromSupabase() {
  if (!supabase) return null;
  const sessionId = getSessionId();
  if (!sessionId) return null;
  try {
    const { data, error } = await supabase
      .from("fruit_assessments")
      .select("scores, formation_edge, completed_at")
      .eq("session_id", sessionId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      fruits: data.scores,
      formationEdge: data.formation_edge,
      completedAt: data.completed_at,
    };
  } catch {
    return null;
  }
}
