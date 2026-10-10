import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../../components/storefront/Hero';
import { Cpu, Box, Sparkles, Zap, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

export function HomePage() {
  const categories = [
    {
      name: 'Robotics & Kits',
      slug: 'robotics-kits',
      icon: Cpu,
      desc: 'Bipedal walkers, robotic arms, obstacle-avoiding smart cars, and chassis.',
      badge: 'Popular',
    },
    {
      name: 'Smart Controllers',
      slug: 'smart-controllers',
      icon: Zap,
      desc: 'ESP32 Wi-Fi/BLE modules, Raspberry Pi, Arduino kits, and sensor arrays.',
      badge: 'High Demand',
    },
    {
      name: '3D-Printed Models',
      slug: '3d-printed-models',
      icon: Box,
      desc: 'Articulated dragons, custom robot armor, mechanical gadgets, and enclosures.',
      badge: 'Custom Forge',
    },
    {
      name: 'Anime Collectibles',
      slug: 'anime-collectibles',
      icon: Sparkles,
      desc: 'Cyberpunk figures, LED illuminated display pieces, and mechanical statues.',
      badge: 'Collector',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <Hero />

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-accentLight font-semibold">
              Curated Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Engineered Product Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-3 sm:mt-0 text-sm font-semibold text-brand-accentLight hover:text-white flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl bg-brand-surface border border-brand-border p-6 hover:border-brand-accent/50 hover:shadow-glow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center text-brand-accentLight group-hover:scale-105 group-hover:border-brand-accent transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-surfaceLight text-brand-silver font-semibold border border-brand-border">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-accentLight transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-6 flex items-center text-xs font-semibold text-brand-accentLight group-hover:translate-x-1 transition-transform">
                  <span>Explore items</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3D Lab Showcase Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-surface via-brand-dark to-brand-surface border border-brand-accent/30 p-8 sm:p-12 shadow-silver-card">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-dark border border-brand-accent/40 text-xs font-mono text-brand-accentLight">
              <Layers className="w-3.5 h-3.5" />
              <span>Three.js Realtime Graphics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Interact with Products in Full 3D Space
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Rotate, zoom, and inspect manufacturing-grade 3D details of robotics kits and 3D printed mechanical artifacts before purchasing.
            </p>
            <div className="pt-4">
              <Link
                to="/campaigns/robot-mascot"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-md transition-all"
              >
                <span>Launch 3D Mascot Showcase</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
