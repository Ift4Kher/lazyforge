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
    <section className="relative overflow-hidden bg-black min-h-screen w-full flex items-center border-b border-brand-border">
      {/* Full-Screen Edge-to-Edge Crystal-Clear Autoplaying Video */}
      <video
        ref={videoRef}
        src={heroData.videoUrl}
        poster={heroData.posterUrl}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{
          filter: 'none',
          WebkitFilter: 'none',
        }}
      />

      {/* Floating Content Over Fullscreen Video with Brand Violet & Clean White Styling */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="max-w-xl space-y-5">
          {/* Brand Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-accent/30 shadow-md">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-xs font-mono tracking-wider text-brand-accent uppercase font-bold">
              Bangladesh's Leading Robotics Lab
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {heroData.heading.split(' ')[0]}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200">
              {heroData.heading.split(' ').slice(1, 3).join(' ')}
            </span>{' '}
            {heroData.heading.split(' ').slice(3).join(' ')}
          </h1>

          {/* Supporting Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-medium">
            {heroData.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to={heroData.primaryCtaLink}
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm hover:scale-105 transition-all group"
            >
              <span>{heroData.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={heroData.secondaryCtaLink}
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white/95 backdrop-blur-md border border-white text-brand-graphite hover:text-brand-accent hover:border-brand-accent hover:scale-105 transition-all shadow-md"
            >
              <Zap className="w-4 h-4 text-brand-accent" />
              <span>{heroData.secondaryCtaText}</span>
            </Link>
          </div>

          {/* Trust and Delivery Assurance */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/60 text-brand-graphite shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>In Stock & Ready to Dispatch</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/60 text-brand-graphite shadow-sm">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <span>Cash on Delivery (All 64 Districts)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
