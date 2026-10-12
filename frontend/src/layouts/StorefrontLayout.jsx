import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export function StorefrontLayout() {
  const location = useLocation();

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const ref = params.get('ref') || params.get('affiliate');
      if (ref) {
        const cleanRef = ref.trim().toUpperCase();
        localStorage.setItem('lazyforge_ref', cleanRef);
      }
    } catch (e) {
      // LocalStorage access fallback
    }
  }, [location.search]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-brand-graphite">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
