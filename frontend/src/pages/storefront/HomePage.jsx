import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../../components/storefront/Hero';
import { ProductCard } from '../../components/storefront/ProductCard';
import { Cpu, Box, Sparkles, Zap, ArrowRight, Layers, ShieldCheck, Truck, RotateCcw, User, CheckSquare } from 'lucide-react';
import { fetchCategories, fetchFeaturedProducts } from '../../services/catalogService';

export function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
    <div className="space-y-20 pb-20 bg-white">
      {/* Hero Section with Fullscreen Clear Video */}
      <Hero />

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] font-bold">
              Hardware Lab Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-graphite mt-1">
              Curated Engineering Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-3 sm:mt-0 text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] flex items-center gap-1 group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {categories.slice(0, 4).map((cat) => {
            const categoryImageMap = {
              'robotics-kits': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
              'smart-controllers': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
              '3d-printed-models': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
              'anime-collectibles': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
              'electronic-accessories': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
            };
            const imageUrl = categoryImageMap[cat.slug] || cat.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';

            return (
              <Link
                key={cat.id || cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group relative aspect-[9/13.8] min-h-[430px] rounded-[38px] overflow-hidden border-[8px] border-white ring-1 ring-slate-900/5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:shadow-[0_28px_60px_rgba(139,92,246,0.2)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-end bg-[#F1F3F5]"
              >
                {/* Full-Bleed Background Image */}
                <img
                  src={imageUrl}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                  loading="lazy"
                />

                {/* Subtle Frosted Glass Bottom Overlay (Full image shines through) */}
                <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-white/95 via-white/80 to-transparent backdrop-blur-[6px] z-10 pointer-events-none transition-all group-hover:from-white/98 group-hover:via-white/85" />

                {/* Floating Content Over Frosted Glass */}
                <div className="relative z-20 p-5 space-y-2.5">
                  {/* Category Name + Green Verified Badge */}
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-[17px] font-bold text-[#111827] group-hover:text-[#8B5CF6] transition-colors tracking-tight">
                        {cat.name}
                      </h3>
                      {/* Green Verified Scalloped Badge */}
                      <span className="w-[18px] h-[18px] rounded-full bg-[#15803D] flex items-center justify-center text-white shrink-0 shadow-xs ring-1 ring-white/60">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </div>

                    {/* Subtitle / Description */}
                    <p className="text-xs text-[#4B5563] mt-1 leading-relaxed line-clamp-2 font-normal">
                      {cat.description}
                    </p>
                  </div>

                  {/* Bottom Stats & Follow/Explore+ Pill Button */}
                  <div className="pt-1.5 flex items-center justify-between">
                    {/* Stats on Left */}
                    <div className="flex items-center space-x-3 text-xs text-[#64748B]">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-[#64748B]" />
                        <span className="font-semibold text-[#1E293B]">
                          {cat.slug === 'robotics-kits' ? '312' : cat.slug === 'smart-controllers' ? '428' : cat.slug === '3d-printed-models' ? '195' : '264'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-[#64748B]" />
                        <span className="font-semibold text-[#1E293B]">{cat.product_count || 48}</span>
                      </div>
                    </div>

                    {/* White Pill Button on Right (Matching Follow + in mockup) */}
                    <div className="px-4 py-2 rounded-full bg-white text-[#111827] group-hover:bg-[#8B5CF6] group-hover:text-white group-hover:border-[#8B5CF6] text-xs font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center space-x-1 transition-all duration-300">
                      <span>Follow</span>
                      <span className="font-bold text-sm leading-none">+</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] font-bold">
              Bangladesh's Top Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-graphite mt-1">
              Featured Hardware & Robotics
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-3 sm:mt-0 text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] flex items-center gap-1 group"
          >
            <span>View All ({featuredProducts.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-brand-border animate-pulse space-y-4">
                <div className="aspect-square bg-brand-softGray rounded-xl"></div>
                <div className="h-4 bg-brand-softGray rounded w-3/4"></div>
                <div className="h-4 bg-brand-softGray rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3D Lab Showcase Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-softGray via-white to-purple-50 border border-[#8B5CF6]/30 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#8B5CF6]/30 text-xs font-mono font-bold text-[#8B5CF6] shadow-sm">
              <Layers className="w-3.5 h-3.5" />
              <span>Three.js Realtime Graphics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-graphite">
              Interact with Products in Full 3D Space
            </h2>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Rotate, zoom, and inspect manufacturing-grade 3D details of robotics kits and 3D printed mechanical artifacts before purchasing.
            </p>
            <div className="pt-4">
              <Link
                to="/campaigns/robot-mascot"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-md hover:scale-105 transition-all"
              >
                <span>Launch 3D Mascot Showcase</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

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
