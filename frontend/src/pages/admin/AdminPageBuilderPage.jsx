import React, { useState, useEffect } from 'react';
import {
  Layers,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Smartphone,
  Monitor,
  Video,
  Box,
  ShoppingCart,
  HelpCircle,
  Star,
  Zap,
  ExternalLink,
  Code,
  Globe,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { RobotViewer3D } from '../../components/storefront/RobotViewer3D';

const INITIAL_SECTIONS = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Hero Video & Welcome',
    enabled: true,
    heading: 'ENGINEERING TOMORROW’S TECH TODAY',
    subheading: 'Premium robotics, 3D-printed innovations, and next-gen electronic gadgets engineered for Bangladesh.',
    ctaText: 'Explore Catalog',
    ctaLink: '/products',
  },
  {
    id: 'sec-3d',
    type: '3d_viewer',
    title: 'Interactive 3D Robot Rig',
    enabled: true,
    heading: 'Apex-01 Autonomous Companion',
    subheading: 'Real-time WebGL CAD inspection with servo articulation and reactive LED visor.',
    badge: 'INTERACTIVE THREE.JS RIG',
  },
  {
    id: 'sec-products',
    type: 'featured_products',
    title: 'Featured Robotics Units',
    enabled: true,
    heading: 'Core Laboratory Releases',
    subheading: 'Precision engineered tabletop agents, spider bots, and ESP32 smart controllers.',
    limit: 4,
  },
  {
    id: 'sec-specs',
    type: 'specifications',
    title: 'Hardware & Compute Telemetry',
    enabled: true,
    heading: 'Battle-Tested Microcontroller Architecture',
    subheading: 'Built with dual-core 240MHz ESP32-S3, high-torque micro servos, and real-time WiFi telemetry.',
  },
  {
    id: 'sec-faq',
    type: 'faq',
    title: 'Fulfillment & Warranty FAQ',
    enabled: true,
    heading: 'Frequently Asked Questions',
    subheading: 'Everything you need to know about Bangladesh delivery, Cash on Delivery, and technical support.',
  },
];

