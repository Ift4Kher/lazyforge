import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export function Hero() {
  const { hero } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 3;

  const slidesData = [
    {
      id: 1,
      badge: 'ROBOTICS & AI',
      headingLine1: 'THE FUTURE OF',
      headingHighlight: 'ROBOTICS',
      headingLine2: 'IS HERE',
      subtitle: 'Discover intelligent robotic systems, AI-powered bots, and innovative technology for a smarter tomorrow.',
      primaryCta: 'Explore Collection',
      primaryLink: '/products',
      secondaryCta: 'Discover More',
      secondaryLink: '/campaigns/robot-mascot',
      image: '/images/hero-mecha-showcase.png',
    },
    {
      id: 2,
      badge: 'AUTONOMOUS SYSTEMS',
      headingLine1: 'NEXT-GEN',
      headingHighlight: 'INTELLIGENCE',
      headingLine2: 'UNLEASHED',
      subtitle: 'Engineered for research labs, DIY developers, and high-precision automation across Bangladesh.',
      primaryCta: 'View Robotics Kits',
      primaryLink: '/products?category=robotics-kits',
      secondaryCta: 'Explore 3D Viewer',
      secondaryLink: '/campaigns/robot-mascot',
      image: '/images/hero-mecha-showcase.png',
    },
    {
      id: 3,
      badge: 'SMART HARDWARE',
      headingLine1: 'PRECISION',
      headingHighlight: 'ENGINEERING',
      headingLine2: '& CONTROL',
      subtitle: 'Explore high-torque servo platforms, advanced microcontrollers, and plug-and-play AI modules.',
      primaryCta: 'Browse Hardware',
      primaryLink: '/products?category=smart-controllers',
      secondaryCta: 'Order In Stock',
      secondaryLink: '/products',
      image: '/images/hero-mecha-showcase.png',
    },
  ];

  const activeSlide = slidesData[currentSlide - 1];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-100 py-6 lg:py-12">
      {/* Sci-Fi Decorative Grid & Tech Accent Lines */}
      <div className="absolute inset-0 cyber-grid-light opacity-80 pointer-events-none" />

      {/* Ambient Sci-Fi Glow Orbs */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-cyan-400/12 rounded-full blur-3xl pointer-events-none" />

      {/* Top Left Angular Tech Markings */}
      <div className="absolute top-4 left-6 hidden sm:flex items-center space-x-1.5 opacity-60">
        <div className="w-12 h-[2px] bg-slate-300" />
        <div className="w-3 h-[2px] bg-[#0066FF]" />
      </div>

      {/* Top Right Cyber Diagonal Slashes */}
      <div className="absolute top-4 right-8 flex items-center space-x-1 text-[#0066FF] font-black tracking-widest text-sm opacity-90 select-none pointer-events-none">
        <span className="skew-x-[-20deg]">/</span>
        <span className="skew-x-[-20deg]">/</span>
        <span className="skew-x-[-20deg]">/</span>
        <div className="w-8 h-[2px] bg-[#0066FF] ml-1" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Robotic Mecha Figures Display */}
          <div className="lg:col-span-7 relative order-2 lg:order-1 flex flex-col justify-center">
            
            {/* Mecha Showcase Hero Graphic - Seamless Blend */}
            <div className="relative overflow-hidden group">
              <img
                src={activeSlide.image}
                alt="LazyForge Robotics Mecha"
                className="w-full h-auto object-contain object-left group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                loading="eager"
              />
            </div>
          </div>

          {/* Right Column: High-Tech Typography & CTAs */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            
            {/* Directive Telemetry Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF] text-[11px] font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              <span>// {activeSlide.badge} DIRECTIVE</span>
            </div>

            {/* Main Headline with Sci-Fi Robotic Orbitron Font */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 font-['Orbitron',sans-serif] leading-[1.15]">
                {activeSlide.headingLine1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#0088FF] to-[#00D2FF] drop-shadow-[0_2px_12px_rgba(0,102,255,0.25)]">
                  {activeSlide.headingHighlight}
                </span>{' '}
                {activeSlide.headingLine2}
              </h1>
            </div>

            {/* Subtitle with Vertical Accent Bar */}
            <div className="border-l-4 border-[#0066FF] pl-4 py-0.5">
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to={activeSlide.primaryLink}
                className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-[#0066FF] text-white hover:bg-blue-600 shadow-[0_4px_18px_rgba(0,102,255,0.35)] hover:scale-105 active:scale-95 transition-all group"
              >
                <span>{activeSlide.primaryCta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Chamfered Discover More Button (matching reference screenshot) */}
              <Link
                to={activeSlide.secondaryLink}
                className="p-[1.5px] bg-[#0066FF] clip-chamfer-tl-br-12 inline-flex items-center hover:scale-105 active:scale-95 transition-all shadow-xs group"
              >
                <div className="w-full h-full bg-white group-hover:bg-blue-50/60 clip-chamfer-tl-br-12 px-6 py-3 flex items-center space-x-2 text-slate-800 text-xs sm:text-sm font-bold transition-colors">
                  <Play className="w-3.5 h-3.5 text-[#0066FF] fill-[#0066FF]" />
                  <span>{activeSlide.secondaryCta}</span>
                </div>
              </Link>
            </div>

            {/* Slide Pagination & Carousel Navigation Controls (bottom right) */}
            <div className="pt-4 flex items-center justify-end space-x-3 select-none">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 rounded-full border border-blue-200 bg-white hover:border-[#0066FF] hover:bg-blue-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-blue-200 bg-white hover:border-[#0066FF] hover:bg-blue-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="font-['Orbitron',sans-serif] text-xs font-bold text-slate-800 pl-1 tracking-wider">
                0{currentSlide} / 0{totalSlides}
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
