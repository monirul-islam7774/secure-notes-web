// localStorage wrapped in try/catch (can throw in private mode / blocked storage).
const KEY = 'secure-notes-auth';

export function loadAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export function saveAuth(auth) {
  try {
    if (auth?.token) localStorage.setItem(KEY, JSON.stringify(auth));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
