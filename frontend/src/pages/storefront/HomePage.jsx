import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../../components/storefront/Hero';
import { ProductCard } from '../../components/storefront/ProductCard';
import { Product3DShowcaseSection } from '../../components/storefront/Product3DShowcaseSection';
import {
  Cpu,
  Box,
  Sparkles,
  Zap,
  ArrowRight,
  Layers,
  ShieldCheck,
  Truck,
  RotateCcw,
  RotateCw,
  Sliders,
  User,
  CheckSquare,
} from 'lucide-react';
import { fetchCategories, fetchFeaturedProducts } from '../../services/catalogService';
import { DEFAULT_CATEGORIES, DEFAULT_FEATURED_PRODUCTS } from '../../data/mockCatalogData';

export function HomePage() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [featuredProducts, setFeaturedProducts] = useState(DEFAULT_FEATURED_PRODUCTS.slice(0, 8));
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));

    fetchFeaturedProducts(8)
      .then((data) => setFeaturedProducts(data))
      .catch((err) => console.error('Failed to load featured products:', err))
      .finally(() => setLoadingProducts(false));
  }, []);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'robotics-kits':
        return Cpu;
      case 'smart-controllers':
        return Zap;
      case '3d-printed-models':
        return Box;
      case 'anime-collectibles':
        return Sparkles;
      default:
        return Cpu;
    }
  };

  return (
    <div className="space-y-14 sm:space-y-16 pb-20 bg-white">
      {/* Robotic Futuristic Hero Section */}
      <Hero />

      {/* Futuristic 7-Category Horizontal Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
          {categories.slice(0, 7).map((cat) => {
            const categoryImageMap = {
              'robotic-cars': '/images/cat-1-robotic-cars.png',
              'ai-robots': '/images/cat-2-ai-robots.png',
              'robotics-kits': '/images/cat-3-robotics-kits.png',
              'smart-controllers': '/images/cat-4-smart-controllers.png',
              'sensors-components': '/images/cat-5-sensors-components.png',
              '3d-printed-models': '/images/cat-6-3d-models.png',
              'anime-collectibles': '/images/cat-7-anime-figures.png',
            };
            const imageUrl = categoryImageMap[cat.slug] || cat.image_url || '/images/cat-2-ai-robots.png';

            return (
              <Link
                key={cat.id || cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group relative p-[1.5px] bg-slate-200/90 hover:bg-[#0066FF] clip-chamfer-tl-bl-14 rounded-tr-2xl rounded-br-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,102,255,0.18)]"
              >
                <div className="w-full h-full bg-white clip-chamfer-tl-bl-14-inner rounded-tr-[14px] rounded-br-[14px] p-3 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Subtle Light-Blue Hexagon Wireframe Background (matches reference) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 text-blue-300 -translate-y-3">
                    <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <polygon points="50,5 92,27 92,73 50,95 8,73 8,27" />
                    </svg>
                  </div>

                  {/* Product Image Area */}
                  <div className="relative aspect-square w-full flex items-center justify-center p-1 overflow-hidden z-10 mb-2">
                    <img
                      src={imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-2xs"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom Row: Title + Circular Arrow Button */}
                  <div className="pt-2 z-10 flex items-end justify-between gap-1">
                    <h3 className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-[#0066FF] transition-colors leading-tight line-clamp-2">
                      {cat.name}
                    </h3>

                    <div className="w-5 h-5 rounded-full border border-blue-200 text-[#0066FF] group-hover:border-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section (Exact Reference Header & 4 Product Cards Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching reference image: // TRENDING NOW and Featured Products with connecting line */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 gap-3">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold tracking-wider text-[#0066FF] uppercase">
              <span className="text-sm font-black">//</span>
              <span>TRENDING NOW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Orbitron',sans-serif] tracking-tight mt-0.5">
              Featured Products
            </h2>
          </div>

          {/* Sci-Fi Connecting Dividing Line */}
          <div className="hidden sm:block flex-1 mx-6 h-[1.5px] bg-gradient-to-r from-slate-200 via-blue-200 to-transparent self-end mb-2" />

          <Link
            to="/products"
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-[#0066FF] hover:text-blue-700 flex items-center gap-1.5 group transition-colors self-end mb-1 shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Product Cards in a Row */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl border border-slate-200 bg-slate-50 animate-pulse p-4 flex flex-col justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-32 bg-slate-200 rounded w-full"></div>
                <div className="h-5 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Multi-Product 3D Showcase Section */}
      <Product3DShowcaseSection />

      {/* Why Choose LazyForge Highlights (Sci-Fi Chamfered Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="group relative p-[1.5px] bg-slate-200/90 hover:bg-[#0066FF] clip-chamfer-tl-bl-18 rounded-tr-2xl rounded-br-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,102,255,0.15)]">
            <div className="w-full h-full bg-white clip-chamfer-tl-bl-18-inner rounded-tr-[15px] rounded-br-[15px] p-6 space-y-3 relative overflow-hidden">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] shadow-2xs group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Orbitron',sans-serif] tracking-tight">Nationwide Express Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Fast reliable dispatch across Bangladesh with verified Cash on Delivery support.
              </p>
            </div>
          </div>

          <div className="group relative p-[1.5px] bg-slate-200/90 hover:bg-[#0066FF] clip-chamfer-tl-bl-18 rounded-tr-2xl rounded-br-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,102,255,0.15)]">
            <div className="w-full h-full bg-white clip-chamfer-tl-bl-18-inner rounded-tr-[15px] rounded-br-[15px] p-6 space-y-3 relative overflow-hidden">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] shadow-2xs group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Orbitron',sans-serif] tracking-tight">Quality-Tested Components</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Every microcontroller, servo, and 3D print is bench-tested by electronics engineers prior to packaging.
              </p>
            </div>
          </div>

          <div className="group relative p-[1.5px] bg-slate-200/90 hover:bg-[#0066FF] clip-chamfer-tl-bl-18 rounded-tr-2xl rounded-br-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,102,255,0.15)]">
            <div className="w-full h-full bg-white clip-chamfer-tl-bl-18-inner rounded-tr-[15px] rounded-br-[15px] p-6 space-y-3 relative overflow-hidden">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] shadow-2xs group-hover:scale-110 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Orbitron',sans-serif] tracking-tight">7-Day Hassle-Free Replacement</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Direct developer assistance and prompt replacement for any manufacturing defects or shipping issues.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
