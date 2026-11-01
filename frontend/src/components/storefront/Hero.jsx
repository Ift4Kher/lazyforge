import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Box,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

// Clean, natural human typewriter (no matrix scramble or artificial sci-fi runes)
function CleanTypewriter({ words = [], defaultWord = 'Robotics' }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const wordList = words.length > 0 ? words : [defaultWord];

  useEffect(() => {
    setCurrentWordIndex(0);
    setDisplayText('');
    setIsDeleting(false);
  }, [words]);

  useEffect(() => {
    const targetWord = wordList[currentWordIndex % wordList.length] || defaultWord;
    let timer;

    if (!isDeleting) {
      if (displayText.length < targetWord.length) {
        // Natural human typing rhythm (70-110ms with slight variance)
        const delay = 75 + Math.floor(Math.random() * 35);
        timer = setTimeout(() => {
          setDisplayText(targetWord.slice(0, displayText.length + 1));
        }, delay);
      } else {
        // Pause at full word for 2.6 seconds
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2600);
      }
    } else {
      if (displayText.length > 0) {
        // Fast, smooth backspacing
        timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 35);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % wordList.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, wordList, defaultWord]);

  return (
    <span className="inline-flex items-center">
      <span className="bg-gradient-to-r from-[#0066FF] via-[#0088FF] to-[#00D2FF] bg-clip-text text-transparent font-black">
        {displayText || '\u00A0'}
      </span>
      <span className="inline-block w-[3.5px] h-[0.85em] ml-1 bg-[#0066FF] animate-[pulse_1s_ease-in-out_infinite] align-baseline rounded-xs shadow-[0_0_8px_rgba(0,102,255,0.6)]" />
    </span>
  );
}

