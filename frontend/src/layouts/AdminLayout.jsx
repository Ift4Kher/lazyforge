import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminLayout() {
  const { user, isAdmin, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-brand-surface border border-red-500/40 rounded-2xl p-6 text-center shadow-silver-card">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-100">Access Restricted</h2>
          <p className="text-sm text-slate-400 mt-2 mb-6">
            You must be logged in as an authorized LazyForge administrator to access the Operations Console.
          </p>
          <button
            onClick={() => navigate('/login?redirect=/admin')}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-brand-accent text-white hover:bg-brand-accentHover transition-all shadow-glow-sm"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products & Stock', path: '/admin/products', icon: Package },
    { label: 'Orders & Sales', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Campaign Builder', path: '/admin/builder', icon: Layers },
    { label: 'Coupons & Affiliates', path: '/admin/marketing', icon: Tag },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-surface border-r border-brand-border flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-brand-border flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-dark border border-brand-accent flex items-center justify-center shadow-glow-sm">
              <span className="font-extrabold text-sm text-brand-accentLight">LF</span>
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wide text-slate-100">LAZYFORGE</h2>
              <span className="text-[10px] tracking-wider text-brand-accentLight uppercase font-semibold">
                Control Hub
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-accent text-white shadow-glow-sm'
                      : 'text-slate-300 hover:bg-brand-surfaceLight hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-brand-border space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-brand-surfaceLight"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="pt-2 flex items-center justify-between px-3">
            <div>
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">{user.name}</p>
              <span className="text-[10px] uppercase tracking-wider text-brand-accentLight font-mono">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-brand-surfaceLight"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-brand-surface/60 backdrop-blur-md border-b border-brand-border px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-slate-300 font-medium">Production Database Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="md:hidden text-xs text-brand-accentLight hover:underline"
            >
              Storefront
            </Link>
            <span className="text-xs px-2.5 py-1 rounded-full bg-brand-surface border border-brand-border text-slate-300 font-mono">
              Role: {user.role}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
