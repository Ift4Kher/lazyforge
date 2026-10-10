import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from '../App';

describe('LazyForge Frontend Application', () => {
  it('renders LazyForge brand navigation and logo', async () => {
    await act(async () => {
      render(<App />);
    });
    const brandElements = screen.getAllByText(/LAZY/i);
    expect(brandElements.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/FORGE/i).length).toBeGreaterThan(0);
  });

  it('renders hero section with engineering heading and CTAs', async () => {
    await act(async () => {
      render(<App />);
    });
    const headings = screen.getAllByText(/ENGINEERING/i);
    expect(headings.length).toBeGreaterThan(0);
    expect(screen.getByText(/Explore Catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/View 3D Models/i)).toBeInTheDocument();
  });

  it('renders footer with Bangladesh delivery and support info', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/Nationwide Delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/All 64 districts in Bangladesh/i)).toBeInTheDocument();
    expect(screen.getByText(/\+880 1800-LAZYFORGE/i)).toBeInTheDocument();
  });
});
