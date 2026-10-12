// Catalog API service connecting to LazyForge Express Backend
// With seamless fallback to mock data when deployed to static hosts (Vercel) or when API is offline

import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_FEATURED_PRODUCTS,
} from '../data/mockCatalogData';

const BASE_URL = import.meta.env?.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

async function safeFetchJson(url) {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.warn(`[CatalogService] Network fetch failed for ${url}:`, err.message);
    return null;
  }
}

export async function fetchCategories() {
  const data = await safeFetchJson(`${BASE_URL}/categories`);
  if (data && Array.isArray(data.categories) && data.categories.length > 0) {
    return data.categories;
  }
  return DEFAULT_CATEGORIES;
}

export async function fetchCategoryBySlug(slug) {
  const data = await safeFetchJson(`${BASE_URL}/categories/${slug}`);
  if (data && data.category) {
    return data;
  }
  const found = DEFAULT_CATEGORIES.find((c) => c.slug === slug);
  return {
    category: found || DEFAULT_CATEGORIES[0],
    products: DEFAULT_PRODUCTS.filter((p) => p.category_slug === slug),
  };
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.min_price) query.set('min_price', params.min_price);
  if (params.max_price) query.set('max_price', params.max_price);
  if (params.in_stock) query.set('in_stock', 'true');
  if (params.featured) query.set('featured', 'true');
  if (params.sort) query.set('sort', params.sort);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);

  const data = await safeFetchJson(`${BASE_URL}/products?${query.toString()}`);
  if (data && Array.isArray(data.products) && data.products.length > 0) {
    return data;
  }

  // Fallback in-memory filter
  let filtered = [...DEFAULT_PRODUCTS];
  if (params.category) {
    filtered = filtered.filter((p) => p.category_slug === params.category);
  }
  if (params.search) {
    const term = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.short_description?.toLowerCase().includes(term)
    );
  }
  if (params.featured) {
    filtered = filtered.filter((p) => p.is_featured);
  }

  return {
    products: filtered,
    pagination: {
      total: filtered.length,
      page: 1,
      limit: params.limit || 12,
      totalPages: 1,
    },
  };
}

export async function fetchFeaturedProducts(limit = 8) {
  const data = await safeFetchJson(`${BASE_URL}/products/featured?limit=${limit}`);
  if (data && Array.isArray(data.products) && data.products.length > 0) {
    return data.products;
  }
  return DEFAULT_FEATURED_PRODUCTS.slice(0, limit);
}

export async function fetchProductBySlug(slug) {
  const data = await safeFetchJson(`${BASE_URL}/products/${slug}`);
  if (data && data.product) {
    return data.product;
  }
  const product = DEFAULT_PRODUCTS.find((p) => p.slug === slug);
  return product || DEFAULT_PRODUCTS[0];
}
