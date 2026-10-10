import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { HomePage } from '../pages/storefront/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-surface border border-brand-accent/40 flex items-center justify-center text-brand-accentLight text-2xl font-mono mb-4 shadow-glow-sm">
        404
      </div>
      <h1 className="text-2xl font-extrabold text-white">Circuit Not Found</h1>
      <p className="text-xs text-slate-400 mt-2 max-w-sm">
        The requested robotics artifact or storefront destination does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
      >
        Return to Safety
      </Link>
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-3">
      <h1 className="text-3xl font-extrabold text-white">{title}</h1>
      <p className="text-sm text-slate-400 max-w-xl mx-auto">{description}</p>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Storefront Layout */}
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/products"
          element={
            <PlaceholderPage
              title="Robotics & Gadgets Catalog"
              description="Browse the complete collection of microcontrollers, 3D printed artifacts, and kits."
            />
          }
        />
        <Route
          path="/campaigns/robot-mascot"
          element={
            <PlaceholderPage
              title="3D Robot Mascot Interactive Showcase"
              description="Three.js real-time inspection of the LazyForge robotics mascot."
            />
          }
        />
        <Route
          path="/cart"
          element={
            <PlaceholderPage
              title="Shopping Cart"
              description="Review your selected gadgets before proceeding to centralized checkout."
            />
          }
        />
      </Route>

      {/* Admin Protected Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route
          path="products"
          element={
            <PlaceholderPage
              title="Product Catalog & Stock Management"
              description="Manage product descriptions, variants, SKU inventory, and 3D preview assets."
            />
          }
        />
        <Route
          path="orders"
          element={
            <PlaceholderPage
              title="Orders & Fulfillment Pipeline"
              description="Track customer orders, verify Cash on Delivery collections, and update delivery statuses."
            />
          }
        />
        <Route
          path="builder"
          element={
            <PlaceholderPage
              title="Visual Landing Page Builder"
              description="Construct drag-and-drop campaign landing pages with live preview."
            />
          }
        />
        <Route
          path="marketing"
          element={
            <PlaceholderPage
              title="Marketing, Coupons & Affiliates"
              description="Configure discount coupons, campaign schedules, and affiliate commission rates."
            />
          }
        />
        <Route
          path="settings"
          element={
            <PlaceholderPage
              title="Store & Hero Media Settings"
              description="Manage sound-enabled hero video configurations, shipping rates, and SSLCommerz credentials."
            />
          }
        />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
