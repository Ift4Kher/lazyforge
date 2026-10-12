import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  RotateCw,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  Sparkles,
  HelpCircle,
  Box,
  Check,
  AlertCircle,
} from 'lucide-react';
import { RobotViewer3D } from '../../components/storefront/RobotViewer3D';
import { RobotMascotPage } from './RobotMascotPage';
import { useCart } from '../../context/CartContext';
import { formatBDT } from '../../utils/currency';

export function CampaignLandingPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    async function loadCampaign() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/v1/campaigns/${slug}`);
        if (!res.ok) {
          if (res.status === 404 && slug === 'robot-mascot') {
            // Fallback to static mascot page
            setCampaign({ isFallbackMascot: true });
            return;
          }
          throw new Error(`Campaign '${slug}' not found`);
        }
        const data = await res.json();
        if (data.success && data.data) {
          setCampaign(data.data);
        } else {
          throw new Error('Invalid campaign data');
        }
      } catch (err) {
        console.warn('Campaign fetch error:', err.message);
        if (slug === 'robot-mascot') {
          setCampaign({ isFallbackMascot: true });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadCampaign();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#080B11] text-white">
        <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent animate-pulse mb-4">
          <Cpu className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-mono tracking-widest text-brand-muted uppercase">
          Synthesizing Campaign Telemetry...
        </p>
      </div>
    );
  }

  // Fallback to dedicated static mascot page if slug is robot-mascot and fallback requested
  if (campaign?.isFallbackMascot) {
    return <RobotMascotPage />;
  }

  if (error || !campaign) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#080B11] text-white">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black">Campaign Not Found</h1>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          The requested campaign experience is either currently in draft status or has not been deployed.
        </p>
        <Link
          to="/products"
          className="mt-6 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
        >
          Explore Product Catalog
        </Link>
      </div>
    );
  }

  const sections = campaign.sections?.filter((s) => s.enabled) || [];

  const sampleProducts = [
    {
      id: 1,
      name: 'ESP32 Autonomous Quadruped Spider Robot Kit',
      slug: 'esp32-autonomous-quadruped-spider-robot-kit',
      sale_price: '4250.00',
      regular_price: '4800.00',
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    },
    {
      id: 2,
      name: 'Cyberpunk Articulated Tabletop Robot Mascot (Apex-01)',
      slug: 'cyberpunk-articulated-tabletop-robot-mascot',
      sale_price: '3800.00',
      regular_price: '4200.00',
      image_url: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c',
    },
  ];

  const handleQuickAdd = (prod) => {
    addToCart(prod, 1);
    setAddedItem(prod.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-white selection:bg-brand-accent selection:text-white">
      {/* Inject sanitized custom CSS safely if present */}
      {campaign.customCss && (
        <style dangerouslySetInnerHTML={{ __html: campaign.customCss }} />
      )}

      {/* Campaign Sections */}
      <div className="space-y-16 pb-24">
        {sections.map((section) => {
          if (section.type === 'hero') {
            return (
              <section key={section.id} className="relative pt-12 pb-8 overflow-hidden">
                <div className="absolute inset-0 bg-radial from-brand-accent/15 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-accent/20 border border-brand-accent/40 text-brand-accent tracking-wider uppercase">
                      Official Campaign
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      Version {campaign.versionNumber || 1}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl leading-tight">
                    {section.heading || campaign.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-400 max-w-2xl mt-4 leading-relaxed">
                    {section.subheading}
                  </p>

                  {section.ctaText && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        to={section.ctaLink || '/products'}
                        className="px-6 py-3 rounded-xl font-bold text-xs bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow transition-all flex items-center gap-2"
                      >
                        <span>{section.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (section.type === '3d_viewer') {
            return (
              <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                  <span className="text-xs font-mono font-bold text-brand-accent uppercase tracking-wider">
                    {section.badge || 'Three.js Interactive CAD'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
                    {section.heading || 'Interactive 3D Robotics Model'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                    {section.subheading || 'Orbit, pan, and inspect articulation in full 60 FPS WebGL.'}
                  </p>
                </div>

                <div className="h-[460px] sm:h-[540px] rounded-2xl overflow-hidden border border-brand-accent/30 bg-[#0A0D14] shadow-2xl relative">
                  <RobotViewer3D autoRotate={false} />
                </div>
              </section>
            );
          }

          if (section.type === 'featured_products') {
            return (
              <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white">{section.heading || 'Featured Engineering Kits'}</h2>
                    <p className="text-xs text-slate-400 mt-1">{section.subheading}</p>
                  </div>
                  <Link to="/products" className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1">
                    <span>View All Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {sampleProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#0E131F] border border-slate-800 hover:border-brand-accent/50 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 transition-all shadow-sm"
                    >
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full sm:w-36 h-36 object-cover rounded-xl bg-slate-900 border border-slate-800"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-extrabold text-white text-sm line-clamp-2">{p.name}</h3>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-base font-mono font-bold text-brand-accent">
                              {formatBDT(p.sale_price)}
                            </span>
                            <span className="text-xs font-mono text-slate-500 line-through">
                              {formatBDT(p.regular_price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleQuickAdd(p)}
                            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-brand-accent text-white hover:bg-brand-accentHover transition-colors flex items-center justify-center gap-1.5"
                          >
                            {addedItem === p.id ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                          <Link
                            to={`/products/${p.slug}`}
                            className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          >
                            Specs
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === 'specifications') {
            return (
              <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#0E131F] border border-slate-800 rounded-3xl p-8 sm:p-10">
                  <div className="max-w-2xl mb-8">
                    <span className="text-xs font-mono font-bold text-brand-accent uppercase tracking-wider">
                      Engineering Telemetry
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                      {section.heading || 'Hardware Specifications'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2">
                      {section.subheading}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: 'Core Processor', val: 'ESP32-S3 Dual 240MHz', desc: 'Xtensa 32-bit LX7 with hardware FPU' },
                      { title: 'Actuators', val: '12 Articulated Servos', desc: 'High torque metal gear micro servos' },
                      { title: 'Telemetry', val: 'WiFi 802.11 + BLE 5.0', desc: 'Real-time WebSocket bidirectional stream' },
                      { title: 'Power System', val: 'Dual 18650 Li-ion BMS', desc: 'Overcurrent & thermal protection circuitry' },
                    ].map((spec, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-[#090D15] border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                          {spec.title}
                        </span>
                        <div className="text-sm font-bold text-brand-accent font-mono">{spec.val}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{spec.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (section.type === 'faq') {
            return (
              <section key={section.id} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <span className="text-xs font-mono font-bold text-brand-accent uppercase tracking-wider">
                    Customer Assurance
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {section.heading || 'Frequently Asked Questions'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    {section.subheading}
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      q: 'How fast is delivery within Bangladesh?',
                      a: 'Orders inside Dhaka are delivered within 24–48 hours for ৳80. Orders outside Dhaka across all 64 districts are fulfilled via express courier in 2–4 business days for ৳150.',
                    },
                    {
                      q: 'Can I pay via Cash on Delivery (COD)?',
                      a: 'Yes! Cash on Delivery is supported nationwide. You inspect the sealed ESD-safe package and pay the delivery rider upon arrival.',
                    },
                    {
                      q: 'Does it come pre-assembled or as a DIY engineering kit?',
                      a: 'Each product listing clearly marks whether it is a pre-calibrated ready-to-run companion or an educational DIY modular assembly kit with step-by-step schematics and firmware.',
                    },
                    {
                      q: 'What is the warranty policy?',
                      a: 'LazyForge provides a 7-day replacement guarantee on defective components, alongside ongoing community access to firmware updates and 3D printable STL files.',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-2 text-left"
                    >
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-brand-accent shrink-0" />
                        <span>{item.q}</span>
                      </h4>
                      <p className="text-xs text-slate-400 pl-6 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default CampaignLandingPage;
