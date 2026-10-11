import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../../components/storefront/Hero';
import { ProductCard } from '../../components/storefront/ProductCard';
import { Cpu, Box, Sparkles, Zap, ArrowRight, Layers, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            const fallbackImage = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';
            const imageUrl = cat.image_url || fallbackImage;

            return (
              <Link
                key={cat.id || cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group relative rounded-3xl bg-white border border-brand-border hover:border-[#8B5CF6]/50 overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                {/* Category Image Area */}
                <div className="relative w-full aspect-[4/3] bg-brand-softGray overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle dark bottom gradient on image for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>

                  {/* Top Floating Glass Badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-[11px] font-bold text-[#8B5CF6] shadow-sm">
                    <Icon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>{cat.name.split(' ')[0]}</span>
                  </div>

                  {/* Item Count Chip */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-white shadow-sm border border-white/20">
                    {cat.product_count} Items
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-graphite group-hover:text-[#8B5CF6] transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1.5 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-brand-border/60 flex items-center justify-between text-xs font-bold text-[#8B5CF6]">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
