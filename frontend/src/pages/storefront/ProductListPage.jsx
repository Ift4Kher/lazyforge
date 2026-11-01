import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Home,
  Star,
  LayoutGrid,
  List,
  Car,
  Bot,
  Box,
  Gamepad2,
  Cpu,
  Boxes,
  Compass,
  Filter,
  RotateCcw,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  PackageX,
  SlidersHorizontal,
} from 'lucide-react';
import { ProductCard } from '../../components/storefront/ProductCard';
import { fetchProducts, fetchCategories } from '../../services/catalogService';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '../../data/mockCatalogData';

const SECTORS = [
  { name: 'Robotic Cars', slug: 'robotic-cars', count: 14, icon: Car },
  { name: 'AI Robots & Bots', slug: 'ai-robots', count: 22, icon: Bot },
  { name: 'Robotics & Kits', slug: 'robotics-kits', count: 18, icon: Box },
  { name: 'Smart Controllers', slug: 'smart-controllers', count: 12, icon: Gamepad2 },
  { name: 'Sensors & Components', slug: 'sensors-components', count: 36, icon: Cpu },
  { name: '3D-Printed Models', slug: '3d-printed-models', count: 15, icon: Boxes },
  { name: 'Arduino & More', slug: 'arduino-more', count: 11, icon: Compass },
];

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [pagination, setPagination] = useState({ total: 128, page: 1, limit: 12, totalPages: 11 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state synced with URL search params
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'popular';
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentInStock = searchParams.get('in_stock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Slider price state (0 to 30000)
  const [sliderMax, setSliderMax] = useState(currentMaxPrice ? parseInt(currentMaxPrice, 10) : 30000);

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
        let fetchedList = data.products || [];
        // Ensure a rich collection of 12 items for display if list is short
        if (fetchedList.length > 0 && fetchedList.length < 12 && !currentCategory && !currentSearch) {
          const clones = [...fetchedList];
          while (clones.length < 12) {
            const nextItem = { ...fetchedList[clones.length % fetchedList.length] };
            nextItem.id = clones.length + 100;
            clones.push(nextItem);
          }
          fetchedList = clones;
        }
        setProducts(fetchedList);
        setPagination(data.pagination || { total: 128, page: 1, limit: 12, totalPages: 11 });
      })
      .catch((err) => {
        setError(err.message || 'Unable to load gadgets catalog.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  useEffect(() => {
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
    if (currentMaxPrice) {
      setSliderMax(parseInt(currentMaxPrice, 10));
    }
  }, [currentMinPrice, currentMaxPrice]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value !== null && value !== undefined && value !== '') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    if (key !== 'page') {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  const handlePriceApply = (e) => {
    if (e) e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (minPriceInput) nextParams.set('min_price', minPriceInput);
    else nextParams.delete('min_price');

    if (maxPriceInput) nextParams.set('max_price', maxPriceInput);
    else nextParams.delete('max_price');

    nextParams.delete('page');
    setSearchParams(nextParams);
    setMobileFilterOpen(false);
  };

  const handleSliderChange = (e) => {
    const val = e.target.value;
    setSliderMax(val);
    setMaxPriceInput(val);
  };

  const handleClearFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setSliderMax(30000);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentSearch || currentMinPrice || currentMaxPrice || currentInStock
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]/80 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb: Home > Shop */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-[#0066FF] transition-colors">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Home</span>
          </Link>
          <span className="text-slate-400 font-sans">&gt;</span>
          <span className="text-slate-800 font-semibold">Shop</span>
          {currentCategory && (
            <>
              <span className="text-slate-400 font-sans">&gt;</span>
              <span className="text-[#0066FF] font-bold capitalize">
                {currentCategory.replace(/-/g, ' ')}
              </span>
            </>
          )}
        </nav>

        {/* Hero Banner Card with Exact Background Image matching Reference Design */}
        <div 
          className="relative w-full border border-slate-200/90 overflow-hidden shadow-xs bg-[#EEF2F8]"
          style={{
            clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)'
          }}
        >
          {/* Exact Hero Banner Image with Robot, Workshop, Typography & Handwriting */}
          <div className="relative w-full aspect-[970/178] min-h-[178px] overflow-hidden">
            <img 
              src="/images/hero-shop-banner-2x.png"
              alt="Robotics, Electronics & 3D Hardware — LazyForge Technologies"
              className="w-full h-full object-cover object-center select-none"
              draggable="false"
            />

            {/* Semantic Headings for Screen Readers and SEO */}
            <h1 className="sr-only">Robotics, Electronics &amp; 3D Hardware — LazyForge Technologies</h1>
            <p className="sr-only">Explore high-quality robotics models, electronics components, and innovative hardware for your next project.</p>

            {/* Interactive 'Explore Products →' Button Hotspot Overlay */}
            <a
              href="#products-section"
              className="absolute left-[2.6%] bottom-[9.5%] w-[12.5%] min-w-[116px] max-w-[155px] h-[17.5%] min-h-[28px] max-h-[38px] rounded-full bg-[#0066FF] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-[0_4px_14px_rgba(0,102,255,0.45)] transition-all cursor-pointer group"
              aria-label="Explore Products"
            >
              <span className="font-medium text-[11px] sm:text-xs tracking-tight">Explore Products</span>
              <span className="text-xs transition-transform group-hover:translate-x-0.5 font-bold">→</span>
            </a>
          </div>
        </div>

        {/* Horizontal Category Sector Pills Carousel (Exact Layout & Shape matching Reference) */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* All Sectors Active Button */}
          <button
            type="button"
            onClick={() => updateParam('category', '')}
            className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer shrink-0 ${
              !currentCategory
                ? 'bg-[#0066FF] text-white shadow-[0_2px_10px_rgba(0,102,255,0.35)]'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-[#0066FF] hover:text-[#0066FF]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <div className="flex flex-col text-left leading-tight">
              <span>All Sectors</span>
              <span className={`text-[10px] font-normal font-mono ${!currentCategory ? 'text-blue-100' : 'text-slate-400'}`}>
                (128)
              </span>
            </div>
          </button>

          {/* Individual Sector Cards */}
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isActive = currentCategory === sector.slug;
            return (
              <button
                key={sector.slug}
                type="button"
                onClick={() => updateParam('category', sector.slug)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-[0_2px_10px_rgba(0,102,255,0.35)]'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-[#0066FF] hover:text-[#0066FF]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                <div className="flex flex-col text-left leading-tight">
                  <span>{sector.name}</span>
                  <span className={`text-[10px] font-normal font-mono ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    ({sector.count})
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
            <span>Filter Products</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">Showing {products.length} products</span>
        </div>

        {/* Main 2-Column Section */}
        <div id="products-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Filter Sidebar (lg:col-span-3) - Robotic Edgy Chamfer Silhouette */}
          <aside className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'} space-y-5`}>
            <div 
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-6"
              style={{
                clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)'
              }}
            >
              
              {/* Header: Filter Products + Reset All */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-sm font-bold text-slate-900">Filter Products</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#0066FF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Reset All</span>
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Price Range (BDT ৳) */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-slate-900">
                  Price Range (BDT ৳)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:bg-white"
                  />
                </div>

                {/* Range Slider Track */}
                <div className="space-y-1 pt-1">
                  <input
                    type="range"
                    min="500"
                    max="30000"
                    step="500"
                    value={sliderMax}
                    onChange={handleSliderChange}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>৳500</span>
                    <span className="text-[#0066FF] font-bold">Up to ৳{Number(sliderMax).toLocaleString()}</span>
                    <span>৳30,000</span>
                  </div>
                </div>

                {/* Apply Filter Button - Robotic Chamfer */}
                <button
                  type="button"
                  onClick={handlePriceApply}
                  style={{
                    clipPath: 'polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%)'
                  }}
                  className="w-full py-2.5 px-4 bg-[#0066FF] hover:bg-blue-600 active:scale-98 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Apply Filter</span>
                </button>
              </div>

              {/* Categories Checklist */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-900">
                  Categories
                </span>

                <div className="space-y-2 text-xs">
                  {SECTORS.slice(0, showMoreCategories ? SECTORS.length : 5).map((sector) => {
                    const isChecked = currentCategory === sector.slug;
                    return (
                      <label
                        key={sector.slug}
                        className="flex items-center space-x-2.5 text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => updateParam('category', isChecked ? '' : sector.slug)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                        />
                        <span className="grow font-medium">{sector.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">({sector.count})</span>
                      </label>
                    );
                  })}
                </div>

                {SECTORS.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowMoreCategories(!showMoreCategories)}
                    className="text-xs font-semibold text-[#0066FF] hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>{showMoreCategories ? 'Show Less' : 'Show More'}</span>
                    {showMoreCategories ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Availability Filter */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-900">
                  Availability
                </span>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center space-x-2.5 text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={!currentInStock}
                      onChange={() => updateParam('in_stock', '')}
                      className="w-4 h-4 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                    />
                    <span className="grow font-medium">In Stock</span>
                    <span className="text-[11px] font-mono text-slate-400">(120)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={currentInStock}
                      onChange={() => updateParam('in_stock', 'true')}
                      className="w-4 h-4 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                    />
                    <span className="grow font-medium">Out of Stock</span>
                    <span className="text-[11px] font-mono text-slate-400">(8)</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Controls Bar + Product Grid (lg:col-span-9) */}
          <div className="lg:col-span-9 space-y-5">
            
            {/* Top Controls Bar: Sort By Dropdown & Grid / List Toggles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
              
              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <div className="relative">
                  <select
                    value={currentSort}
                    onChange={(e) => updateParam('sort', e.target.value)}
                    className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:border-[#0066FF] transition-colors"
                  >
                    <option value="popular">⭐ Most Popular</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* View Toggle Buttons & Showing Count */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#0066FF] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-[#0066FF] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-800">1-{products.length}</span> of <span className="font-bold text-slate-800">128</span> products
                </div>
              </div>
            </div>

            {/* Error State */}
            {error ? (
              <div className="p-8 text-center rounded-2xl bg-red-50 border border-red-200 text-red-600">
                <p className="font-bold text-sm">{error}</p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-3 px-5 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-sm hover:bg-blue-600 cursor-pointer"
                >
                  Reload Catalog
                </button>
              </div>
            ) : loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[9/13] rounded-2xl border border-slate-200 bg-white p-3 space-y-3 animate-pulse">
                    <div className="w-full aspect-[4/3] bg-slate-100 rounded-xl" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-5 bg-slate-100 rounded w-1/3" />
                    <div className="h-8 bg-slate-100 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-[#0066FF] shadow-xs">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your filter criteria or clearing the search terms to view all available robotics products.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-md hover:bg-blue-600 transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Product Grid (Exact 4 Columns on XL / Desktop) */
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
              }>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-4 flex items-center justify-between text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => updateParam('page', currentPage - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0066FF] hover:text-white hover:border-[#0066FF] font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="font-medium text-slate-500">
                  Page <span className="font-bold text-[#0066FF]">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-900">{pagination.totalPages}</span>
                </div>

                <button
                  type="button"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => updateParam('page', currentPage + 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#0066FF] hover:text-white hover:border-[#0066FF] font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
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
