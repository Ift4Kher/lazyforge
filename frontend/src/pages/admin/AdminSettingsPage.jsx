import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Video,
  Image,
  Volume2,
  VolumeX,
  Play,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Truck,
  RefreshCw,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export function AdminSettingsPage() {
  const { heroConfig, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    hero_type: 'video',
    video_url: '/uploads/hero-video.mp4',
    poster_url: '',
    fallback_image: '',
    badge_text: 'NEXT-GEN CONSUMER ROBOTICS & AI HARDWARE',
    heading: 'Intelligent Robotics Built for Real Impact',
    subheading:
      'From agile tabletop robotic companions to industrial edge inspection bots — engineer the future right from your workspace.',
    primary_cta_text: 'Explore Robot Models',
    primary_cta_link: '/products',
    secondary_cta_text: 'Watch System Telemetry',
    autoplay: true,
    default_muted: true,
    loop: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (heroConfig) {
      setFormData((prev) => ({
        ...prev,
        ...heroConfig,
      }));
    }
  }, [heroConfig]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/settings/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Hero media configuration updated and published across storefront!');
        if (refreshSettings) refreshSettings();
      } else {
        setErrorMessage(data.error || 'Failed to update settings');
      }
    } catch {
      setErrorMessage('Network error while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-accent font-bold">
            Storefront Experience & Media Controls
          </span>
          <h1 className="text-2xl font-extrabold text-brand-graphite mt-1">
            Hero & Store Settings
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Configure sound-enabled hero video playback, fallback imagery, headlines, and payment gateways.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hero Media Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <Video className="w-4 h-4 text-brand-accent" />
            <h3 className="text-sm font-bold text-brand-graphite">Hero Video & Visual Controls</h3>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-graphite">Hero Media Mode</label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hero_type: 'video' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                  formData.hero_type === 'video'
                    ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-xs'
                    : 'border-brand-border text-brand-graphite hover:bg-brand-softGray'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Background</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hero_type: 'image' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                  formData.hero_type === 'image'
                    ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-xs'
                    : 'border-brand-border text-brand-graphite hover:bg-brand-softGray'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Static Image Mode</span>
              </button>
            </div>
          </div>

          {/* Desktop Video URL */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-graphite">
              PC / Desktop Hero Video URL
            </label>
            <input
              type="text"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none text-xs font-mono"
            />
            <p className="text-[11px] text-brand-muted">
              Bundled PC video: <code className="text-brand-graphite">/uploads/hero-video2.mp4</code>
            </p>
          </div>

          {/* Mobile Video URL */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-graphite">
              Mobile Hero Video URL
            </label>
            <input
              type="text"
              value={formData.mobile_video_url || '/uploads/hero-video1.mp4'}
              onChange={(e) => setFormData({ ...formData, mobile_video_url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none text-xs font-mono"
            />
            <p className="text-[11px] text-brand-muted">
              Bundled mobile vertical video: <code className="text-brand-graphite">/uploads/hero-video1.mp4</code>
            </p>
          </div>

          {/* Playback Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <label className="flex items-center gap-2 p-3 rounded-xl border border-brand-border bg-brand-softGray/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoplay}
                onChange={(e) => setFormData({ ...formData, autoplay: e.target.checked })}
                className="rounded text-brand-accent focus:ring-0"
              />
              <span className="text-xs font-bold text-brand-graphite">Autoplay on Load</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-brand-border bg-brand-softGray/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.loop}
                onChange={(e) => setFormData({ ...formData, loop: e.target.checked })}
                className="rounded text-brand-accent focus:ring-0"
              />
              <span className="text-xs font-bold text-brand-graphite">Seamless Loop</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl border border-brand-border bg-brand-softGray/50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.default_muted}
                onChange={(e) => setFormData({ ...formData, default_muted: e.target.checked })}
                className="rounded text-brand-accent focus:ring-0"
              />
              <span className="text-xs font-bold text-brand-graphite">Default Audio Muted</span>
            </label>
          </div>
        </div>

        {/* Hero Copy & CTA */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <Cpu className="w-4 h-4 text-brand-accent" />
            <h3 className="text-sm font-bold text-brand-graphite">Headline & Action Copy</h3>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-graphite">Badge Pill Text</label>
            <input
              type="text"
              value={formData.badge_text}
              onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none text-xs font-mono uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-graphite">Main Headline</label>
            <input
              type="text"
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-graphite">Subheading Paragraph</label>
            <textarea
              rows="2"
              value={formData.subheading}
              onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-graphite">Primary CTA Label</label>
              <input
                type="text"
                value={formData.primary_cta_text}
                onChange={(e) => setFormData({ ...formData, primary_cta_text: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-graphite">Primary CTA Destination</label>
              <input
                type="text"
                value={formData.primary_cta_link}
                onChange={(e) => setFormData({ ...formData, primary_cta_link: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Operational Status Preview */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <ShieldCheck className="w-4 h-4 text-brand-accent" />
            <h3 className="text-sm font-bold text-brand-graphite">Connected Gateway Integrations</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-brand-softGray border border-brand-border space-y-1">
              <div className="font-bold text-brand-graphite flex items-center justify-between">
                <span>SSLCommerz Gateway</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600">
                  SANDBOX READY
                </span>
              </div>
              <p className="text-brand-muted text-[11px]">
                Configured with SSLCommerz Test Merchant credentials for cards, bKash, and Nagad.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-softGray border border-brand-border space-y-1">
              <div className="font-bold text-brand-graphite flex items-center justify-between">
                <span>Cash on Delivery (COD)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  ACTIVE
                </span>
              </div>
              <p className="text-brand-muted text-[11px]">
                Inside Dhaka: ৳80 (1-2 days) | Outside Dhaka: ৳130 (2-4 days). Concurrency-safe reservation.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
