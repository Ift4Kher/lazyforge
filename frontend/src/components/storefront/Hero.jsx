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
    <section className="relative overflow-hidden bg-brand-dark min-h-[500px] max-h-[700px] aspect-[16/9] w-full flex items-center border-b border-brand-border">
      {/* Background Layer: Ambient Edge Match */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black flex items-center justify-center">
        {/* Soft Ambient Blurred Extension to fill any extra screen space seamlessly */}
        <video
          src={heroData.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-30 scale-110 pointer-events-none"
        />

        {/* Primary Video - 100% Uncropped, Perfectly Fitted to Hero Dimensions */}
        <video
          ref={videoRef}
          src={heroData.videoUrl}
          poster={heroData.posterUrl}
          autoPlay
          muted
          loop
          playsInline
          className="relative z-10 w-full h-full object-contain"
          style={{
            filter: 'none',
            WebkitFilter: 'none',
          }}
        />
      </div>

      {/* Floating Content Over Fitted Video */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="max-w-xl space-y-4">
          {/* Brand Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-surface/80 backdrop-blur-md border border-brand-accent/50 shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-accentLight" />
            <span className="text-[11px] font-mono tracking-wider text-slate-100 uppercase font-semibold">
              Bangladesh's Leading Robotics Lab
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {heroData.heading.split(' ')[0]}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-purple-300 to-brand-neonCyan">
              {heroData.heading.split(' ').slice(1, 3).join(' ')}
            </span>{' '}
            {heroData.heading.split(' ').slice(3).join(' ')}
          </h1>

          {/* Supporting Description */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-100 leading-relaxed max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            {heroData.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to={heroData.primaryCtaLink}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-md hover:scale-105 transition-all group"
            >
              <span>{heroData.primaryCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={heroData.secondaryCtaLink}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-surface/90 backdrop-blur-md border border-brand-border hover:border-brand-accentLight text-slate-100 hover:text-white hover:scale-105 transition-all shadow-silver-card"
            >
              <Zap className="w-3.5 h-3.5 text-brand-accentLight" />
              <span>{heroData.secondaryCtaText}</span>
            </Link>
          </div>

          {/* Trust and Delivery Assurance */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-200 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>In Stock & Ready to Dispatch</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-accentLight" />
              <span>Cash on Delivery (All 64 Districts)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
