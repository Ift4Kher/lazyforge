import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Zap,
  RotateCw,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Bot,
  Box,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { RobotViewer3D } from './RobotViewer3D';
import { useCart } from '../../context/CartContext';
import { formatBDT } from '../../utils/currency';

// Fallback products with 3D presets if API is offline
const DEFAULT_3D_PRODUCTS = [
  {
    id: 9,
    name: 'LazyForge Apex-01 Autonomous Tabletop Robot Companion',
    slug: 'lazyforge-apex-01-companion',
    sku: 'LF-MASCOT-01',
    category_name: 'Robotics Kits',
    model_3d_url: 'apex_mascot',
    model_3d_format: 'preset',
    regular_price: '28500.00',
    sale_price: '24900.00',
    total_stock: 15,
    short_description:
      'Autonomous cyber mascot companion with reactive OLED visor, dual telemetry antennas, and 12-axis articulated magnetic servo platform.',
    specifications: {
      'Microcontroller': 'ESP32-S3 Dual-Core @ 240MHz',
      'Degrees of Freedom': '12-DOF Magnetic Articulation',
      'Visor Display': 'Curved 1.54" Cyber-Cyan OLED Array',
      'Chassis': 'Ceramic-Coated Matte Polycarbonate',
    },
  },
  {
    id: 1,
    name: 'ESP32 Autonomous Quadruped Spider Robot Kit',
    slug: 'esp32-autonomous-quadruped-spider-robot-kit',
    sku: 'LF-ROB-001',
    category_name: 'Robotics Kits',
    model_3d_url: 'spider_bot',
    model_3d_format: 'preset',
    regular_price: '4800.00',
    sale_price: '4250.00',
    total_stock: 37,
    short_description:
      '12-DOF programmable spider robot powered by ESP32 with Wi-Fi/Bluetooth control and obstacle avoidance.',
    specifications: {
      'Microcontroller': 'ESP32-WROOM-32D Dual-Core',
      'Degrees of Freedom': '12 DOF (3 per leg)',
      'Actuators': '12x SG90 Metal-Gear Servos',
      'Sensors': 'HC-SR04 Ultrasonic Sonar Eyes',
    },
  },
  {
    id: 2,
    name: '4-DOF Metal Industrial Robotic Arm with Claw',
    slug: '4-dof-metal-industrial-robotic-arm-with-claw',
    sku: 'LF-ROB-002',
    category_name: 'Robotics Kits',
    model_3d_url: 'robotic_arm',
    model_3d_format: 'preset',
    regular_price: '3600.00',
    sale_price: '3200.00',
    total_stock: 33,
    short_description:
      'Precision all-aluminum mechanical robotic manipulator arm with high-torque MG996R servos.',
    specifications: {
      'Payload Capacity': '250 grams',
      'Reach Radius': '320mm maximum extension',
      'Servos': '4x MG996R Metal Gear 13kg/cm',
      'Base Turntable': '360° Industrial Bearing',
    },
  },
  {
    id: 3,
    name: 'ESP32-WROOM-32D Dual-Core Dev Board (Type-C)',
    slug: 'esp32-wroom-32d-dual-core-dev-board-type-c',
    sku: 'LF-CTRL-001',
    category_name: 'Smart Controllers',
    model_3d_url: 'esp32_core',
    model_3d_format: 'preset',
    regular_price: '650.00',
    sale_price: '520.00',
    total_stock: 125,
    short_description:
      'Upgraded USB Type-C 38-Pin ESP32 board with CH340 chip, Wi-Fi, and Bluetooth 4.2 BLE.',
    specifications: {
      'Processor': 'Tensilica Xtensa Dual-Core @ 240MHz',
      'Connectivity': '802.11 b/g/n Wi-Fi + BLE 4.2',
      'Pins': '38 Gold-Plated Header Pins',
      'Interface': 'Reversible USB Type-C',
    },
  },
  {
    id: 5,
    name: 'Articulated Silk Crystal Mech Dragon (50cm)',
    slug: 'articulated-silk-crystal-mech-dragon-50cm',
    sku: 'LF-3DP-001',
    category_name: '3D Printed Models',
    model_3d_url: 'mech_drone',
    model_3d_format: 'preset',
    regular_price: '1950.00',
    sale_price: '1650.00',
    total_stock: 35,
    short_description:
      'Full multi-joint articulated mechanical drone & dragon with dual-tone iridescent silk PLA.',
    specifications: {
      'Length': '50 cm (20 inches)',
      'Layer Height': '0.12mm Ultra-Fine Detail',
      'Joint Architecture': 'Print-in-Place Multi-Axis Interlock',
      'Material': 'High-Impact Biocompatible Silk PLA',
    },
  },
];

