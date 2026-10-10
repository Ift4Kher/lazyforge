import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export function Hero() {
  const { hero } = useSettings();
  const videoRef = useRef(null);

  const heroData = hero || {
    mediaType: 'video',
    videoUrl: '/uploads/hero-video.mp4',
    posterUrl: '/uploads/hero-poster.jpg',
    heading: 'ENGINEERING TOMORROW’S TECH TODAY',
    subtitle: 'Premium robotics, 3D-printed innovations, and next-gen electronic gadgets engineered for Bangladesh tech enthusiasts.',
    primaryCtaText: 'Explore Catalog',
    primaryCtaLink: '/products',
    secondaryCtaText: 'View 3D Models',
    secondaryCtaLink: '/campaigns/robot-mascot',
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined && typeof playPromise.then === 'function') {
          playPromise.catch((err) => {
            console.warn('Autoplay prevented by browser:', err);
          });
        }
      } catch (err) {
        console.warn('Play error:', err);
      }
    }
  }, [heroData.videoUrl]);

  return (
    <section className="relative overflow-hidden bg-black min-h-[90vh] lg:min-h-screen flex items-center border-b border-brand-border">
      {/* 100% Raw, Pristine, Crystal-Clear Fullscreen Video (Zero Overlays, Zero Blur, Zero Darkening) */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={heroData.videoUrl}
          poster={heroData.posterUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-100"
          style={{
            filter: 'none',
            WebkitFilter: 'none',
            imageRendering: 'crisp-edges',
          }}
        />
      </div>

      {/* Floating Glassmorphic Content Card - Localized Blur Only Under The Text, Leaving Video 100% Crystal Clear */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-xl bg-brand-dark/75 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Brand Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-surface/90 border border-brand-accent/50 shadow-glow-sm">
            <Sparkles className="w-4 h-4 text-brand-accentLight" />
            <span className="text-xs font-mono tracking-wider text-slate-100 uppercase font-semibold">
              Bangladesh's Leading Robotics Lab
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {heroData.heading.split(' ')[0]}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-purple-300 to-brand-neonCyan">
              {heroData.heading.split(' ').slice(1, 3).join(' ')}
            </span>{' '}
            {heroData.heading.split(' ').slice(3).join(' ')}
          </h1>

          {/* Supporting Description */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {heroData.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to={heroData.primaryCtaLink}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-md hover:scale-105 transition-all group"
            >
              <span>{heroData.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={heroData.secondaryCtaLink}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-brand-surface border border-brand-border hover:border-brand-accentLight text-slate-100 hover:text-white hover:scale-105 transition-all shadow-silver-card"
            >
              <Zap className="w-4 h-4 text-brand-accentLight" />
              <span>{heroData.secondaryCtaText}</span>
            </Link>
          </div>

          {/* Trust and Delivery Assurance */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium border-t border-white/10">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>In Stock & Ready to Dispatch</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-accentLight" />
              <span>Cash on Delivery (All 64 Districts)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
