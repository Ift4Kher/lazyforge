import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/storefront/ProductCard';
import { CartProvider } from '../context/CartContext';

const mockProduct = {
  id: 1,
  name: 'ESP32 Autonomous Quadruped Spider Robot Kit',
  slug: 'esp32-autonomous-quadruped-spider-robot-kit',
  sku: 'LF-ROB-001',
  category_name: 'Robotics & Kits',
  category_slug: 'robotics-kits',
  regular_price: '4800.00',
  sale_price: '4250.00',
  is_featured: true,
  short_description: '12-DOF programmable spider robot powered by ESP32.',
  primary_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
  total_stock: 37,
};

describe('Catalog Storefront Components', () => {
  it('ProductCard renders title, category, BDT pricing, and stock status', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ProductCard product={mockProduct} />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('ESP32 Autonomous Quadruped Spider Robot Kit')).toBeInTheDocument();
    expect(screen.getByText('Robotics & Kits')).toBeInTheDocument();
    expect(screen.getByText('৳4,250')).toBeInTheDocument();
    expect(screen.getByText('৳4,800')).toBeInTheDocument();
    expect(screen.getByText(/In Stock/i)).toBeInTheDocument();
    expect(screen.getByText(/-11% OFF|-12% OFF/i)).toBeInTheDocument();
  });
});
