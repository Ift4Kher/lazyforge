import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  Database,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-silver-card">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-accentLight font-semibold">
            Administrative Operations Center
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Role: <span className="text-slate-200 font-mono font-semibold">{user?.role}</span> | Centralized commerce and campaign management online.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-surfaceLight border border-brand-border text-slate-200 hover:border-brand-accent transition-all"
          >
            Manage Catalog
          </Link>
          <Link
            to="/admin/builder"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
          >
            New Campaign Page
          </Link>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-silver-card">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-brand-dark border border-brand-border flex items-center justify-center text-brand-accentLight">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">0</div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">Live Database</span>
            <span>Awaiting incoming customer orders</span>
          </p>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-silver-card">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Pending Confirmation</span>
            <div className="w-8 h-8 rounded-lg bg-brand-dark border border-brand-border flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">0</div>
          <p className="text-[11px] text-slate-400 mt-1">
            COD & Pre-verified transactions queue
          </p>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-silver-card">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Active Categories</span>
            <div className="w-8 h-8 rounded-lg bg-brand-dark border border-brand-border flex items-center justify-center text-brand-accentLight">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">5</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Robotics, Controllers, 3D, Anime, Accessories
          </p>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-silver-card">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">System Health</span>
            <div className="w-8 h-8 rounded-lg bg-brand-dark border border-brand-border flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2">
            <span>ONLINE</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            MariaDB 10.4 UTF8MB4 Connected
          </p>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-brand-surface border border-brand-border hover:border-brand-accent/50 rounded-2xl p-6 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center text-brand-accentLight mb-4 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-brand-accentLight transition-colors">
              Product & Stock Control
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Create and edit gadget catalog entries, manage variants, upload 3D models, and monitor low inventory thresholds.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-brand-accentLight">
            <span>Open Catalog Manager</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/builder"
          className="bg-brand-surface border border-brand-border hover:border-brand-accent/50 rounded-2xl p-6 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center text-brand-accentLight mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-brand-accentLight transition-colors">
              Visual Landing Page Builder
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Construct high-conversion product campaign pages with drag-and-drop sections, Three.js 3D viewers, and direct checkout.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-brand-accentLight">
            <span>Open Visual Builder</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-brand-surface border border-brand-border hover:border-brand-accent/50 rounded-2xl p-6 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center text-brand-accentLight mb-4 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-brand-accentLight transition-colors">
              Store & Hero Media Settings
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Configure hero video and image modes, audio behavior defaults, Bangladesh shipping rates, and SSLCommerz credentials.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-brand-accentLight">
            <span>Configure Settings</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
