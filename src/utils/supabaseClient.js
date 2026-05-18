import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/*
 * Supabase client with PKCE flow.
 *
 * PKCE is required for the magic-link auth path to survive context switches
 * across iOS Safari and email-client in-app browsers: the code verifier lives
 * in the originating browser's storage; the callback completes the handshake
 * even when the link opens in a different storage context.
 *
 * The auth state listener is wired in `src/utils/authBackfill.js` -- not here,
 * to avoid a circular import.
 */

export const supabase = url && key
  ? createClient(url, key, {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
