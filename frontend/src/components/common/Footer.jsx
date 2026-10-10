import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-softGray border-t border-brand-border mt-20 text-brand-graphite">
      {/* Value Proposition Highlights */}
      <div className="border-b border-brand-border py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-brand-accentSubtle border border-brand-accent/20 flex items-center justify-center text-brand-accent">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-graphite">Nationwide Delivery</h4>
              <p className="text-xs text-brand-muted">All 64 districts in Bangladesh</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-brand-accentSubtle border border-brand-accent/20 flex items-center justify-center text-brand-accent">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-graphite">Genuine Tech Only</h4>
              <p className="text-xs text-brand-muted">Tested robotics & components</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-brand-accentSubtle border border-brand-accent/20 flex items-center justify-center text-brand-accent">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-graphite">7 Days Replacement</h4>
              <p className="text-xs text-brand-muted">Simple return policy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-brand-accentSubtle border border-brand-accent/20 flex items-center justify-center text-brand-accent">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-graphite">Engineer Support</h4>
              <p className="text-xs text-brand-muted">Direct technical guidance</p>
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
              <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white font-extrabold text-sm">
                LF
              </div>
              <span className="text-base font-extrabold tracking-wider text-brand-graphite">
                LAZY<span className="text-brand-accent">FORGE</span>
              </span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              LazyForge Technologies is Bangladesh’s premier engineering store for robotics kits, microcontrollers, custom 3D creations, and anime tech collectibles.
            </p>
            <div className="pt-2 text-xs text-brand-muted space-y-0.5">
              <p className="font-bold text-brand-graphite">Customer Support:</p>
              <p>+880 1800-LAZYFORGE</p>
              <p>support@lazyforge.com</p>
              <p>Mirpur DOHS, Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-graphite mb-4">Categories</h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li><Link to="/products?category=robotics-kits" className="hover:text-brand-accent">Robotics & Kits</Link></li>
              <li><Link to="/products?category=smart-controllers" className="hover:text-brand-accent">Smart Controllers (ESP32/Arduino)</Link></li>
              <li><Link to="/products?category=3d-printed-models" className="hover:text-brand-accent">3D-Printed Models</Link></li>
              <li><Link to="/products?category=anime-collectibles" className="hover:text-brand-accent">Anime Figures & Art</Link></li>
              <li><Link to="/products?category=electronic-accessories" className="hover:text-brand-accent">Electronic Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-graphite mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li><Link to="/orders/track" className="hover:text-brand-accent">Track My Order</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-brand-accent">Shipping & Delivery Rates</Link></li>
              <li><Link to="/return-refund" className="hover:text-brand-accent">Return & Refund Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-accent">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-accent">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-graphite mb-4">Verified Payments</h4>
            <p className="text-xs text-brand-muted mb-3">
              We accept Cash on Delivery and digital payments through SSLCommerz (bKash, Nagad, Rocket, Cards).
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-white border border-brand-border text-[11px] font-bold text-emerald-600">
                Cash on Delivery (COD)
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-brand-border text-[11px] font-bold text-brand-accent">
                SSLCommerz Secured
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-brand-border text-[11px] font-mono font-semibold text-brand-graphite">
                Currency: BDT (৳)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-brand-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted">
          <p>© {new Date().getFullYear()} LazyForge Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">
            Clean white · Soft gray · Graphite · Violet accent
          </p>
        </div>
      </div>
    </footer>
  );
}
