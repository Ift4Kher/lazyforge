import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 navbar-liquid-glass text-white transition-all">
      {/* Liquid Glass Announcement Bar */}
      <div className="bg-[rgba(124,58,237,0.55)] backdrop-blur-md py-1 px-3 sm:py-1.5 sm:px-4 text-center text-[11px] sm:text-xs text-white/95 border-b border-white/10 shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)] truncate">
        <span className="font-semibold">⚡ Official Launch:</span> Express Delivery Across Bangladesh | Verified Cash on Delivery
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center transition-all group-hover:scale-105">
              <svg className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="6" strokeDasharray="10 5"/>
                <polygon points="50,22 75,37 75,67 50,82 25,67 25,37" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="4"/>
                <circle cx="50" cy="50" r="14" fill="#8B5CF6"/>
                <circle cx="50" cy="50" r="6" fill="#FFFFFF"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-wider text-white flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                <span>LAZY</span>
                <span className="text-white/95">FORGE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping shadow-[0_0_8px_#6ee7b7]"></span>
              </div>
              <p className="text-[10px] tracking-widest text-purple-100/90 font-mono -mt-1 font-semibold">TECHNOLOGIES</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2 text-sm font-semibold">
            <Link to="/" className="px-3.5 py-1.5 rounded-xl text-white hover:bg-white/15 transition-all">
              Home
            </Link>
            <Link to="/products" className="px-3.5 py-1.5 rounded-xl text-purple-100 hover:text-white hover:bg-white/15 transition-all">
              Products
            </Link>
            <Link to="/categories" className="px-3.5 py-1.5 rounded-xl text-purple-100 hover:text-white hover:bg-white/15 transition-all">
              Categories
            </Link>
            <Link to="/campaigns/robot-mascot" className="px-3.5 py-1.5 rounded-xl text-purple-100 hover:text-white hover:bg-white/15 flex items-center gap-1.5 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>3D Showcase</span>
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3.5">
            {/* Admin Badge */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold glass-pill text-white transition-all hover:scale-105"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Cart Icon with liquid glass pill styling */}
            <Link
              to="/cart"
              className="relative w-10 h-10 inline-flex items-center justify-center text-white glass-pill rounded-xl transition-all hover:scale-105 shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#8B5CF6] text-[10px] font-black flex items-center justify-center shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative group shrink-0">
                <button
                  type="button"
                  className="h-10 px-3.5 inline-flex items-center space-x-2 text-sm text-white glass-pill rounded-xl transition-all"
                >
                  <User className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline-block font-semibold truncate max-w-[100px]">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl py-2 hidden group-hover:block text-brand-graphite">
                  <div className="px-3.5 py-2 border-b border-brand-border text-xs text-brand-muted">
                    Signed in as <br /><span className="text-brand-graphite font-bold">{user.email}</span>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="block px-3.5 py-2 text-xs font-medium text-brand-graphite hover:bg-brand-softGray hover:text-[#8B5CF6]">
                      Admin Portal
                    </Link>
                  )}
                  <Link to="/orders" className="block px-3.5 py-2 text-xs font-medium text-brand-graphite hover:bg-brand-softGray hover:text-[#8B5CF6]">
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-brand-border mt-1 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="h-9 px-3.5 sm:h-10 sm:px-5 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold bg-white text-[#8B5CF6] hover:bg-white/95 shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:scale-105 transition-all shrink-0"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white glass-pill rounded-xl transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with liquid glassmorphism */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[rgba(139,92,246,0.92)] backdrop-blur-2xl border-t border-white/20 px-4 pt-3 pb-5 space-y-2 text-white shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-white glass-pill"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-purple-100 hover:text-white hover:bg-white/10"
          >
            Products
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-purple-100 hover:text-white hover:bg-white/10"
          >
            Categories
          </Link>
          <Link
            to="/campaigns/robot-mascot"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-purple-100 hover:text-white hover:bg-white/10"
          >
            3D Showcase
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-semibold text-white glass-pill"
            >
              Admin Console
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
