import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  RotateCw,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { RobotViewer3D } from '../../components/storefront/RobotViewer3D';
import { Product3DShowcaseSection } from '../../components/storefront/Product3DShowcaseSection';
import { useCart } from '../../context/CartContext';
import { formatBDT } from '../../utils/currency';

export function RobotMascotPage() {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const mascotProduct = {
    id: 101,
    name: 'LazyForge Apex-01 Autonomous Tabletop Robot Companion',
    slug: 'lazyforge-apex-01-companion',
    sku: 'LF-MASCOT-01',
    regular_price: '28500.00',
    sale_price: '24900.00',
    total_stock: 15,
    primary_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  };

  const handleAddToCart = () => {
    addToCart(mascotProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-white">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-accent/20 border border-brand-accent/40 text-brand-accent tracking-wider uppercase">
            Interactive 3D Robotics Showcase
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Real-Time WebGL 60 FPS
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
          Apex-01 Autonomous Robotics Companion
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mt-3 leading-relaxed">
          Engineered by LazyForge Technologies. Features an ESP32 dual-core neural coprocessor,
          12-axis articulated magnetic servos, tactile reactive LED visor, and high-frequency edge telemetry.
        </p>
      </div>

      {/* Main 3D Stage Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left/Center: Three.js WebGL Interactive Canvas */}
          <div className="lg:col-span-8">
            <RobotViewer3D height="560px" />
          </div>

          {/* Right: Technical Spec Sheet & Commerce Unit */}
          <div className="lg:col-span-4 space-y-6">
            {/* Price & Order Card */}
            <div className="p-6 rounded-3xl bg-[#111624] border border-white/10 space-y-5 shadow-xl">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                  Pre-Configured Assembly Kit
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {formatBDT(mascotProduct.sale_price)}
                  </span>
                  <span className="text-sm font-mono text-slate-500 line-through">
                    {formatBDT(mascotProduct.regular_price)}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  ✓ Available in Stock &bull; Ships within 24 Hours in Bangladesh
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{added ? 'Added to Cart!' : 'Add Apex-01 to Cart'}</span>
                </button>
                <Link
                  to="/checkout"
                  onClick={() => addToCart(mascotProduct, 1)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                >
                  <span>Instant Checkout (COD Available)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>1-Year Official LazyForge Hardware Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Cash on Delivery inside Dhaka &amp; Nationwide Delivery</span>
                </div>
              </div>
            </div>

            {/* Core Specifications */}
            <div className="p-6 rounded-3xl bg-[#111624] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-accent" />
                Hardware Telemetry
              </h3>

              <div className="space-y-3 text-xs divide-y divide-white/5">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Compute Core:</span>
                  <span className="font-mono text-white">ESP32-S3 Dual 240MHz</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Actuators:</span>
                  <span className="font-mono text-white">12x Precision Micro Servos</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Display Visor:</span>
                  <span className="font-mono text-white">Cyan NeoPixel Reactive Matrix</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Power Plant:</span>
                  <span className="font-mono text-white">2x 18650 Li-ion BMS (8 Hrs)</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">Connectivity:</span>
                  <span className="font-mono text-white">Wi-Fi 802.11 b/g/n + BLE 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Model Robotics CAD Showcase */}
      <Product3DShowcaseSection
        title="Inspect the Full LazyForge Robotics Fleet"
        subtitle="Switch between our quadruped spider bots, industrial manipulator arms, and high-frequency edge IoT boards in interactive 3D."
      />

      {/* Feature Pillars Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#111624] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent">
              <RotateCw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Full CAD 360 Inspection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine every angle, joint articulation, and chassis tolerance directly in WebGL
              prior to ordering assembly kits.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111624] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Open-Source Python & C++ SDK</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrate custom OpenCV machine vision algorithms, obstacle avoidance paths, and
              voice synthesis triggers via our developer libraries.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111624] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">3D-Printable Replacement Armor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              STL and STEP engineering files are included with every purchase. Customize armor
              colorways with your own filament printers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RobotMascotPage;
