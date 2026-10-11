// Catalog API service connecting to LazyForge Express Backend

const BASE_URL = '/api';

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await res.json();
  return data.categories || [];
}

export async function fetchCategoryBySlug(slug) {
  const res = await fetch(`${BASE_URL}/categories/${slug}`);
  if (!res.ok) {
    throw new Error('Category not found');
  }
  return await res.json();
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

  const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return await res.json();
}

export async function fetchFeaturedProducts(limit = 8) {
  const res = await fetch(`${BASE_URL}/products/featured?limit=${limit}`);
  if (!res.ok) {
    throw new Error('Failed to fetch featured products');
  }
  const data = await res.json();
  return data.products || [];
}

export async function fetchProductBySlug(slug) {
  const res = await fetch(`${BASE_URL}/products/${slug}`);
  if (!res.ok) {
    throw new Error('Product not found');
  }
  const data = await res.json();
  return data.product;
}
