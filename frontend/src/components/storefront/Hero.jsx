import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export function Hero() {
  const { hero } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default unmuted when visitor clicks play
  const [hasStarted, setHasStarted] = useState(false);
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
    soundNotice: 'Sound enabled on click — click Play to experience full audio',
  };

  // Explicit user interaction initiates sound-enabled playback
  const handlePlayWithSound = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    setIsMuted(false);
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      })
      .catch((err) => {
        console.warn('Playback with audio blocked by browser policy, attempting muted fallback:', err);
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        });
      });
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section className="relative overflow-hidden bg-brand-dark min-h-[580px] lg:min-h-[680px] flex items-center border-b border-brand-border">
      {/* Background Media Layer */}
      <div className="absolute inset-0 z-0">
        {heroData.mediaType === 'video' && !videoError ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={heroData.videoUrl}
              poster={heroData.posterUrl}
              loop
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover opacity-60 filter brightness-90"
            />
            {/* Ambient vignette and gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-brand-dark/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/70 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-surface via-brand-dark to-brand-surfaceLight opacity-80">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/50" />
          </div>
        )}
      </div>

      {/* Decorative Glow Spheres */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-brand-neonCyan/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text and CTAs */}
          <div className="lg:col-span-7 space-y-6">
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
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
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

            {/* Notice */}
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{heroData.soundNotice}</span>
            </p>
          </div>

          {/* Interactive Hero Media Controls Box */}
          {heroData.mediaType === 'video' && !videoError && (
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-sm rounded-2xl bg-brand-surface/80 border border-brand-border p-4 shadow-silver-card backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border text-xs text-slate-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></span>
                    MASCOT HERO VIDEO
                  </span>
                  <span className="text-brand-accentLight">{isPlaying ? 'PLAYING WITH AUDIO' : 'READY TO PLAY'}</span>
                </div>

                <div className="my-6 flex flex-col items-center justify-center text-center space-y-4">
                  {!hasStarted ? (
                    <button
                      onClick={handlePlayWithSound}
                      className="w-20 h-20 rounded-full bg-brand-accent text-white flex items-center justify-center shadow-glow-lg hover:scale-105 active:scale-95 transition-all group"
                      aria-label="Play Hero Video with Audio"
                    >
                      <Play className="w-8 h-8 fill-white ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-brand-surfaceLight border border-brand-border text-white flex items-center justify-center hover:border-brand-accent transition-all"
                        aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-white" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                          isMuted
                            ? 'bg-red-500/20 border-red-500 text-red-400'
                            : 'bg-brand-accent/20 border-brand-accent text-brand-accentLight'
                        }`}
                        aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-slate-300">
                    {!hasStarted
                      ? 'Click the button above to play the hero brand video with sound.'
                      : isMuted
                      ? 'Audio is currently muted. Click speaker icon to unmute.'
                      : 'Audio is active. Enjoy the LazyForge robot mascot intro.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>848x478 H.264</span>
                  <span>Sound-Enabled</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
