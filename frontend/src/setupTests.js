import '@testing-library/jest-dom';

// Mock HTMLMediaElement methods in jsdom
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};

// Mock global fetch for jsdom unit tests
global.fetch = async (url, options = {}) => {
  const urlStr = String(url);

  if (urlStr.includes('/api/v1/settings/public')) {
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: {
          hero: {
            mediaType: 'video',
            videoUrl: '/uploads/hero-video.mp4',
            posterUrl: '/assets/hero-poster.jpg',
            heading: 'ENGINEERING TOMORROW’S TECH TODAY',
            subtitle: 'Premium robotics, 3D-printed innovations, and next-gen electronic gadgets.',
            primaryCtaText: 'Explore Catalog',
            primaryCtaLink: '/products',
            secondaryCtaText: 'View 3D Models',
            secondaryCtaLink: '/campaigns/robot-mascot',
            soundNotice: 'Sound enabled on click — click Play to experience full audio',
          },
          general: {
            storeName: 'LazyForge Technologies',
            currency: 'BDT',
            currencySymbol: '৳',
          },
          shippingZones: [
            { id: 1, name: 'Inside Dhaka', fee: 80, estimated_days: '1-2 days' },
          ],
        },
      }),
    };
  }

  if (urlStr.includes('/api/v1/auth/me')) {
    return {
      ok: true,
      json: async () => ({
        success: true,
        user: null,
      }),
    };
  }

  return {
    ok: true,
    json: async () => ({ success: true, data: null }),
  };
};
