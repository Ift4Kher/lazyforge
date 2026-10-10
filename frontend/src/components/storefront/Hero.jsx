import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export function Hero() {
  const { hero } = useSettings();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Browsers require initial muted for instant autoplay
  const [videoError, setVideoError] = useState(false);
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

  // Safe playback helper supporting both browser Promise and legacy/jsdom environments
  const safePlay = () => {
    if (!videoRef.current) return;
    try {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined && typeof playPromise.then === 'function') {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented:', err);
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn('Play call error:', err);
      setIsPlaying(false);
    }
  };

  // Attempt autoplay immediately on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      safePlay();
    }
  }, [heroData.videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      safePlay();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!isPlaying) {
      safePlay();
    }
  };

  return (
    <section className="relative overflow-hidden bg-brand-dark min-h-[580px] lg:min-h-[660px] flex items-center border-b border-brand-border py-12 lg:py-20">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-brand-neonCyan/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle & Primary Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Brand Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-accent/40 shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-brand-accentLight" />
              <span className="text-xs font-mono tracking-wider text-slate-200 uppercase font-semibold">
                Bangladesh's Leading Robotics Lab
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {heroData.heading.split(' ')[0]}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentLight via-purple-300 to-brand-neonCyan">
                {heroData.heading.split(' ').slice(1, 3).join(' ')}
              </span>{' '}
              {heroData.heading.split(' ').slice(3).join(' ')}
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              {heroData.subtitle}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={heroData.primaryCtaLink}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-md transition-all group"
              >
                <span>{heroData.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={heroData.secondaryCtaLink}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-brand-surface border border-brand-border hover:border-brand-accentLight text-slate-200 hover:text-white transition-all shadow-silver-card"
              >
                <span>{heroData.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Trust and Delivery Assurance */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-slate-300 font-medium">In Stock & Ready to Dispatch</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-accentLight" />
                <span className="text-slate-300 font-medium">Cash on Delivery Available</span>
              </div>
            </div>
          </div>

          {/* Right Column: Fully Crystal Clear Hero Video Showcase */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full rounded-3xl p-1 bg-gradient-to-br from-brand-accent/50 via-brand-surface to-brand-neonCyan/40 shadow-[0_0_50px_rgba(139,92,246,0.35)] transition-all">
              
              {/* Video Player Card */}
              <div className="relative rounded-[22px] overflow-hidden bg-black aspect-video flex items-center justify-center group">
                {!videoError ? (
                  <video
                    ref={videoRef}
                    src={heroData.videoUrl}
                    poster={heroData.posterUrl}
                    autoPlay
                    loop
                    playsInline
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover rounded-[22px] opacity-100 filter-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-brand-surface">
                    <Sparkles className="w-12 h-12 text-brand-accentLight mb-2" />
                    <p className="text-sm font-semibold text-white">LazyForge Robotic Mascot</p>
                    <p className="text-xs text-slate-400 mt-1">High-Precision Gadgets & Hardware</p>
                  </div>
                )}

                {/* Top Corner Live Mascot Indicator */}
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-brand-accent/40 text-[11px] font-mono text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-semibold tracking-wide">LAZYFORGE MASCOT</span>
                </div>

                {/* Bottom Video Floating Controls Bar */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-auto">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-brand-dark/85 backdrop-blur-md border border-brand-border text-slate-200 hover:text-white hover:border-brand-accent transition-all text-xs shadow-lg"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span className="font-medium text-[11px]">{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  {/* Sound Unmute / Mute Toggle Pill */}
                  <button
                    onClick={toggleMute}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border transition-all text-xs font-semibold shadow-lg ${
                      isMuted
                        ? 'bg-brand-accent text-white border-brand-accentLight hover:bg-brand-accentHover shadow-glow-sm'
                        : 'bg-brand-dark/85 text-emerald-300 border-emerald-400/50 hover:bg-brand-dark'
                    }`}
                    aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Sound Off — Click to Unmute</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span>Sound Playing</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
