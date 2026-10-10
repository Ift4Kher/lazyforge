import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, ShieldCheck, Menu, X, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/90 backdrop-blur-md border-b border-brand-border">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-accent/20 via-brand-dark to-brand-accent/20 py-1 px-4 text-center text-xs text-brand-silver border-b border-brand-border/40">
        <span className="font-semibold text-brand-accentLight">⚡ Official Launch:</span> Express Delivery Across Bangladesh | Verified COD Available
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-accent/40 flex items-center justify-center shadow-glow-sm group-hover:border-brand-accent transition-all">
              <svg className="w-6 h-6 text-brand-accentLight" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="6" strokeDasharray="10 5"/>
                <polygon points="50,22 75,37 75,67 50,82 25,67 25,37" fill="#151C2A" stroke="#C084FC" strokeWidth="4"/>
                <circle cx="50" cy="50" r="14" fill="#8B5CF6"/>
                <circle cx="50" cy="50" r="6" fill="#FFFFFF"/>
              </svg>
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-wider text-slate-100 flex items-center gap-1.5">
                <span>LAZY</span>
                <span className="text-brand-accentLight">FORGE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping"></span>
              </div>
              <p className="text-[10px] tracking-widest text-slate-400 font-mono -mt-1">TECHNOLOGIES</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/" className="text-slate-200 hover:text-brand-accentLight transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-slate-300 hover:text-brand-accentLight transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-slate-300 hover:text-brand-accentLight transition-colors">
              Categories
            </Link>
            <Link to="/campaigns/robot-mascot" className="text-slate-300 hover:text-brand-accentLight flex items-center gap-1.5 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>3D Showcase</span>
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Admin Badge */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-accent/20 text-brand-accentLight border border-brand-accent/40 hover:bg-brand-accent/30 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-slate-100 rounded-lg hover:bg-brand-surfaceLight transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-sm text-slate-300 hover:text-slate-100 p-1.5 rounded-lg hover:bg-brand-surfaceLight"
                >
                  <User className="w-4 h-4 text-brand-accentLight" />
                  <span className="hidden sm:inline-block font-medium truncate max-w-[100px]">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-1 w-44 bg-brand-surface border border-brand-border rounded-xl shadow-silver-card py-2 hidden group-hover:block">
                  <div className="px-3 py-1.5 border-b border-brand-border text-xs text-slate-400">
                    Signed in as <br /><span className="text-slate-200 font-semibold">{user.email}</span>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="block px-3 py-1.5 text-xs text-slate-300 hover:bg-brand-surfaceLight">
                      Admin Portal
                    </Link>
                  )}
                  <Link to="/orders" className="block px-3 py-1.5 text-xs text-slate-300 hover:bg-brand-surfaceLight">
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-brand-surfaceLight border-t border-brand-border mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-brand-surfaceLight"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-surface border-b border-brand-border px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-brand-surfaceLight"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-brand-surfaceLight"
          >
            Products
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-brand-surfaceLight"
          >
            Categories
          </Link>
          <Link
            to="/campaigns/robot-mascot"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-brand-surfaceLight"
          >
            3D Showcase
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-accentLight bg-brand-accent/10"
            >
              Admin Console
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