export function Hero() {
  const { hero } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = 3;

  const slidesData = [
    {
      id: 1,
      categoryBadge: 'Premium Robotics & AI',
      headingLine1: 'The Future of',
      typewriterWords: ['Robotics', 'AI Companions', 'Bipedal Bots', 'Automation Kits'],
      headingLine3: 'is Here.',
      subtitle:
        'Discover intelligent companion robots, real-time AI vision kits, and precision mechatronics engineered for creators, labs, and tech enthusiasts.',
      primaryCta: 'Explore Collection',
      primaryLink: '/products',
      secondaryCta: 'Interactive 3D View',
      secondaryLink: '/products/smart-humanoid-robot',
      image: '/images/hero-mecha-showcase.png',
      imageAlt: 'LazyForge Humanoid Robot & Robotic Rover Platform',
      productName: 'Smart Humanoid Robot & All-Terrain Rover',
      productPrice: 'Starting from ৳17,999',
      availability: 'In Stock • Ready to Dispatch',
      highlightBadge: 'Featured Product',
    },
    {
      id: 2,
      categoryBadge: 'Developer & STEM Kits',
      headingLine1: 'Next-Generation',
      typewriterWords: ['Dev Kits', 'ROS 2 Platforms', 'Smart Hardware', 'Robotics Kits'],
      headingLine3: 'Built to Create.',
      subtitle:
        'Hands-on robotics platforms, high-torque servo actuators, and edge computing controllers designed for developers, students, and DIY engineers.',
      primaryCta: 'Browse Robotics Kits',
      primaryLink: '/products?category=robotics-kits',
      secondaryCta: 'View 3D CAD Rig',
      secondaryLink: '/campaigns/robot-mascot',
      image: '/images/hero-mecha-showcase.png',
      imageAlt: 'Robotics Developer Kits and Autonomous Platforms',
      productName: 'Autonomous Robotics Dev Kit v2',
      productPrice: 'Starting from ৳12,499',
      availability: 'Verified Hardware • Bench-Tested',
      highlightBadge: 'Lab Grade',
    },
    {
      id: 3,
      categoryBadge: 'Custom Additive & Electronics',
      headingLine1: 'Engineered for',
      typewriterWords: ['Precision', '3D Printing', 'Smart Motion', 'Inventors'],
      headingLine3: '& Performance.',
      subtitle:
        'High-precision 3D printable mechanical assemblies, brushless power controllers, and modular sensor arrays delivered across all 64 districts.',
      primaryCta: 'Explore Hardware',
      primaryLink: '/products?category=smart-controllers',
      secondaryCta: 'Order In Stock',
      secondaryLink: '/products',
      image: '/images/hero-mecha-showcase.png',
      imageAlt: 'Precision Electronics and Additive 3D Models',
      productName: 'Modular High-Torque Servo Array',
      productPrice: 'Starting from ৳3,899',
      availability: 'Official Warranty Included',
      highlightBadge: 'Best Seller',
    },
  ];

  const activeSlide = slidesData[currentSlide - 1];

  // Auto-slide every 7 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
  };

  return (
    <section
      className="relative bg-gradient-to-b from-[#F8FAFC] via-white to-blue-50/20 border-b border-slate-200/80 py-8 lg:py-16 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic ambient background with rich cyber gradient aura and tech grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0066ff0a_1px,transparent_1px),linear-gradient(to_bottom,#0066ff0a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-30px] right-[-20px] sm:right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-to-br from-blue-400/25 via-cyan-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-[-20px] sm:left-10 w-72 sm:w-80 h-72 sm:h-80 bg-gradient-to-tr from-indigo-500/18 via-blue-400/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-20px] right-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl" />
      </div>
      {/* Top glowing tech accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0066FF] to-transparent opacity-80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* ======================================================== */}
          {/* LEFT: Clean, High-End Studio Product Photography Showcase */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 relative order-2 lg:order-1">
            
            {/* Elegant Studio Card with Cyber Gradient Border */}
            <div className="relative p-[2px] rounded-3xl bg-gradient-to-br from-[#0066FF]/60 via-[#00D2FF]/40 to-[#6366F1]/50 shadow-[0_8px_30px_rgba(0,102,255,0.14)] overflow-hidden group">
              <div className="relative rounded-[22px] bg-gradient-to-b from-white via-blue-50/20 to-slate-50/90 p-5 sm:p-8 overflow-hidden">
                {/* Product Status Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/70">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0066FF] border border-blue-200">
                      {activeSlide.highlightBadge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {activeSlide.categoryBadge}
                    </span>
                  </div>
                  
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {activeSlide.availability}
                  </span>
                </div>

                {/* Crisp Product Photo with Radial Glow */}
                <div className="relative flex items-center justify-center min-h-[280px] sm:min-h-[360px] py-2">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-blue-400/20 via-cyan-400/15 to-transparent blur-2xl" />
                  </div>
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.imageAlt}
                    className="relative z-10 w-full h-auto max-h-[380px] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                    loading="eager"
                  />

                  {/* Clean Floating Product Information Tag */}
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md text-left max-w-xs transition-all z-20">
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {activeSlide.productName}
                    </p>
                    <p className="text-xs font-bold text-[#0066FF] mt-0.5 font-mono">
                      {activeSlide.productPrice}
                    </p>
                  </div>

                  {/* 3D Preview Link Pill */}
                  <Link
                    to="/products/smart-humanoid-robot"
                    className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#0066FF] text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 z-20"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-300" />
                    <span>View 3D Model</span>
                  </Link>
                </div>

                {/* Verified Trust Guarantees */}
                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tested Quality</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Nationwide COD</span>
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">
                    Official Warranty
                  </span>
                </div>
              </div>
            </div>

            {/* Slide Category Switchers */}
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
              {slidesData.map((slide) => {
                const isActive = slide.id === currentSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(slide.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0066FF] to-[#0088FF] text-white shadow-md shadow-blue-500/25'
                        : 'bg-white hover:bg-blue-50/60 text-slate-700 border border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {slide.categoryBadge.split(' ')[0]} {slide.categoryBadge.split(' ')[1] || ''}
                  </button>
                );
              })}
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT: Clear Human-Crafted Copywriting & High-Conversion CTAs */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-5">
            
            {/* Top Badge with Neon Glow */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-indigo-600/10 border border-blue-400/40 text-[#0066FF] text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF] animate-pulse" />
              <span>{activeSlide.categoryBadge}</span>
              <span className="text-blue-300">•</span>
              <span className="text-slate-700 font-semibold">New Release</span>
            </div>

            {/* Human-Centered 3-Line Headline: Line 2 is Typing Animation ONLY with Electric Gradient */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.14]">
                {/* Line 1: Static */}
                <span className="block text-slate-900">
                  {activeSlide.headingLine1}
                </span>

                {/* Line 2: Typing Animation ONLY */}
                <span className="block min-h-[1.18em]">
                  <CleanTypewriter
                    key={activeSlide.id}
                    words={activeSlide.typewriterWords}
                    defaultWord={activeSlide.typewriterWords[0]}
                  />
                </span>

                {/* Line 3: Static */}
                <span className="block text-slate-900">
                  {activeSlide.headingLine3}
                </span>
              </h1>
            </div>

            {/* Mobile-Only Interactive Robot Highlight Card (lg:hidden) */}
            <div className="lg:hidden relative rounded-2xl p-[1.5px] bg-gradient-to-r from-[#0066FF] via-[#00D2FF] to-[#6366F1] shadow-[0_4px_16px_rgba(0,102,255,0.2)] my-2 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-950 via-[#0A1128] to-[#0F172A] p-3 rounded-[15px] flex items-center justify-between gap-2.5">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/10 border border-blue-400/40 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={activeSlide.image}
                      alt=""
                      className="w-full h-full object-contain drop-shadow"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider truncate">
                        {activeSlide.highlightBadge}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate leading-tight mt-0.5">
                      {activeSlide.productName}
                    </p>
                    <p className="text-[11px] font-bold text-[#38BDF8] font-mono mt-0.5">
                      {activeSlide.productPrice}
                    </p>
                  </div>
                </div>
                <Link
                  to="/products/smart-humanoid-robot"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0088FF] hover:from-blue-600 hover:to-cyan-600 active:scale-95 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-sm transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-200" />
                  <span>3D View</span>
                </Link>
              </div>
            </div>

            {/* Clear, Human Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              {activeSlide.subtitle}
            </p>

            {/* Trust Points - Vibrant color-coded badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200 text-xs font-bold text-blue-800 shadow-2xs">
                <Truck className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Cash on Delivery (64 Districts)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Hardware</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-200 text-xs font-bold text-amber-800 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Fast Dispatch from Dhaka</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={activeSlide.primaryLink}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#0066FF] via-[#0052CC] to-[#0066FF] hover:from-[#0052CC] hover:to-[#0040A8] text-white shadow-[0_4px_14px_rgba(0,102,255,0.35)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.45)] active:scale-95 transition-all cursor-pointer group"
              >
                <span>{activeSlide.primaryCta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to={activeSlide.secondaryLink}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm bg-white hover:bg-blue-50/50 text-slate-800 border-2 border-blue-200/90 hover:border-[#0066FF] hover:text-[#0066FF] shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <Box className="w-4 h-4 text-[#0066FF]" />
                <span>{activeSlide.secondaryCta}</span>
              </Link>
            </div>

            {/* Slide Navigation Pagination */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100 select-none">
              <div className="flex items-center space-x-2">
                {slidesData.map((slide) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(slide.id)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      slide.id === currentSlide
                        ? 'w-7 bg-gradient-to-r from-[#0066FF] to-[#00D2FF] shadow-xs'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Slide ${slide.id}`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-7 h-7 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-7 h-7 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
                <span className="pl-1 text-slate-700 font-bold font-mono">
                  0{currentSlide} / 0{totalSlides}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
