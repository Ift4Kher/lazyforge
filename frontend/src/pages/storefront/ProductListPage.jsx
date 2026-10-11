import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  PackageX,
  Sparkles,
} from 'lucide-react';
import { ProductCard } from '../../components/storefront/ProductCard';
import { fetchProducts, fetchCategories } from '../../services/catalogService';

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state synced with URL search params
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'popular';
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentInStock = searchParams.get('in_stock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Fetch products whenever searchParams change
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {
      category: currentCategory,
      search: currentSearch,
      sort: currentSort,
      min_price: currentMinPrice,
      max_price: currentMaxPrice,
      in_stock: currentInStock,
      page: currentPage,
      limit: 12,
    };

    fetchProducts(params)
      .then((data) => {
        setProducts(data.products || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
      })
      .catch((err) => {
        setError(err.message || 'Unable to load gadgets catalog.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(currentSearch);
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentSearch, currentMinPrice, currentMaxPrice]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value !== null && value !== undefined && value !== '') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    // Reset to page 1 on filter changes unless changing page directly
    if (key !== 'page') {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (minPriceInput) nextParams.set('min_price', minPriceInput);
    else nextParams.delete('min_price');

    if (maxPriceInput) nextParams.set('max_price', maxPriceInput);
    else nextParams.delete('max_price');

    nextParams.delete('page');
    setSearchParams(nextParams);
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentSearch || currentMinPrice || currentMaxPrice || currentInStock
  );

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumbs & Title */}
        <div className="border-b border-brand-border pb-6">
          <div className="flex items-center space-x-2 text-xs text-brand-muted mb-2 font-mono">
            <Link to="/" className="hover:text-[#8B5CF6]">Home</Link>
            <span>/</span>
            <span className="text-brand-graphite font-semibold">Catalog</span>
            {currentCategory && (
              <>
                <span>/</span>
                <span className="text-[#8B5CF6] font-bold uppercase">{currentCategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-brand-graphite tracking-tight">
                Robotics, Electronics & 3D Creations
              </h1>
              <p className="text-sm text-brand-muted mt-1">
                Explore engineering-grade microcontrollers, articulated 3D models, and developer hardware across Bangladesh.
              </p>
            </div>
            <div className="text-xs font-semibold text-brand-muted shrink-0">
              Showing <span className="text-brand-graphite font-bold">{pagination.total}</span> verified products
            </div>
          </div>
        </div>

        {/* Quick Category Chips Strip */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => updateParam('category', '')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              !currentCategory
                ? 'bg-[#8B5CF6] text-white shadow-[#8B5CF6]/30'
                : 'bg-brand-softGray border border-brand-border text-brand-graphite hover:border-[#8B5CF6]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParam('category', cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5 ${
                currentCategory === cat.slug
                  ? 'bg-[#8B5CF6] text-white shadow-[#8B5CF6]/30'
                  : 'bg-brand-softGray border border-brand-border text-brand-graphite hover:border-[#8B5CF6]'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                currentCategory === cat.slug ? 'bg-white/25 text-white' : 'bg-brand-border text-brand-muted'
              }`}>
                {cat.product_count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand-softGray border border-brand-border">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search gadgets, ESP32, servos, dragons..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-brand-border focus:border-[#8B5CF6] text-sm text-brand-graphite placeholder-brand-muted focus:outline-none transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="absolute right-3 top-3 text-brand-muted hover:text-brand-graphite"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="sm:hidden inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-brand-border text-xs font-bold text-brand-graphite"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8B5CF6]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-brand-muted hidden md:inline">Sort By:</span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-brand-border text-xs font-bold text-brand-graphite focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-brand-muted mr-1">Active Filters:</span>
            {currentCategory && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
                <span>Category: {currentCategory}</span>
                <button type="button" onClick={() => updateParam('category', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
                <span>Search: "{currentSearch}"</span>
                <button type="button" onClick={() => updateParam('search', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(currentMinPrice || currentMaxPrice) && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
                <span>Price: ৳{currentMinPrice || '0'} - ৳{currentMaxPrice || '∞'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMinPriceInput('');
                    setMaxPriceInput('');
                    updateParam('min_price', '');
                    updateParam('max_price', '');
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentInStock && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
                <span>In Stock Only</span>
                <button type="button" onClick={() => updateParam('in_stock', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-600 hover:underline ml-2"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="p-5 rounded-2xl bg-brand-softGray border border-brand-border space-y-5">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h3 className="text-sm font-bold text-brand-graphite flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Refine Catalog</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[11px] text-red-600 font-semibold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <form onSubmit={handlePriceApply} className="space-y-3">
                <label className="text-xs font-bold text-brand-graphite block">
                  Price Range (BDT ৳)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-brand-border text-xs text-brand-graphite focus:outline-none focus:border-[#8B5CF6]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-brand-border text-xs text-brand-graphite focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-white border border-brand-border hover:border-[#8B5CF6] text-xs font-bold text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all shadow-sm"
                >
                  Apply Price Range
                </button>
              </form>

              {/* In Stock Checkbox */}
              <div className="pt-3 border-t border-brand-border">
                <label className="flex items-center space-x-2.5 text-xs font-semibold text-brand-graphite cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentInStock}
                    onChange={(e) => updateParam('in_stock', e.target.checked ? 'true' : '')}
                    className="w-4 h-4 rounded border-brand-border text-[#8B5CF6] focus:ring-[#8B5CF6]"
                  />
                  <span>Show In-Stock Items Only</span>
                </label>
              </div>

              {/* Cash on Delivery Notice */}
              <div className="pt-3 border-t border-brand-border text-[11px] text-brand-muted leading-relaxed">
                <p className="font-bold text-brand-graphite mb-1">⚡ Instant Dispatch:</p>
                All featured robotics and ESP32 gadgets are stocked in our Dhaka fulfillment hub with nationwide COD.
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-8">
            {error ? (
              <div className="p-8 text-center rounded-2xl bg-red-50 border border-red-200 text-red-600">
                <p className="font-bold text-sm">{error}</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold shadow-sm"
                >
                  Reload Catalog
                </button>
              </div>
            ) : loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[9/12.6] min-h-[350px] rounded-[30px] border-[6px] border-white bg-slate-100 animate-pulse p-4 flex flex-col justify-end space-y-3 shadow-xs">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-7 bg-slate-200 rounded-full w-24 self-end"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="p-16 text-center rounded-3xl bg-brand-softGray border border-brand-border space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-brand-border flex items-center justify-center mx-auto text-brand-muted shadow-sm">
                  <PackageX className="w-8 h-8 text-brand-muted" />
                </div>
                <h3 className="text-lg font-bold text-brand-graphite">No Products Match Your Criteria</h3>
                <p className="text-xs text-brand-muted max-w-md mx-auto">
                  Try clearing some filter parameters, searching for alternative robotics terms, or viewing our entire catalog.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold shadow-md hover:bg-[#7C3AED] transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-6 border-t border-brand-border flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => updateParam('page', currentPage - 1)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-graphite hover:border-[#8B5CF6] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-semibold text-brand-muted">
                  Page <span className="font-bold text-brand-graphite">{currentPage}</span> of{' '}
                  <span className="font-bold text-brand-graphite">{pagination.totalPages}</span>
                </div>

                <button
                  type="button"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => updateParam('page', currentPage + 1)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-graphite hover:border-[#8B5CF6] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
