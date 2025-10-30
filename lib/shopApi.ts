// lib/shopApi.ts
const API = "https://fakestoreapi.com";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string; // üks pilt
  rating?: { rate: number; count: number };
};

async function jsonFetch<T>(url: string): Promise<T> {
  const r = await fetch(url);
  const data = await r.json();
  if (!r.ok) throw new Error((data as any)?.error || `HTTP ${r.status}`);
  return data as T;
}

export function listProducts() {
  return jsonFetch<Product[]>(`${API}/products`);
}

export function getProduct(id: number) {
  return jsonFetch<Product>(`${API}/products/${id}`);
}

export function listCategories() {
  return jsonFetch<string[]>(`${API}/products/categories`);
}
