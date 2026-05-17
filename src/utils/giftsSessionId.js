const SESSION_ID_KEY = "cf-gifts-session-id";
const COOKIE_NAME = "cf_gifts_sid";

function readCookie() {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function writeCookie(id) {
  if (typeof document === "undefined") return;
  try {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(id)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } catch { /* ignore */ }
}

export function getSessionId() {
  if (typeof window === "undefined") return null;
  try {
    // localStorage first, fall back to cookie (cookie survives iOS Safari clears)
    let id = localStorage.getItem(SESSION_ID_KEY) || readCookie();
    if (!id) {
      id = crypto.randomUUID();
    }
    localStorage.setItem(SESSION_ID_KEY, id);
    writeCookie(id);
    return id;
  } catch {
    // localStorage blocked (private mode) -- fall back to cookie
    const fromCookie = readCookie();
    if (fromCookie) return fromCookie;
    try {
      const id = crypto.randomUUID();
      writeCookie(id);
      return id;
    } catch {
      return null;
    }
  }
}
