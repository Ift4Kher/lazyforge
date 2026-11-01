import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B0F19] border-t border-slate-800 mt-20 text-slate-300 relative overflow-hidden">
      {/* Top Cyber Tech Hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#0066FF] to-transparent opacity-80" />

      {/* Value Proposition Highlights Bar */}
      <div className="border-b border-slate-800/80 py-8 bg-[#0F172A]/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#0066FF] shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-['Orbitron',sans-serif] tracking-tight">Nationwide Delivery</h4>
              <p className="text-xs text-slate-400">All 64 districts in Bangladesh</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#0066FF] shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-['Orbitron',sans-serif] tracking-tight">Genuine Tech Only</h4>
              <p className="text-xs text-slate-400">Tested robotics & components</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#0066FF] shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-['Orbitron',sans-serif] tracking-tight">7 Days Replacement</h4>
              <p className="text-xs text-slate-400">Simple return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#0066FF] shadow-xs">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-['Orbitron',sans-serif] tracking-tight">Engineer Support</h4>
              <p className="text-xs text-slate-400">Direct technical guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="/images/lazyforge-icon-mark.png"
                  alt="LazyForge Technologies"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white font-['Orbitron',sans-serif]">
                  LazyForge
                </span>
                <p className="text-[10px] text-[#0066FF] font-mono tracking-widest font-bold uppercase">
                  Technologies
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              LazyForge Technologies is Bangladesh’s premier engineering store for intelligent robotics kits, smart microcontrollers, 3D additive designs, and cyber collectibles.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-white">Customer Support:</p>
              <p className="font-mono text-slate-300">+880 1800-LAZYFORGE</p>
              <p className="font-mono text-[#0066FF]">support@lazyforge.com</p>
              <p>Mirpur DOHS, Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Orbitron',sans-serif]">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/products?category=robotic-cars" className="hover:text-[#0066FF] transition-colors">Robotic Cars & Rovers</Link></li>
              <li><Link to="/products?category=ai-robots" className="hover:text-[#0066FF] transition-colors">AI Robots & Bots</Link></li>
              <li><Link to="/products?category=robotics-kits" className="hover:text-[#0066FF] transition-colors">Robotics & Kits</Link></li>
              <li><Link to="/products?category=smart-controllers" className="hover:text-[#0066FF] transition-colors">Smart Controllers (ESP32)</Link></li>
              <li><Link to="/products?category=sensors-components" className="hover:text-[#0066FF] transition-colors">Sensors & Components</Link></li>
              <li><Link to="/products?category=3d-printed-models" className="hover:text-[#0066FF] transition-colors">3D-Printed Models</Link></li>
              <li><Link to="/products?category=anime-collectibles" className="hover:text-[#0066FF] transition-colors">Anime Figures & Collectibles</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Orbitron',sans-serif]">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/orders/track" className="hover:text-[#0066FF] transition-colors">Track My Order</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-[#0066FF] transition-colors">Shipping & Delivery Rates</Link></li>
              <li><Link to="/return-refund" className="hover:text-[#0066FF] transition-colors">Return & Refund Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#0066FF] transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-[#0066FF] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Orbitron',sans-serif]">
              Verified Payments
            </h4>
            <p className="text-xs text-slate-400 mb-3.5 leading-relaxed font-medium">
              We accept Cash on Delivery and digital payments through SSLCommerz (bKash, Nagad, Rocket, Visa/Mastercard).
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 shadow-2xs">
                ● Cash on Delivery (COD)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0066FF]/15 border border-[#0066FF]/40 text-[11px] font-bold text-[#38BDF8] shadow-2xs">
                SSLCommerz Secured
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono font-semibold text-slate-300">
                Currency: BDT (৳)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LazyForge Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-['Orbitron',sans-serif] text-[10px] text-[#0066FF] tracking-wider uppercase">
            The Future of Robotics is Here
          </p>
        </div>
      </div>
    </footer>
  );
}
