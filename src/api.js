import { loadAuth, saveAuth } from './storage.js';

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = 'GET', body, params } = {}) {
  const url = new URL(BASE + path, window.location.origin);
  if (params) for (const [k, v] of Object.entries(params)) if (v !== '' && v != null) url.searchParams.set(k, v);

  const { token } = loadAuth();
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. If it was idle it may be waking up; try again in a moment.', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (res.status === 401 && !path.startsWith('/auth/')) {
    saveAuth(null);
    window.location.assign('/login');
  }
  if (!res.ok) throw new ApiError(data?.error?.message || `Request failed (${res.status})`, res.status);
  return data;
}
