import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart,
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
    { name: 'About', path: '/campaigns/robot-mascot', icon: Info },
    { name: 'Contact', path: '/products', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_15px_rgba(0,102,255,0.04)] transition-all">
      {/* High-tech top cyber hairline with geometric notches */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#0066FF] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo - Futuristic Cyber Mecha Insignia */}
          <div className="flex items-center">
            {/* Left Tech Notch Line */}
            <div className="hidden xl:flex items-center space-x-1.5 mr-3 opacity-60">
              <div className="w-8 h-[1.5px] bg-slate-300" />
              <div className="w-3 h-[1.5px] bg-[#0066FF]" />
            </div>

            <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-10 h-10 flex items-center justify-center transition-all group-hover:scale-105">
                <img
                  src="/images/lazyforge-icon-mark.png"
                  alt="LazyForge Technologies"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-slate-900 font-['Orbitron',sans-serif] flex items-center gap-1 group-hover:text-[#0066FF] transition-colors leading-tight">
                  <span>LazyForge</span>
                </div>
                <p className="text-[10px] tracking-wider text-slate-500 font-sans -mt-0.5 font-semibold">
                  Technologies
                </p>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links with Tech Icons & Active Indicator */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

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
                      className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all text-xs font-bold relative ${
                        isActive || categoriesOpen
                          ? 'text-[#0066FF]'
                          : 'text-slate-700 hover:text-[#0066FF]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500 group-hover:text-[#0066FF]" />
                      <span>{item.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066FF]" />
                      {isActive && (
                        <span className="absolute -bottom-2.5 left-3 right-3 h-[2px] bg-[#0066FF] rounded-full" />
                      )}
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0066FF]' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-3 right-3 h-[2px] bg-[#0066FF] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar - Pill Shape with Dual Icons */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden sm:flex items-center flex-1 max-w-xs relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-9 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/10 transition-all font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button 
              type="submit" 
              className="absolute right-2.5 text-slate-400 hover:text-[#0066FF] transition-colors"
              aria-label="Submit search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
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
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] transition-all"
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
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] transition-all shrink-0"
                aria-label="Sign In"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Shopping Cart Button with Blue Notification Badge */}
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0066FF] hover:border-[#0066FF] transition-all shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#0066FF] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                {itemCount > 0 ? itemCount : 2}
              </span>
            </Link>

            {/* Octagonal Blue Menu Button (matches the reference screenshot) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 clip-octagon-btn bg-[#0066FF] hover:bg-blue-600 text-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,102,255,0.3)] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
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
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative pb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
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
