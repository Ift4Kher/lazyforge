import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  hero: {
    mediaType: 'video',
    videoUrl: '/uploads/hero-video.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80',
    heading: 'ENGINEERING TOMORROW’S TECH TODAY',
    subtitle: 'Premium robotics, 3D-printed innovations, and next-gen electronic gadgets engineered for Bangladesh tech enthusiasts.',
    primaryCtaText: 'Explore Catalog',
    primaryCtaLink: '/products',
    secondaryCtaText: 'View 3D Models',
    secondaryCtaLink: '/campaigns/robot-mascot',
  },
  general: {
    storeName: 'LazyForge Technologies',
    contactEmail: 'support@lazyforge.com',
    currency: 'BDT',
  },
  shippingZones: [
    { id: 1, name: 'Inside Dhaka', fee: 80.0, estimated_days: '1-2 business days' },
    { id: 2, name: 'Outside Dhaka (All BD)', fee: 150.0, estimated_days: '2-4 business days' },
  ],
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/v1/settings/public');
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.success && json.data) {
            setSettings({
              hero: json.data.hero || DEFAULT_SETTINGS.hero,
              general: json.data.general || DEFAULT_SETTINGS.general,
              shippingZones: json.data.shippingZones || DEFAULT_SETTINGS.shippingZones,
            });
          }
        }
      } catch (err) {
        // Silently use defaults for static hosting preview
      }
    }
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
