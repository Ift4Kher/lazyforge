import React, { useState, useEffect, useMemo } from 'react';
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
  FileCode,
  Download,
  Printer,
  Compass,
} from 'lucide-react';
import { RobotViewer3D } from './RobotViewer3D';
import { useCart } from '../../context/CartContext';
import { formatBDT } from '../../utils/currency';

// Flagship Catalog with default 3D models including verified .STL additive print mesh
const DEFAULT_3D_PRODUCTS = [
  {
    id: 101,
    name: 'Bipedal Autonomous Combat Walker (.STL Additive Mesh)',
    slug: 'bipedal-combat-walker',
    sku: 'LF-STL-001',
    category_name: '3D CAD Hardware',
    model_3d_url: '/uploads/models/bipedal-combat-walker.stl',
    model_3d_format: 'stl',
    regular_price: '5800.00',
    sale_price: '4950.00',
    total_stock: 22,
    short_description:
      'Engineered Solidworks/Fusion360 additive manufacturing .STL mesh. Features dual ball-joint hip articulation, torso laser mounts, and reinforced shock-absorbing foot pads.',
    specifications: {
      'CAD Format': '.STL Standard Tessellation Mesh',
      'Layer Slicing': '0.12 - 0.20 mm Recommended',
      'Filament Spec': 'Carbon-Fiber PLA / PETG / Resin',
      'Print Tolerance': '±0.05 mm Mechanical Clearance',
    },
  },
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
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'additive' | 'robotics'
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
            // Prioritize custom admin uploads (.stl, .3mf, .glb) at the front
            const adminUploads = models3D.filter(
              (p) =>
                p.model_3d_url.startsWith('/uploads/') ||
                p.model_3d_format === 'stl' ||
                p.model_3d_format === '3mf' ||
                p.model_3d_format === 'glb'
            );
            const defaultFiltered = DEFAULT_3D_PRODUCTS.filter(
              (def) => !adminUploads.some((up) => up.slug === def.slug)
            );
            setProducts([...adminUploads, ...defaultFiltered]);
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

  // Filtered view
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'additive') {
      return products.filter((p) => {
        const url = (p.model_3d_url || '').toLowerCase();
        const fmt = (p.model_3d_format || '').toLowerCase();
        return url.endsWith('.stl') || url.endsWith('.3mf') || fmt === 'stl' || fmt === '3mf' || p.category_name?.includes('3D');
      });
    }
    if (activeFilter === 'robotics') {
      return products.filter((p) => {
        const url = (p.model_3d_url || '').toLowerCase();
        const fmt = (p.model_3d_format || '').toLowerCase();
        return !url.endsWith('.stl') && !url.endsWith('.3mf') && fmt !== 'stl' && fmt !== '3mf';
      });
    }
    return products;
  }, [products, activeFilter]);

  const activeProduct =
    filteredProducts[selectedIndex] || filteredProducts[0] || products[0] || DEFAULT_3D_PRODUCTS[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const handleAddToCart = () => {
    if (!activeProduct) return;
    addToCart(activeProduct, 1);
    setAddedItem(activeProduct.id);
    setTimeout(() => setAddedItem(null), 2500);
  };

  const currentPrice = activeProduct.sale_price || activeProduct.regular_price;
  const hasDiscount = Boolean(activeProduct.sale_price && activeProduct.sale_price < activeProduct.regular_price);

  // Helper: determine format label
  const getFormatBadge = (prod) => {
    const url = (prod.model_3d_url || '').toLowerCase();
    const fmt = (prod.model_3d_format || '').toLowerCase();
    if (url.endsWith('.stl') || fmt === 'stl') {
      return { text: '.STL', bg: 'bg-[#00D2FF]/20 text-[#00D2FF] border-[#00D2FF]/40', type: 'stl' };
    }
    if (url.endsWith('.3mf') || fmt === '3mf') {
      return { text: '.3MF', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', type: '3mf' };
    }
    if (url.endsWith('.glb') || url.endsWith('.gltf') || fmt === 'glb' || fmt === 'gltf') {
      return { text: '.GLB', bg: 'bg-[#0066FF]/20 text-[#38BDF8] border-[#0066FF]/40', type: 'glb' };
    }
    return { text: 'CAD', bg: 'bg-white/10 text-slate-300 border-white/20', type: 'preset' };
  };

  const activeBadge = getFormatBadge(activeProduct);
  const isUploadedModel = Boolean(activeProduct.model_3d_url?.startsWith('/uploads/'));

  return (
    <section className={`relative overflow-hidden py-16 sm:py-24 bg-[#07090E] text-white border-y border-white/10 ${className}`}>
      {/* Sci-Fi Ambient Glow & Blueprint Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0066ff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0066FF]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00D2FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#00D2FF] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>HARDWARE CAD TELEMETRY LAB</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/15 text-slate-300">
                .STL &bull; .3MF &bull; .GLB MULTI-FORMAT
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                ● Live WebGL 60 FPS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-orbitron">
              {title || 'INSPECT ROBOTICS, 3MF & STL PRINT FILES'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium">
              {subtitle ||
                'Experience LazyForge engineering prior to ordering. Orbit 360°, inspect additive manufacturing triangle meshes (.STL & .3MF), toggle X-ray wireframes, and verify dimensional clearances for robots and 3D printed models.'}
            </p>
          </div>

          {/* Model Navigation & Counter */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              UNIT <span className="text-white font-bold">{selectedIndex + 1}</span> OF{' '}
              <span className="text-[#00D2FF] font-bold">{filteredProducts.length}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#0066FF] hover:bg-white/10 text-white transition-all active:scale-95 cursor-pointer"
                title="Previous 3D Model"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#0066FF] hover:bg-white/10 text-white transition-all active:scale-95 cursor-pointer"
                title="Next 3D Model"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <button
            onClick={() => { setActiveFilter('all'); setSelectedIndex(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            ALL 3D UNITS ({products.length})
          </button>
          <button
            onClick={() => { setActiveFilter('additive'); setSelectedIndex(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'additive'
                ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>.STL &amp; .3MF ADDITIVE PRINT FILES</span>
          </button>
          <button
            onClick={() => { setActiveFilter('robotics'); setSelectedIndex(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'robotics'
                ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>ROBOTIC RIGS &amp; CONTROLLERS</span>
          </button>
        </div>

        {/* Product Model Selector Pills */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          {filteredProducts.map((prod, index) => {
            const isSelected = index === selectedIndex;
            const badge = getFormatBadge(prod);
            const isUploaded = Boolean(prod.model_3d_url?.startsWith('/uploads/'));
            return (
              <button
                key={prod.id || index}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-mono whitespace-nowrap transition-all shrink-0 border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0066FF]/40 to-[#00D2FF]/30 border-[#00D2FF] text-white shadow-[0_0_20px_rgba(0,102,255,0.35)] ring-1 ring-[#00D2FF]/50'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                  {badge.text}
                </span>
                <span className="font-semibold truncate max-w-[220px]">{prod.name}</span>
                {isUploaded && (
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    ADMIN
                  </span>
                )}
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main 3D Showcase Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Interactive Three.js Canvas */}
          <div className="lg:col-span-7 relative">
            {/* Cyber Corner Brackets */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#00D2FF] z-20 pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#0066FF] z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#0066FF] z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#00D2FF] z-20 pointer-events-none" />

            {/* Embedded 3D Canvas */}
            <div className="relative rounded-3xl overflow-hidden border border-[#0066FF]/40 shadow-[0_0_60px_rgba(0,102,255,0.25)] ring-1 ring-[#00D2FF]/20 bg-[#0A0D14]">
              <RobotViewer3D
                key={activeProduct.id || activeProduct.model_3d_url}
                height="540px"
                modelType={activeProduct.model_3d_url || 'apex_mascot'}
                modelUrl={activeProduct.model_3d_format === 'preset' ? null : activeProduct.model_3d_url}
                productName={activeProduct.name}
              />
            </div>
          </div>

          {/* Right: Product Spec Sheet, Pricing, & Cart Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#0066FF]/20 text-[#38BDF8] border border-[#0066FF]/30">
                  {activeProduct.category_name || 'Robotics & Hardware'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${activeBadge.bg}`}>
                  {activeBadge.type === 'stl'
                    ? 'STL Tessellated Mesh'
                    : activeBadge.type === '3mf'
                    ? '3MF Multi-Part Mesh'
                    : activeBadge.type === 'glb'
                    ? 'GLB Articulated Rig'
                    : 'Parametric CAD Rig'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  {activeProduct.total_stock > 0 ? `${activeProduct.total_stock} Units In Stock` : 'Custom Print Queue'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug font-orbitron">
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
                  <span className="text-2xl sm:text-3xl font-black font-orbitron text-[#00D2FF]">
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

            {/* Additive Manufacturing / Slicer Telemetry Pill */}
            {(activeBadge.type === 'stl' || activeBadge.type === '3mf') && (
              <div className="p-3.5 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#00D2FF]">
                  <span className="flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Additive 3D Print Ready File</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    SLICER READY
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-300">
                  Directly verified for Bambu Studio, Cura, PrusaSlicer &amp; OrcaSlicer. Water-tight manifold geometry.
                </p>
              </div>
            )}

            {/* Hardware Specifications Table */}
            {activeProduct.specifications && Object.keys(activeProduct.specifications).length > 0 && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                <div className="text-[11px] font-mono font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-white/10 font-orbitron">
                  <Cpu className="w-3.5 h-3.5 text-[#00D2FF]" />
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
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-bold font-orbitron text-xs tracking-wider bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-[0_0_30px_rgba(0,102,255,0.45)] hover:shadow-[0_0_45px_rgba(0,102,255,0.7)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>ORDER HARDWARE UNIT</span>
              </button>

              {isUploadedModel && (
                <a
                  href={activeProduct.model_3d_url}
                  download
                  className="inline-flex items-center justify-center space-x-2 px-5 py-4 rounded-xl font-bold font-mono text-xs bg-white/5 hover:bg-white/10 border border-[#00D2FF]/40 text-[#00D2FF] backdrop-blur-md transition-all duration-300 cursor-pointer"
                  title="Download Raw 3D Model File"
                >
                  <Download className="w-4 h-4" />
                  <span>CAD FILE</span>
                </a>
              )}

              <Link
                to={`/products/${activeProduct.slug}`}
                className="inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-bold font-orbitron text-xs bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00D2FF]/50 text-white backdrop-blur-md transition-all duration-300"
              >
                <span>FULL SPECS</span>
                <ArrowRight className="w-4 h-4 text-[#00D2FF]" />
              </Link>
            </div>

            {/* Telemetry Guarantee Meta */}
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bench-Tested Telemetry</span>
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
