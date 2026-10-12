import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AuthProvider } from '../context/AuthContext';
import { SettingsProvider } from '../context/SettingsContext';

describe('Admin Operations & Control Views', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url.includes('/api/v1/admin/stats')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                orders: { total: 4, revenue: 38500, pending: 1, processing: 1, shipped: 1, delivered: 1, cancelled: 0 },
                products: { total: 8, active: 8, featured: 4 },
                customers: { total: 2 },
                lowStock: [],
                recentOrders: [
                  {
                    id: 1,
                    order_number: 'LF-20261011-8891',
                    customer_name: 'Tanvir Hossain',
                    customer_phone: '01711223344',
                    total_amount: 8580,
                    payment_method: 'COD',
                    payment_status: 'PENDING',
                    order_status: 'CONFIRMED',
                    created_at: new Date().toISOString(),
                  },
                ],
              },
            }),
        });
      }

      if (url.includes('/api/v1/categories')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              success: true,
              data: [{ id: 1, name: 'Robotics & Kits', slug: 'robotics-kits' }],
            }),
        });
      }

      if (url.includes('/api/v1/admin/products')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              success: true,
              data: [
                {
                  id: 1,
                  name: 'ESP32 Quadruped Robot',
                  sku: 'LF-ROB-001',
                  regular_price: '4800.00',
                  sale_price: '4250.00',
                  total_stock: 25,
                  is_active: 1,
                  category_name: 'Robotics & Kits',
                },
              ],
            }),
        });
      }

      return Promise.resolve({
        json: () => Promise.resolve({ success: true, data: {} }),
      });
    }));
  });

  it('AdminDashboardPage renders telemetry cards, recent order stream, and system status', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <AdminDashboardPage />
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Administrative Operations Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/System Health/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('LF-20261011-8891')).toBeInTheDocument();
      expect(screen.getByText('Tanvir Hossain')).toBeInTheDocument();
    });
  });

  it('AdminProductsPage renders catalog inventory table and Add Robot button', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <AdminProductsPage />
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Robotics Catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Robot Model/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('ESP32 Quadruped Robot')).toBeInTheDocument();
      expect(screen.getByText('LF-ROB-001')).toBeInTheDocument();
      expect(screen.getByText(/25 in stock/i)).toBeInTheDocument();
    });
  });
});
