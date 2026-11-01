import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Terminal,
  Activity,
  FileCode,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sector: 'tech_support',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in your name, email, and message before transmitting.');
      return;
    }

    setSubmitting(true);
    // Simulate real telemetry transmission delay
    setTimeout(() => {
      const ticketId = 'LF-' + Math.floor(100000 + Math.random() * 900000);
      setSubmitting(false);
      setSubmittedTicket(ticketId);
    }, 1200);
  };

  const faqs = [
    {
      q: 'How fast is nationwide delivery across Bangladesh?',
      a: 'Deliveries inside Dhaka Metro arrive within 24 hours. For all other 63 districts across Bangladesh, orders are dispatched through verified courier partners (Steadfast / Pathao / Paperfly) and typically arrive within 48 to 72 hours.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes! Cash on Delivery is supported nationwide across all 64 districts with zero advance fees for standard items. For custom 3D additive manufacturing or high-value bulk hardware, our team may verify via phone before dispatch.',
    },
    {
      q: 'How can I get a quotation for custom 3D printing (.STL / .3MF)?',
      a: 'You can choose "Custom 3D Printing Quote" in the inquiry form above and mention your model dimensions, infill percentage, and material preference (PLA, PETG, TPU, ABS, or Resin). Our lab technicians will calculate filament mass and transmit a formal quote within 4 hours.',
    },
    {
      q: 'What is your hardware replacement warranty?',
      a: 'We provide a strict 7-Day Hassle-Free Replacement Policy for any verified manufacturer defects or dead-on-arrival components. All core robotics units and microcontrollers undergo bench testing before packing.',
    },
    {
      q: 'Do you provide discounts for university robotics clubs & researchers?',
      a: 'Yes. We actively sponsor and provide educational discounts for robotics teams from BUET, DU, IUT, RUET, CUET, SUST, and all recognized educational institutions in Bangladesh. Reach out using the enterprise sector option.',
    },
  ];

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb & Header Title */}
        <div className="border-b border-slate-200/90 pb-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <Link to="/" className="hover:text-[#0066FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Contact & Telemetry Desk</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              DIRECT TELEMETRY CHANNEL // ENGINEER DESK
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-600">
              AVERAGE RESPONSE TIME: &lt; 4 HOURS
            </span>
          </div>

          <div className="max-w-4xl space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-['Orbitron',sans-serif] uppercase leading-tight">
              Transmit To <span className="text-[#0066FF]">LazyForge</span> Command
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Need technical guidance on an ESP32 robot kit, a 3D CAD fabrication estimate, or university procurement?
              Connect directly with our engineering team in Mirpur DOHS, Dhaka.
            </p>
          </div>
        </div>

        {/* 2-Column Main Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Lab Telemetry & Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Lab Headquarters Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F19] text-white border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0066FF] to-transparent" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8]">
                  <Terminal className="w-4 h-4 text-[#0066FF]" />
                  <span>DHAKA CENTRAL LAB</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  DISPATCH: ONLINE
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#00D2FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-['Orbitron',sans-serif] text-white">Physical Location</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Road 11, Avenue 4, Mirpur DOHS, Dhaka-1216, Bangladesh
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 block mt-1">
                      Coordinates: 23.8223° N, 90.3654° E
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#00D2FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-['Orbitron',sans-serif] text-white">Voice & Hotline</h4>
                    <p className="text-xs font-mono text-slate-200 mt-0.5 font-bold">
                      +880 1800-LAZYFORGE <span className="text-slate-400 font-normal">(+880 1800-529936)</span>
                    </p>
                    <p className="text-[11px] font-mono text-slate-400">
                      Mobile / WhatsApp: +880 1711-234567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#00D2FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-['Orbitron',sans-serif] text-white">Digital Mailboxes</h4>
                    <p className="text-xs font-mono text-[#38BDF8] mt-0.5">
                      support@lazyforge.com <span className="text-slate-400 text-[10px]">(Tech Support)</span>
                    </p>
                    <p className="text-xs font-mono text-slate-300 mt-0.5">
                      sales@lazyforge.com <span className="text-slate-400 text-[10px]">(Orders & Logistics)</span>
                    </p>
                    <p className="text-xs font-mono text-slate-300 mt-0.5">
                      enterprise@lazyforge.com <span className="text-slate-400 text-[10px]">(University & Bulk)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#00D2FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-['Orbitron',sans-serif] text-white">Engineering Hours</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Saturday – Thursday: <strong className="text-white">09:00 AM – 09:00 PM BST</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Friday: On-call emergency dispatch & online support
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Quick Chat Links */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                <a
                  href="tel:+8801800529936"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Call Directly
                </a>
                <a
                  href="mailto:support@lazyforge.com"
                  className="px-3 py-1.5 rounded-lg bg-[#0066FF]/30 hover:bg-[#0066FF]/40 text-xs font-mono text-[#38BDF8] flex items-center gap-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Send Email
                </a>
              </div>
            </div>

            {/* Nationwide Verification Badge */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 font-['Orbitron',sans-serif]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Nationwide Telemetry Dispatch Protocol</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every component is packed with anti-static shielding and shockproof padding to withstand long-distance transit across all divisions in Bangladesh.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Telemetry Transmission Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold font-['Orbitron',sans-serif] text-slate-900 uppercase">
                  Transmit Telemetry Message
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your hardware details below and our lab engineers will review your transmission.
                </p>
              </div>

              {submittedTicket ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-['Orbitron',sans-serif] text-emerald-900">
                      Transmission Confirmed!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      Telemetry log successfully received and assigned to on-duty engineer.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-emerald-800 inline-block font-bold">
                    Ticket Reference: <span className="text-[#0066FF]">{submittedTicket}</span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    A confirmation packet has been dispatched to <strong className="text-slate-800">{formData.email}</strong>. Expected turnaround is under 4 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        sector: 'tech_support',
                        subject: '',
                        message: '',
                      });
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-['Orbitron',sans-serif] font-bold hover:bg-[#0066FF] transition-all"
                  >
                    Transmit Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Name / Call-Sign <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-[#0066FF] focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. tanvir@buet.ac.bd"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-[#0066FF] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +880 1711-000000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-[#0066FF] focus:outline-none transition-all"
                      />
                    </div>

                    {/* Inquiry Sector Dropdown */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Sector
                      </label>
                      <select
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-[#0066FF] focus:outline-none transition-all"
                      >
                        <option value="tech_support">Technical Support & Firmware Debugging</option>
                        <option value="3d_printing">Custom 3D Printing (.STL / .3MF Quote)</option>
                        <option value="bulk_lab">Bulk Procurement / University Robotics Lab</option>
                        <option value="order_status">Order Status & Nationwide Shipping</option>
                        <option value="general">General Partnership / Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Inquiring about ESP32-S3 Cam pinout or 3D print quote"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-[#0066FF] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Message & Telemetry Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify the components, order reference, or custom 3D model requirements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:border-[#0066FF] focus:outline-none transition-all resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0066FF] hover:bg-blue-600 disabled:bg-blue-400 text-white font-['Orbitron',sans-serif] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,102,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Packet...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Telemetry Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-slate-50/90 rounded-3xl p-6 sm:p-10 border border-slate-200/90 space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase">
              <HelpCircle className="w-4 h-4" />
              <span>FREQUENTLY ASKED TELEMETRY INQUIRIES</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-['Orbitron',sans-serif] uppercase">
              Common Questions & Answers
            </h3>
          </div>

          <div className="divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
            {faqs.map((faq, idx) => (
              <div key={idx} className="transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 font-['Orbitron',sans-serif]">
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#0066FF] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-normal bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