export function AdminPageBuilderPage() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [selectedSectionId, setSelectedSectionId] = useState('sec-hero');
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [builderTab, setBuilderTab] = useState('sections'); // 'sections' | 'css'
  const [pageTitle, setPageTitle] = useState('Apex-01 Robot Mascot Showcase');
  const [slug, setSlug] = useState('robot-mascot');
  const [status, setStatus] = useState('published');
  const [customCss, setCustomCss] = useState('/* Custom campaign CSS */\n.campaign-highlight { color: #00F0FF; }');
  const [versionNumber, setVersionNumber] = useState(1);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const activeSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const fetchCampaignList = async () => {
    try {
      const res = await fetch('/api/v1/admin/landing-pages', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setAvailableCampaigns(data.data);
        }
      }
    } catch (err) {
      console.warn('Could not load campaign list:', err);
    }
  };

  const loadCampaignData = async (targetSlug) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/v1/admin/landing-pages/${targetSlug}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const { page, activeVersion } = data.data;
          setPageTitle(page.title);
          setSlug(page.slug);
          setStatus(page.status || 'published');
          if (activeVersion) {
            setVersionNumber(activeVersion.version_number || 1);
            if (Array.isArray(activeVersion.layout) && activeVersion.layout.length > 0) {
              setSections(activeVersion.layout);
              setSelectedSectionId(activeVersion.layout[0]?.id || 'sec-hero');
            }
            if (activeVersion.custom_css) {
              setCustomCss(activeVersion.custom_css);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Could not load target campaign:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignList();
    loadCampaignData('robot-mascot');
  }, []);

  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[newIndex];
    newSections[newIndex] = temp;
    setSections(newSections);
  };

  const handleToggleEnable = (id) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleUpdateActive = (fields) => {
    setSections((prev) =>
      prev.map((s) => (s.id === activeSection.id ? { ...s, ...fields } : s))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      const payload = {
        title: pageTitle.trim() || 'Untitled Campaign',
        slug: slug.trim() || 'campaign',
        status,
        sections,
        custom_css: customCss,
      };

      const res = await fetch('/api/v1/admin/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setVersionNumber(data.data.versionNumber);
        setFeedback({
          type: 'success',
          text: `Campaign saved as Version ${data.data.versionNumber}! Live at /campaigns/${data.data.slug}`,
        });
        fetchCampaignList();
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to save landing page' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Network communication failure during save' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-accent font-bold">
              Dynamic Campaign Orchestration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/30">
              v{versionNumber} • {status.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-graphite mt-1">
            Visual Landing Page Builder
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Reorder landing page blocks, customize copy, apply custom CSS, and deploy live campaign pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-brand-softGray border border-brand-border rounded-xl p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                previewMode === 'desktop'
                  ? 'bg-white text-brand-accent shadow-xs'
                  : 'text-brand-muted hover:text-brand-graphite'
              }`}
              title="Desktop Preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                previewMode === 'mobile'
                  ? 'bg-white text-brand-accent shadow-xs'
                  : 'text-brand-muted hover:text-brand-graphite'
              }`}
              title="Mobile Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <a
            href={`/campaigns/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-softGray border border-brand-border text-brand-graphite hover:text-brand-accent transition-colors"
          >
            <span>Live View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Deploying...' : 'Publish Layout'}</span>
          </button>
        </div>
      </div>

      {/* Campaign Settings Control Bar */}
      <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-brand-graphite block mb-1">Campaign Title</label>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none"
              placeholder="e.g. Apex-01 Robot Mascot Showcase"
            />
          </div>
          <div>
            <label className="font-bold text-brand-graphite block mb-1">URL Route Slug</label>
            <div className="flex items-center gap-1">
              <span className="font-mono text-brand-muted">/campaigns/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border font-mono focus:border-brand-accent focus:outline-none"
                placeholder="robot-mascot"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-brand-graphite block mb-1">Publication Status</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                  status === 'published'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-brand-softGray text-brand-graphite border border-brand-border'
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                  status === 'draft'
                    ? 'bg-amber-500 text-white'
                    : 'bg-brand-softGray text-brand-graphite border border-brand-border'
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        {/* Tab switchers: Sections vs Custom CSS */}
        <div className="flex items-center gap-3 pt-2 border-t border-brand-border">
          <button
            onClick={() => setBuilderTab('sections')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              builderTab === 'sections'
                ? 'bg-brand-accent text-white shadow-glow-sm'
                : 'bg-brand-softGray text-brand-graphite hover:bg-brand-border'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layout Sections ({sections.length})</span>
          </button>
          <button
            onClick={() => setBuilderTab('css')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              builderTab === 'css'
                ? 'bg-brand-accent text-white shadow-glow-sm'
                : 'bg-brand-softGray text-brand-graphite hover:bg-brand-border'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Custom CSS (REQ-10 Safe Sanitizer)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-2 ${
            feedback.type === 'error'
              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Left Reorder List & Properties, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Sorter & Property Editor or Custom CSS */}
        <div className="lg:col-span-5 space-y-6">
          {builderTab === 'css' ? (
            <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-brand-border pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-brand-accent uppercase font-bold tracking-wider">
                    Scoped Style Injection
                  </span>
                  <h3 className="text-sm font-bold text-brand-graphite mt-0.5">
                    Custom CSS Editor
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                  Safe Sanitizer Active
                </span>
              </div>
              <p className="text-xs text-brand-muted">
                Write campaign-specific styles. Our server sanitizer automatically strips malicious @import directives, expression(), and scripts to prevent XSS (REQ-10).
              </p>
              <textarea
                rows={16}
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-[#0F172A] text-emerald-400 rounded-xl border border-slate-700 focus:border-brand-accent focus:outline-none"
                placeholder="/* Add custom campaign styles here */"
              />
            </div>
          ) : (
            <>
              {/* Section Stack */}
              <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <span className="text-xs font-bold text-brand-graphite font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-accent" />
                Page Sections ({sections.length})
              </span>
              <span className="text-[11px] text-brand-muted">Drag & Order</span>
            </div>

            <div className="space-y-2">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedSectionId === sec.id
                      ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/30'
                      : 'border-brand-border bg-white hover:border-brand-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-brand-softGray border border-brand-border flex items-center justify-center text-[10px] font-mono font-bold text-brand-graphite">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-brand-graphite">{sec.title}</div>
                      <div className="text-[10px] font-mono text-brand-muted">{sec.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleEnable(sec.id)}
                      className="p-1 rounded text-brand-muted hover:text-brand-graphite"
                      title={sec.enabled ? 'Hide Section' : 'Show Section'}
                    >
                      {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500" />}
                    </button>
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-1 rounded text-brand-muted hover:text-brand-graphite disabled:opacity-20"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-1 rounded text-brand-muted hover:text-brand-graphite disabled:opacity-20"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Property Editor */}
          {activeSection && (
            <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-brand-border pb-3">
                <span className="text-[10px] font-mono text-brand-accent uppercase font-bold tracking-wider">
                  Configuring Section
                </span>
                <h3 className="text-sm font-bold text-brand-graphite mt-0.5">
                  {activeSection.title}
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {activeSection.heading !== undefined && (
                  <div className="space-y-1">
                    <label className="font-bold text-brand-graphite">Headline</label>
                    <input
                      type="text"
                      value={activeSection.heading}
                      onChange={(e) => handleUpdateActive({ heading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                )}

                {activeSection.subheading !== undefined && (
                  <div className="space-y-1">
                    <label className="font-bold text-brand-graphite">Subheading / Description</label>
                    <textarea
                      rows="2"
                      value={activeSection.subheading}
                      onChange={(e) => handleUpdateActive({ subheading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                )}

                {activeSection.ctaText !== undefined && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-graphite">Button Label</label>
                      <input
                        type="text"
                        value={activeSection.ctaText}
                        onChange={(e) => handleUpdateActive({ ctaText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-brand-graphite">Button Link</label>
                      <input
                        type="text"
                        value={activeSection.ctaLink}
                        onChange={(e) => handleUpdateActive({ ctaLink: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {activeSection.badge !== undefined && (
                  <div className="space-y-1">
                    <label className="font-bold text-brand-graphite">Badge Pill Text</label>
                    <input
                      type="text"
                      value={activeSection.badge}
                      onChange={(e) => handleUpdateActive({ badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none font-mono uppercase"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
            </>
          )}
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-7">
          <div className="bg-brand-softGray border border-brand-border rounded-3xl p-4 shadow-inner">
            <div className="text-center pb-3">
              <span className="text-[11px] font-mono text-brand-muted uppercase">
                {previewMode === 'mobile' ? 'Mobile Viewport (375px)' : 'Full Desktop Viewport'}
              </span>
            </div>

            <div
              className={`mx-auto bg-white rounded-2xl border border-brand-border shadow-lg overflow-hidden transition-all ${
                previewMode === 'mobile' ? 'max-w-sm' : 'w-full'
              }`}
            >
              <div className="p-4 bg-brand-graphite text-white flex items-center justify-between border-b border-white/10">
                <span className="text-xs font-mono font-bold text-brand-accent">LAZYFORGE</span>
                <span className="text-[10px] text-white/50 font-mono">STOREFRONT PREVIEW</span>
              </div>

              {/* Sections Stream */}
              <div className="divide-y divide-brand-border max-h-[620px] overflow-y-auto">
                {sections
                  .filter((s) => s.enabled)
                  .map((sec) => (
                    <div
                      key={sec.id}
                      className={`p-6 transition-all ${
                        sec.id === selectedSectionId ? 'bg-brand-accent/5' : 'bg-white'
                      }`}
                    >
                      {sec.type === 'hero' && (
                        <div className="space-y-3 text-center py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-accent/10 text-brand-accent uppercase">
                            Hero Video Section
                          </span>
                          <h2 className="text-lg font-black text-brand-graphite">{sec.heading}</h2>
                          <p className="text-xs text-brand-muted max-w-sm mx-auto">{sec.subheading}</p>
                          <div className="pt-2">
                            <span className="inline-block px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold">
                              {sec.ctaText}
                            </span>
                          </div>
                        </div>
                      )}

                      {sec.type === '3d_viewer' && (
                        <div className="space-y-3">
                          <div className="text-center">
                            <span className="text-[10px] font-mono text-brand-accent uppercase font-bold">
                              {sec.badge || '3D Showcase'}
                            </span>
                            <h3 className="text-base font-extrabold text-brand-graphite">{sec.heading}</h3>
                            <p className="text-xs text-brand-muted">{sec.subheading}</p>
                          </div>
                          <div className="h-44 rounded-xl bg-[#0A0D14] flex items-center justify-center text-brand-accent font-mono text-xs border border-brand-accent/30">
                            <Box className="w-6 h-6 mr-2 animate-bounce" />
                            <span>Interactive Three.js 3D WebGL Rig Active</span>
                          </div>
                        </div>
                      )}

                      {sec.type === 'featured_products' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-brand-graphite">{sec.heading}</h3>
                            <span className="text-[11px] text-brand-accent font-bold">View All &rarr;</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl border border-brand-border bg-brand-softGray space-y-1">
                              <div className="font-bold text-brand-graphite">ESP32 Quadruped Robot</div>
                              <div className="text-brand-accent font-mono font-bold">৳4,250</div>
                            </div>
                            <div className="p-3 rounded-xl border border-brand-border bg-brand-softGray space-y-1">
                              <div className="font-bold text-brand-graphite">Cyberpunk Tabletop Bot</div>
                              <div className="text-brand-accent font-mono font-bold">৳3,800</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {sec.type === 'specifications' && (
                        <div className="space-y-2 text-xs">
                          <h3 className="text-sm font-bold text-brand-graphite">{sec.heading}</h3>
                          <p className="text-brand-muted text-[11px]">{sec.subheading}</p>
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="p-2 rounded bg-brand-softGray border border-brand-border font-mono text-[11px]">
                              240MHz Dual-Core
                            </div>
                            <div className="p-2 rounded bg-brand-softGray border border-brand-border font-mono text-[11px]">
                              12-DOF Micro Servos
                            </div>
                          </div>
                        </div>
                      )}

                      {sec.type === 'faq' && (
                        <div className="space-y-2 text-xs">
                          <h3 className="text-sm font-bold text-brand-graphite flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-brand-accent" />
                            <span>{sec.heading}</span>
                          </h3>
                          <div className="p-2.5 rounded-lg border border-brand-border space-y-1">
                            <div className="font-bold text-brand-graphite">What are delivery timeframes?</div>
                            <p className="text-[11px] text-brand-muted">
                              1-2 business days inside Dhaka, 2-4 days nationwide via courier.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPageBuilderPage;
