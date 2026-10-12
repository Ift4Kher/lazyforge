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
    posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80',
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
    <section className="relative overflow-hidden bg-black min-h-[calc(100dvh-5.75rem)] sm:min-h-screen w-full flex flex-col justify-end sm:justify-center border-b border-brand-border">
      {/* Full-Screen Edge-to-Edge Crystal-Clear Autoplaying Video */}
      <video
        ref={videoRef}
        src={heroData.videoUrl}
        poster={heroData.posterUrl}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-left sm:object-center z-0"
        style={{
          filter: 'none',
          WebkitFilter: 'none',
        }}
      />

      {/* Subtle bottom gradient on mobile to ensure crisp typography without dimming the robot's face */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:hidden z-[1] pointer-events-none" />

      {/* Floating Content Over Fullscreen Video with Brand Violet & Clean White Styling */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:py-16 w-full">
        <div className="max-w-xl space-y-3.5 sm:space-y-5">
          {/* Brand Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-accent/30 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span className="text-[10px] sm:text-xs font-mono tracking-wider text-brand-accent uppercase font-bold">
              Bangladesh's Leading Robotics Lab
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-[26px] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {heroData.heading.split(' ')[0]}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200">
              {heroData.heading.split(' ').slice(1, 3).join(' ')}
            </span>{' '}
            {heroData.heading.split(' ').slice(3).join(' ')}
          </h1>

          {/* Supporting Description */}
          <p className="text-xs sm:text-base lg:text-lg text-slate-100 leading-relaxed max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-medium">
            {heroData.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-2.5 sm:gap-4 pt-0.5 sm:pt-2">
            <Link
              to={heroData.primaryCtaLink}
              className="inline-flex items-center space-x-2 px-4.5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm hover:scale-105 transition-all group"
            >
              <span>{heroData.primaryCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={heroData.secondaryCtaLink}
              className="inline-flex items-center space-x-2 px-4.5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white/95 backdrop-blur-md border border-white text-brand-graphite hover:text-brand-accent hover:border-brand-accent hover:scale-105 transition-all shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-brand-accent" />
              <span>{heroData.secondaryCtaText}</span>
            </Link>
          </div>

          {/* Trust and Delivery Assurance */}
          <div className="pt-0.5 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-semibold">
            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/60 text-brand-graphite shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>In Stock & Ready to Dispatch</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/60 text-brand-graphite shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
              <span>Cash on Delivery (All 64 Districts)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
