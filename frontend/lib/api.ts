import { supabase } from "./supabaseClient";
import type {
  Category,
  MasterProfileCard,
  MasterProfileOut,
  MasterProfileUpsert,
  MasterSearchFilters,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (auth) {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      headers.set("Authorization", `Bearer ${data.session.access_token}`);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getCategories: () => request<Category[]>("/categories"),

  searchMasters: (filters: MasterSearchFilters) => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", String(filters.category));
    if (filters.city) params.set("city", filters.city);
    if (filters.price_min) params.set("price_min", String(filters.price_min));
    if (filters.price_max) params.set("price_max", String(filters.price_max));
    return request<MasterProfileCard[]>(`/masters?${params.toString()}`);
  },

  getMaster: (id: string) => request<MasterProfileOut>(`/masters/${id}`),

  upsertProfile: (payload: MasterProfileUpsert) =>
    request<MasterProfileOut>(
      "/masters/profile",
      { method: "PUT", body: JSON.stringify(payload) },
      true
    ),

  addPortfolioItem: (image_url: string, description?: string) =>
    request(
      "/masters/portfolio",
      { method: "POST", body: JSON.stringify({ image_url, description }) },
      true
    ),
};
