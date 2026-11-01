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
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { fetchCategories, fetchFeaturedProducts } from '../../services/catalogService';
import { DEFAULT_CATEGORIES, DEFAULT_FEATURED_PRODUCTS } from '../../data/mockCatalogData';

export function HomePage() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [featuredProducts, setFeaturedProducts] = useState(DEFAULT_FEATURED_PRODUCTS.slice(0, 8));
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories:', err));

    fetchFeaturedProducts(8)
      .then((data) => setFeaturedProducts(data))
      .catch((err) => console.error('Failed to load featured products:', err))
      .finally(() => setLoadingProducts(false));
  }, []);

  const filteredProducts = selectedFilter === 'all'
    ? featuredProducts.slice(0, 4)
    : featuredProducts.filter((p) => p.category_slug === selectedFilter || p.category_name?.toLowerCase().includes(selectedFilter.replace('-', ' '))).slice(0, 4);

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : featuredProducts.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 bg-white">
      {/* Robotic Futuristic Hero Section with Ambient Lighting */}
      <Hero />

      {/* Luxury Telemetry Metric Banner (Between Hero and Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#0B0F19] via-[#0F172A] to-[#0B0F19] border border-blue-900/50 p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
          {/* Subtle Cyber Glowing Hairline */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0066FF] to-transparent" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="flex items-center space-x-3.5 pt-2 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00D2FF] flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-[#38BDF8] font-bold uppercase tracking-wider">64 Districts</div>
                <div className="text-sm font-bold font-['Orbitron',sans-serif] text-white">Cash on Delivery</div>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00D2FF] flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-[#38BDF8] font-bold uppercase tracking-wider">100% Genuine</div>
                <div className="text-sm font-bold font-['Orbitron',sans-serif] text-white">Bench-Tested Tech</div>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00D2FF] flex items-center justify-center shrink-0 shadow-xs">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-[#38BDF8] font-bold uppercase tracking-wider">0.05mm Additive</div>
                <div className="text-sm font-bold font-['Orbitron',sans-serif] text-white">STL & 3MF Slicing</div>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00D2FF] flex items-center justify-center shrink-0 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-[#38BDF8] font-bold uppercase tracking-wider">7-Day Guarantee</div>
                <div className="text-sm font-bold font-['Orbitron',sans-serif] text-white">Hassle-Free Returns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic 7-Category Horizontal Shelf with Perfect Card Shapes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider text-[#0066FF] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              <span>// HARDWARE ECOSYSTEM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Orbitron',sans-serif] tracking-tight uppercase">
              Explore By Sector
            </h2>
          </div>

          <Link
            to="/categories"
            className="text-xs sm:text-sm font-bold text-[#0066FF] hover:text-blue-700 flex items-center gap-1.5 group font-['Orbitron',sans-serif] transition-colors"
          >
            <span>All Sectors</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
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
                className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-[#0066FF] shadow-[0_4px_16px_rgba(0,102,255,0.05)] hover:shadow-[0_12px_28px_rgba(0,102,255,0.18)] hover:-translate-y-1.5 transition-all duration-300 p-3.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Subtle Cyber Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#0066FF] to-[#00D2FF] transition-all duration-300" />

                {/* Corner Tech Markings */}
                <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-blue-400/30 group-hover:border-[#0066FF] transition-colors" />

                {/* Category Image on Glowing Radial Pedestal */}
                <div className="relative aspect-square w-full rounded-xl bg-gradient-to-b from-[#F0F5FF]/80 via-slate-50/50 to-white flex items-center justify-center p-2 mb-2.5 overflow-hidden border border-slate-100/80">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.06)_0%,transparent_70%)] pointer-events-none" />
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-sm relative z-10"
                    loading="lazy"
                  />
                </div>

                {/* Bottom Row: Title + Circular Arrow Button */}
                <div className="pt-1 flex items-end justify-between gap-1 z-10">
                  <div className="space-y-0.5">
                    <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-[#0066FF] font-['Orbitron',sans-serif] transition-colors leading-tight line-clamp-1">
                      {cat.name}
                    </h3>
                    <span className="text-[9px] font-mono text-slate-400 font-semibold block uppercase">
                      Hardware Hub
                    </span>
                  </div>

                  <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-[#0066FF] text-slate-500 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-2xs">
                    <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section with Perfect Card Shapes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header with Sector Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/90 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider text-[#0066FF] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              <span>// VERIFIED HARDWARE DEPLOYMENTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Orbitron',sans-serif] tracking-tight uppercase mt-0.5">
              Featured Products
            </h2>
          </div>

          {/* Quick Sector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All Units', value: 'all' },
              { label: 'Robotic Cars', value: 'robotic-cars' },
              { label: 'AI Robots', value: 'ai-robots' },
              { label: 'Controllers', value: 'smart-controllers' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedFilter(tab.value)}
                className={`px-3 py-1 rounded-full text-xs font-['Orbitron',sans-serif] font-bold transition-all cursor-pointer ${
                  selectedFilter === tab.value
                    ? 'bg-[#0066FF] text-white shadow-[0_2px_10px_rgba(0,102,255,0.3)]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <Link
              to="/products"
              className="text-xs font-bold text-[#0066FF] hover:text-blue-700 flex items-center gap-1 group font-['Orbitron',sans-serif] transition-colors ml-2"
            >
              <span>Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Product Cards Grid with Perfect Shape */}
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
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Multi-Product 3D Showcase Section (.STL & .3MF Additive CAD) */}
      <Product3DShowcaseSection />

      {/* Why Choose LazyForge Highlights - Luxurious Frosted Tech Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-mono font-bold text-[#0066FF] uppercase tracking-wider">
            BENCHMARK RELIABILITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Orbitron',sans-serif] uppercase">
            The LazyForge Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative rounded-2xl bg-gradient-to-b from-white to-slate-50/90 border border-slate-200/90 hover:border-[#0066FF] p-7 space-y-4 shadow-[0_4px_20px_rgba(0,102,255,0.06)] hover:shadow-[0_16px_36px_rgba(0,102,255,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
            <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#0066FF] to-[#00D2FF] transition-all duration-500 absolute top-0 left-0" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-blue-400/30 group-hover:border-[#0066FF] transition-colors" />

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF] to-blue-700 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,102,255,0.35)] group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[#0066FF] uppercase tracking-wider block">
                [ NATIONWIDE LOGISTICS ]
              </span>
              <h3 className="text-base font-bold text-slate-900 font-['Orbitron',sans-serif] tracking-tight">
                Nationwide Express Delivery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Reliable 24-48 hour express dispatch nationwide with verified Cash on Delivery and SSLCommerz protection.
              </p>
            </div>
          </div>

          <div className="group relative rounded-2xl bg-gradient-to-b from-white to-slate-50/90 border border-slate-200/90 hover:border-[#0066FF] p-7 space-y-4 shadow-[0_4px_20px_rgba(0,102,255,0.06)] hover:shadow-[0_16px_36px_rgba(0,102,255,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
            <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#0066FF] to-[#00D2FF] transition-all duration-500 absolute top-0 left-0" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-blue-400/30 group-hover:border-[#0066FF] transition-colors" />

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF] to-blue-700 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,102,255,0.35)] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[#0066FF] uppercase tracking-wider block">
                [ LAB QA ASSURANCE ]
              </span>
              <h3 className="text-base font-bold text-slate-900 font-['Orbitron',sans-serif] tracking-tight">
                Quality-Tested Components
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every microcontroller, servo, and 3D print undergoes signal continuity and load testing by engineers in our Dhaka lab.
              </p>
            </div>
          </div>

          <div className="group relative rounded-2xl bg-gradient-to-b from-white to-slate-50/90 border border-slate-200/90 hover:border-[#0066FF] p-7 space-y-4 shadow-[0_4px_20px_rgba(0,102,255,0.06)] hover:shadow-[0_16px_36px_rgba(0,102,255,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
            <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#0066FF] to-[#00D2FF] transition-all duration-500 absolute top-0 left-0" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-blue-400/30 group-hover:border-[#0066FF] transition-colors" />

            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066FF] to-blue-700 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,102,255,0.35)] group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[#0066FF] uppercase tracking-wider block">
                [ HARDWARE GUARANTEE ]
              </span>
              <h3 className="text-base font-bold text-slate-900 font-['Orbitron',sans-serif] tracking-tight">
                7-Day Replacement Policy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Direct engineer assistance and rapid 7-day replacement guarantee against any transit damages or hardware faults.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* University & Builder Trust Strip (Luxury Corporate Authority) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200/90 text-center space-y-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
            TRUSTED BY ROBOTICS CLUBS & ENGINEERING RESEARCHERS ACROSS BANGLADESH
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono font-bold text-slate-600">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">BUET ROBOTICS SOCIETY</span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">DHAKA UNIVERSITY IT SOCIETY</span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">IUT MECHATRONICS LAB</span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">RUET ROBO CREW</span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">CUET ROBOTICS</span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">BRAC ROVER TEAM</span>
          </div>
        </div>
      </section>
    </div>
  );
}
