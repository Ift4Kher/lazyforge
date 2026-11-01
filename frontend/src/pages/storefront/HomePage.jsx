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
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
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
                className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-[#0066FF] hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)] p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Image Area */}
                <div className="relative aspect-square w-full flex items-center justify-center p-1 overflow-hidden mb-2">
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Bottom Row: Title + Arrow Circle Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0066FF] transition-colors line-clamp-2 leading-tight">
                    {cat.name}
                  </h3>

                  <div className="w-6 h-6 rounded-full border border-slate-300 text-slate-500 group-hover:border-[#0066FF] group-hover:text-[#0066FF] group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section (Exact Reference Header & 4 Product Cards Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching reference image: // TRENDING NOW and Featured Products */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold tracking-wider text-[#0066FF] uppercase">
              <span className="text-sm font-black">//</span>
              <span>TRENDING NOW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Orbitron',sans-serif] tracking-tight mt-1">
              Featured Products
            </h2>
          </div>

          <Link
            to="/products"
            className="mt-3 sm:mt-0 text-sm font-bold text-[#0066FF] hover:text-blue-700 flex items-center gap-1.5 group transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

      {/* Why Choose LazyForge Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-brand-softGray border border-brand-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-[#8B5CF6] shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-graphite">Nationwide Express Delivery</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Fast reliable dispatch across Bangladesh with verified Cash on Delivery support.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-softGray border border-brand-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-[#8B5CF6] shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-graphite">Quality-Tested Components</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Every microcontroller, servo, and 3D print is bench-tested by electronics engineers prior to packaging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-softGray border border-brand-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-[#8B5CF6] shadow-sm">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-graphite">7-Day Hassle-Free Replacement</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Direct developer assistance and prompt replacement for any manufacturing defects or shipping issues.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
