import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { HomePage } from '../pages/storefront/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminPageBuilderPage } from '../pages/admin/AdminPageBuilderPage';
import { AdminReviewsPage } from '../pages/admin/AdminReviewsPage';
import { AdminAffiliatesPage } from '../pages/admin/AdminAffiliatesPage';
import { ProductListPage } from '../pages/storefront/ProductListPage';
import { ProductDetailPage } from '../pages/storefront/ProductDetailPage';
import { RobotMascotPage } from '../pages/storefront/RobotMascotPage';
import { CampaignLandingPage } from '../pages/storefront/CampaignLandingPage';
import { CartPage } from '../pages/storefront/CartPage';
import { CheckoutPage } from '../pages/storefront/CheckoutPage';
import { OrderConfirmationPage } from '../pages/storefront/OrderConfirmationPage';

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-white">
      <div className="w-16 h-16 rounded-2xl bg-brand-softGray border border-brand-accent/40 flex items-center justify-center text-brand-accent text-2xl font-mono mb-4 shadow-sm">
        404
      </div>
      <h1 className="text-2xl font-extrabold text-brand-graphite">Circuit Not Found</h1>
      <p className="text-xs text-brand-muted mt-2 max-w-sm">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-3 bg-white">
      <h1 className="text-3xl font-extrabold text-brand-graphite">{title}</h1>
      <p className="text-sm text-brand-muted max-w-xl mx-auto">{description}</p>
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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<CustomerDashboardPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/categories" element={<ProductListPage />} />
        <Route path="/campaigns/:slug" element={<CampaignLandingPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
      </Route>

      {/* Admin Protected Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="builder" element={<AdminPageBuilderPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="affiliates" element={<AdminAffiliatesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
