const SESSION_ID_KEY = "cf-gifts-session-id";

export function getSessionId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}
