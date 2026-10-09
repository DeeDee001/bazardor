import { Category, Product } from "./types";

const PRIMARY_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.api-store.workers.dev/api/bazardor";
const FALLBACK_BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

/**
 * Resilient fetcher that attempts the primary endpoint first
 * and automatically switches to the secondary mirror if any error occurs.
 */
async function fetchWithFallback<T>(endpoint: string): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(`${PRIMARY_BASE_URL}${cleanEndpoint}`, {
      next: { revalidate: 60, tags: ["products"] },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Primary API error: ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (primaryErr) {
    console.warn(`Primary API failed for ${cleanEndpoint}, trying fallback mirror...`, primaryErr);
    const fallbackRes = await fetch(`${FALLBACK_BASE_URL}${cleanEndpoint}`, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });
    if (!fallbackRes.ok) {
      throw new Error(`Fallback API error: ${fallbackRes.status}`);
    }
    return (await fallbackRes.json()) as T;
  }
}

/**
 * Get all products or filter by category slug
 */
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const endpoint = categorySlug
      ? `/products?category=${encodeURIComponent(categorySlug)}`
      : `/products`;
    const products = await fetchWithFallback<Product[]>(endpoint);
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await fetchWithFallback<Category[]>("/categories");
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await fetchWithFallback<Category>(`/categories/${encodeURIComponent(slug)}`);
    return category || null;
  } catch (error) {
    console.error(`Failed to fetch category by slug ${slug}:`, error);
    // Fallback: fetch all and find
    const all = await getCategories();
    return all.find((c) => c.slug === slug || c.id === slug) || null;
  }
}

/**
 * Get a single product by slug or id.
 * Handles both slug and numeric ID seamlessly.
 */
export async function getProductBySlug(slugOrId: string): Promise<Product | null> {
  try {
    // If it's a numeric ID, we can try direct fetch
    if (/^\d+$/.test(slugOrId)) {
      try {
        const prod = await fetchWithFallback<Product>(`/products/${slugOrId}`);
        if (prod && prod.id) return prod;
      } catch {
        // Fallback to searching all products
      }
    }

    // Otherwise, fetch all products and find matching slug or id
    const allProducts = await getProducts();
    const found = allProducts.find(
      (p) => p.slug === slugOrId || p.id.toString() === slugOrId
    );
    return found || null;
  } catch (error) {
    console.error(`Failed to fetch product for ${slugOrId}:`, error);
    return null;
  }
}
