const API = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((data as any).error || `HTTP ${r.status}`);
  return data as T;
}

export function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return jsonFetch<{ user: any; token: string }>(`${API}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return jsonFetch<{ user: any; token: string }>(`${API}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function me(token: string) {
  return jsonFetch<{ id: string; name: string; email: string }>(
    `${API}/api/auth/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