export function Product3DShowcaseSection({ className = '', title, subtitle }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(DEFAULT_3D_PRODUCTS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load3DProducts() {
      try {
        const res = await fetch('/api/v1/products/3d-models');
        if (!res.ok) throw new Error('Failed to fetch 3D products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          // Filter products that have a 3D model assigned
          const models3D = data.products.filter((p) => Boolean(p.model_3d_url));
          if (isMounted && models3D.length > 0) {
            setProducts(models3D);
          }
        }
      } catch (err) {
        console.warn('Could not load 3D products from API, using default catalog:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load3DProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeProduct = products[selectedIndex] || products[0] || DEFAULT_3D_PRODUCTS[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleAddToCart = () => {
    if (!activeProduct) return;
    addToCart(activeProduct, 1);
    setAddedItem(activeProduct.id);
    setTimeout(() => setAddedItem(null), 2500);
  };

  const currentPrice = activeProduct.sale_price || activeProduct.regular_price;
  const hasDiscount = Boolean(activeProduct.sale_price && activeProduct.sale_price < activeProduct.regular_price);

  return (
    <section className={`relative overflow-hidden py-16 sm:py-24 bg-[#080B11] text-white border-y border-white/5 ${className}`}>
      {/* Sci-Fi Cyber Ambient Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-accent/20 border border-brand-accent/40 text-brand-accent uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive CAD Showcase</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Multi-Product 3D WebGL
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {title || 'Inspect Robotics & Hardware in Full 3D'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {subtitle ||
                'Experience LazyForge engineering prior to ordering. Orbit 360°, inspect wireframe tolerances, and review live hardware telemetry for our robots, controllers, and 3D printed artifacts.'}
            </p>
          </div>

          {/* Model Navigation Arrows & Counter */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              UNIT <span className="text-white font-bold">{selectedIndex + 1}</span> OF{' '}
              <span className="text-purple-400 font-bold">{products.length}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-accent hover:bg-white/10 text-white transition-all active:scale-95"
                title="Previous 3D Model"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-accent hover:bg-white/10 text-white transition-all active:scale-95"
                title="Next 3D Model"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Model Selector Pills */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          {products.map((prod, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={prod.id || index}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-mono whitespace-nowrap transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600/40 to-cyan-500/30 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <Bot
                  className={`w-4 h-4 ${
                    isSelected ? 'text-cyan-400 animate-pulse' : 'text-slate-500'
                  }`}
                />
                <span className="font-semibold truncate max-w-[200px]">{prod.name}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main 3D Showcase Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Three.js Canvas */}
          <div className="lg:col-span-7 relative">
            {/* Cyber Corner Brackets */}
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-purple-400 z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-purple-400 z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

            {/* Embedded 3D Canvas */}
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/40 shadow-[0_0_50px_rgba(139,92,246,0.3)] ring-1 ring-cyan-500/20">
              <RobotViewer3D
                key={activeProduct.id || activeProduct.model_3d_url}
                height="520px"
                modelType={activeProduct.model_3d_url || 'apex_mascot'}
                modelUrl={activeProduct.model_3d_format === 'preset' ? null : activeProduct.model_3d_url}
                productName={activeProduct.name}
              />
            </div>
          </div>

          {/* Right: Product Spec Sheet, Pricing, & Cart Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activeProduct.category_name || 'Robotics & Hardware'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  {activeProduct.total_stock > 0 ? `${activeProduct.total_stock} Units In Stock` : 'Pre-Order Active'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {activeProduct.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                {activeProduct.short_description || activeProduct.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Engineered Unit Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                    {formatBDT(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm font-mono text-slate-500 line-through">
                      {formatBDT(activeProduct.regular_price)}
                    </span>
                  )}
                </div>
              </div>

              {hasDiscount && (
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  SAVE BDT {Math.round(activeProduct.regular_price - activeProduct.sale_price)}
                </span>
              )}
            </div>

            {/* Hardware Specifications Table */}
            {activeProduct.specifications && Object.keys(activeProduct.specifications).length > 0 && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                <div className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-white/10">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hardware &amp; CAD Specifications</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(activeProduct.specifications)
                    .slice(0, 4)
                    .map(([key, val]) => (
                      <div key={key} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                        <div className="text-[10px] text-slate-400 truncate">{key}</div>
                        <div className="font-bold text-slate-200 truncate">{String(val)}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Added to Cart Feedback Banner */}
            {addedItem === activeProduct.id && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unit added to dispatch inventory! Ready in your cart.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6366F1] text-white shadow-[0_0_30px_rgba(139,92,246,0.55)] hover:shadow-[0_0_45px_rgba(139,92,246,0.85)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Deploy Unit (Add to Cart)</span>
              </button>

              <Link
                to={`/products/${activeProduct.slug}`}
                className="inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-400/50 text-white backdrop-blur-md transition-all duration-300"
              >
                <span>Full Specs</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>

            {/* Telemetry Guarantee Meta */}
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bench-Tested Hardware</span>
              </span>
              <span>&bull;</span>
              <span>Cash on Delivery across BD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Product3DShowcaseSection;
