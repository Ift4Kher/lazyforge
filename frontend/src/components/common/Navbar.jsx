import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart,
  Heart,
  Layers, 
  Info, 
  PhoneCall, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: ShoppingBag },
    { name: 'Categories', path: '/categories', icon: Layers, hasDropdown: true },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  const isShopPage = location.pathname === '/products' || location.pathname === '/shop';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_15px_rgba(0,102,255,0.04)] transition-all">
      {/* Luxury Telemetry Announcement Bar (Hidden on Shop Page for exact design match) */}
      {!isShopPage && (
        <div className="bg-gradient-to-r from-[#070B14] via-[#0A1931] to-[#070B14] text-white border-b border-blue-900/40 py-1.5 px-4 text-xs font-mono">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D2FF]"></span>
              </span>
              <span className="text-slate-300 hidden sm:inline">TELEMETRY ONLINE:</span>
              <span className="text-cyan-300 font-bold">NATIONWIDE EXPRESS DISPATCH &bull; 64 DISTRICTS COD</span>
            </div>

            <div className="flex items-center space-x-4 text-[11px]">
              <span className="text-slate-400 hidden md:inline">MIRPUR DOHS, DHAKA</span>
              <a href="tel:+8801800529936" className="text-[#38BDF8] hover:text-white transition-colors font-bold">
                HOTLINE: 1800-LAZYFORGE
              </a>
            </div>
          </div>
        </div>
      )}

      {/* High-tech top cyber hairline with geometric notches */}
      {!isShopPage && (
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#0066FF] to-transparent opacity-80" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo - Gear Robot Icon + LazyForge Technologies matching Reference Image */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0 py-1" aria-label="LazyForge Technologies">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <svg className="w-10 h-10 text-[#1E293B] group-hover:scale-105 transition-transform" viewBox="0 0 40 40" fill="none">
                  {/* 8-Tooth Gear Silhouette */}
                  <path d="M17 3h6v4.2a13 13 0 014.2 1.8l3-3 4.2 4.2-3 3a13 13 0 011.8 4.2H37v6h-4.2a13 13 0 01-1.8 4.2l3 3-4.2 4.2-3-3a13 13 0 01-4.2 1.8V37h-6v-4.2a13 13 0 01-4.2-1.8l-3 3-4.2-4.2 3-3a13 13 0 01-1.8-4.2H3v-6h4.2a13 13 0 011.8-4.2l-3-3 4.2-4.2 3 3a13 13 0 014.2-1.8V3z" fill="#1E293B" />
                  {/* Inner White Robot Face Capsule */}
                  <rect x="11" y="11" width="18" height="18" rx="5" fill="#FFFFFF" />
                  {/* Antenna */}
                  <circle cx="20" cy="8.5" r="1.5" fill="#0066FF" />
                  <line x1="20" y1="9.5" x2="20" y2="11.5" stroke="#1E293B" strokeWidth="1.5" />
                  {/* Blue Eyes */}
                  <circle cx="15.5" cy="18" r="2.2" fill="#0066FF" />
                  <circle cx="24.5" cy="18" r="2.2" fill="#0066FF" />
                  {/* Friendly Smile */}
                  <path d="M17 22.5c1 1.2 5 1.2 6 0" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[19px] font-black tracking-tight text-slate-900 group-hover:text-[#0066FF] transition-colors font-sans">
                  LazyForge
                </span>
                <span className="text-[11px] font-bold text-slate-500 tracking-wider">
                  Technologies
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links with Tech Icons & Active Indicator */}
          <nav className="hidden lg:flex items-center space-x-1.5 text-sm font-semibold">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.name === 'Shop' && (location.pathname === '/products' || location.pathname === '/shop'));

              if (item.name === 'Shop') {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                      isActive
                        ? 'bg-[#0066FF] text-white hover:bg-blue-600 shadow-[0_2px_10px_rgba(0,102,255,0.3)]'
                        : 'text-slate-700 hover:text-[#0066FF] hover:bg-blue-50/50'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              }

              if (item.hasDropdown) {
                return (
                  <div 
                    key={item.name} 
                    className="relative group"
                    onMouseEnter={() => setCategoriesOpen(true)}
                    onMouseLeave={() => setCategoriesOpen(false)}
                  >
                    <button
                      type="button"
                      className={`px-3 py-2 rounded-xl flex items-center space-x-1 transition-all text-xs font-bold cursor-pointer ${
                        isActive || categoriesOpen
                          ? 'text-[#0066FF]'
                          : 'text-slate-700 hover:text-[#0066FF]'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066FF]" />
                    </button>

                    {/* Dropdown Menu */}
                    {categoriesOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link to="/products?category=robotic-cars" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]">
                          Robotic Cars
                        </Link>
                        <Link to="/products?category=ai-robots" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]">
                          AI Robots & Bots
                        </Link>
                        <Link to="/products?category=robotics-kits" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]">
                          Robotics & Kits
                        </Link>
                        <Link to="/products?category=smart-controllers" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]">
                          Smart Controllers
                        </Link>
                        <Link to="/products?category=sensors-components" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]">
                          Sensors & Components
                        </Link>
                        <Link to="/products?category=3d-printed-models" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]">
                          3D-Printed Models
                        </Link>
                        <Link to="/products?category=anime-collectibles" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]">
                          Anime Figures & Collectibles
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all text-xs font-bold relative ${
                    isActive
                      ? 'text-[#0066FF] font-extrabold'
                      : 'text-slate-700 hover:text-[#0066FF]'
                  }`}
                >
                  {item.name === 'Home' && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066FF]' : 'text-slate-600'}`} />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar - Clean Rounded Pill Shape matching Reference Image */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden sm:flex items-center flex-1 max-w-xs relative group"
          >
            <div className="relative w-full h-10 flex items-center bg-slate-100/80 hover:bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0066FF]/30 border border-slate-200/90 rounded-full transition-all px-3">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#0066FF] shrink-0 mr-2 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Admin Badge */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden xl:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Profile Button */}
            {user ? (
              <div className="relative group shrink-0">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] transition-all cursor-pointer shadow-2xs"
                  aria-label="User profile"
                >
                  <User className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 hidden group-hover:block text-slate-800 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-100 text-xs text-slate-500">
                    Signed in as <br /><span className="text-slate-900 font-bold">{user.email}</span>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="block px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0066FF]">
                      Admin Portal
                    </Link>
                  )}
                  <Link to="/orders" className="block px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0066FF]">
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1 font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] transition-all shrink-0 shadow-2xs"
                aria-label="Sign In"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Wishlist Heart Button with Red Badge 2 */}
            <Link
              to="/products"
              className="relative w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-red-500 hover:border-red-200 transition-all shrink-0 shadow-2xs"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                2
              </span>
            </Link>

            {/* Shopping Cart Button with Red Notification Badge 1 */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] transition-all shrink-0 shadow-2xs"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {itemCount > 0 ? itemCount : 1}
              </span>
            </Link>

            {/* Blue Circular Hamburger Menu Button (Exact match from reference image) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,102,255,0.35)] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-5 pt-3 pb-6 space-y-2.5 text-slate-800 shadow-xl animate-in fade-in duration-200">
          {/* Mobile Search - Robotic Edgy Shape */}
          <form onSubmit={handleSearchSubmit} className="relative pb-2 group">
            <div className="w-full p-[1.5px] clip-cyber-search bg-slate-200 group-hover:bg-[#0066FF]/60 focus-within:!bg-[#0066FF] transition-all duration-200">
              <div className="relative w-full h-10 flex items-center bg-slate-100 focus-within:bg-white clip-cyber-search-inner transition-colors">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#0066FF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  style={{ paddingLeft: '38px', paddingRight: '32px' }}
                  className="w-full h-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="Clear mobile search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-[#0066FF] font-bold px-1.5 py-0.5 rounded bg-slate-200/50 hover:bg-blue-50 border border-slate-300/40 transition-colors"
                    aria-label="Submit mobile search"
                  >
                    ↵
                  </button>
                )}
              </div>
            </div>
          </form>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive ? 'bg-blue-50 text-[#0066FF]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
              <span>Admin Console</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
