const API = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

async function jsonFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  // teeme alati JSON-i
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const text = await res.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log("jsonFetch: could not parse JSON", text);
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }

  return data as T;
}

// --- AUTH ---
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

export function updateMe(
  token: string,
  payload: { name?: string; email?: string }
) {
  return jsonFetch<{
    user: { id: string; name: string; email: string };
    token?: string;
  }>(`${API}/api/auth/me`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function changePassword(
  token: string,
  payload: { oldPassword: string; newPassword: string }
) {
  return jsonFetch<{ ok: true }>(`${API}/api/auth/change-password`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/* =========================
   LISTINGS
   ========================= */

export type ListingPayload = {
  title: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
};

export type Listing = ListingPayload & {
  id: string;
  userId: string;
  createdAt: number;
};

export function listAllListings(): Promise<Listing[]> {
  return jsonFetch<Listing[]>(`${API}/api/listings`);
}

export function myListings(token: string): Promise<Listing[]> {
  return jsonFetch<Listing[]>(`${API}/api/listings/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createListing(token: string, payload: ListingPayload) {
  console.log("[api] createListing payload:", payload);
  return jsonFetch<Listing>(`${API}/api/listings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function deleteListing(token: string, id: string) {
  console.log("[api] deleteListing id:", id);
  return jsonFetch<{ ok: true }>(`${API}/api/listings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
export function getListing(id: string) {
  return jsonFetch<Listing>(`${API}/api/listings/${id}`);
}
