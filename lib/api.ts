// lib/api.ts
const API = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

type FetchInit = RequestInit & { headers?: Record<string, string> };

async function jsonFetch<T>(url: string, init: FetchInit = {}): Promise<T> {
  const r = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  // proovi JSON-i lugeda; kui ei õnnestu, kasuta tühi obj
  const data = (await r.json().catch(() => ({}))) as any;

  if (!r.ok) {
    // backendis saadame { error: "..." }
    const msg = data?.error || `HTTP ${r.status}`;
    throw new Error(msg);
  }

  return data as T;
}

/** AUTH **/
export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return jsonFetch<{ user: any; token: string }>(`${API}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string }) {
  return jsonFetch<{ user: any; token: string }>(`${API}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function me(token: string) {
  return jsonFetch<{ id: string; name: string; email: string }>(
    `${API}/api/auth/me`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function updateMe(
  token: string,
  payload: { name?: string; email?: string }
) {
  // tagastab { user, token? } — kui email muutus, võib tulla uus JWT
  return jsonFetch<{ user: any; token?: string }>(`${API}/api/auth/me`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function changePassword(
  token: string,
  payload: { oldPassword: string; newPassword: string }
) {
  // NB! Nimed PEAVAD olema oldPassword + newPassword
  return jsonFetch<{ ok: true }>(`${API}/api/auth/change-password`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
