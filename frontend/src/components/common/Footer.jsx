import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#8B5CF6] border-t border-[#7C3AED] mt-20 text-white">
      {/* Value Proposition Highlights */}
      <div className="border-b border-white/15 py-8 bg-[#7C3AED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nationwide Delivery</h4>
              <p className="text-xs text-purple-100">All 64 districts in Bangladesh</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Genuine Tech Only</h4>
              <p className="text-xs text-purple-100">Tested robotics & components</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Replacement</h4>
              <p className="text-xs text-purple-100">Simple return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-sm">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Engineer Support</h4>
              <p className="text-xs text-purple-100">Direct technical guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#8B5CF6] font-extrabold text-sm shadow-sm">
                LF
              </div>
              <span className="text-base font-extrabold tracking-wider text-white">
                LAZY<span className="text-white/95">FORGE</span>
              </span>
            </div>
            <p className="text-xs text-purple-100 leading-relaxed">
              LazyForge Technologies is Bangladesh’s premier engineering store for robotics kits, microcontrollers, custom 3D creations, and anime tech collectibles.
            </p>
            <div className="pt-2 text-xs text-purple-100 space-y-0.5">
              <p className="font-bold text-white">Customer Support:</p>
              <p>+880 1800-LAZYFORGE</p>
              <p>support@lazyforge.com</p>
              <p>Mirpur DOHS, Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-xs text-purple-100">
              <li><Link to="/products?category=robotics-kits" className="hover:text-white transition-colors">Robotics & Kits</Link></li>
              <li><Link to="/products?category=smart-controllers" className="hover:text-white transition-colors">Smart Controllers (ESP32/Arduino)</Link></li>
              <li><Link to="/products?category=3d-printed-models" className="hover:text-white transition-colors">3D-Printed Models</Link></li>
              <li><Link to="/products?category=anime-collectibles" className="hover:text-white transition-colors">Anime Figures & Art</Link></li>
              <li><Link to="/products?category=electronic-accessories" className="hover:text-white transition-colors">Electronic Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-purple-100">
              <li><Link to="/orders/track" className="hover:text-white transition-colors">Track My Order</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery Rates</Link></li>
              <li><Link to="/return-refund" className="hover:text-white transition-colors">Return & Refund Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Verified Payments</h4>
            <p className="text-xs text-purple-100 mb-3">
              We accept Cash on Delivery and digital payments through SSLCommerz (bKash, Nagad, Rocket, Cards).
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-white text-[11px] font-bold text-emerald-700 shadow-sm">
                Cash on Delivery (COD)
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[11px] font-bold text-[#8B5CF6] shadow-sm">
                SSLCommerz Secured
              </span>
              <span className="px-2.5 py-1 rounded bg-white/20 border border-white/30 text-[11px] font-mono font-semibold text-white">
                Currency: BDT (৳)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/15 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-200">
          <p>© {new Date().getFullYear()} LazyForge Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px] text-purple-200">
            Engineered with Precision · Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
