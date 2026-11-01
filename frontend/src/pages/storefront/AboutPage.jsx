import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  Truck,
  Box,
  Compass,
  Award,
  Users,
  Target,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Terminal,
  Activity,
  Sparkles,
} from 'lucide-react';
import { RobotViewer3D } from '../../components/storefront/RobotViewer3D';

export function AboutPage() {
  const milestones = [
    {
      year: '2023',
      title: 'Lab Genesis in Mirpur DOHS',
      desc: 'Founded by a passionate collective of mechatronics engineers and 3D printing enthusiasts frustrated by the lack of engineering-grade robotics hardware in Bangladesh.',
      badge: 'PROTOTYPE V1',
    },
    {
      year: '2024',
      title: 'Direct STL/3MF Additive Pipeline',
      desc: 'Introduced high-precision 0.05mm FDM & SLA additive manufacturing services alongside pre-calibrated ESP32 robotics chassis and rover electronics.',
      badge: 'ADDITIVE FAB',
    },
    {
      year: '2025',
      title: 'Nationwide Hardware Network',
      desc: 'Expanded express dispatch to all 64 districts with Cash on Delivery, powering university robotics clubs across BUET, DU, IUT, RUET, and CUET.',
      badge: '64 DISTRICTS',
    },
    {
      year: '2026',
      title: 'Autonomous Companion Robotics',
      desc: 'Engineered the flagship Apex-01 tabletop robotics platform with real-time WebGL CAD telemetry and edge machine vision coprocessors.',
      badge: 'EDGE TELEMETRY',
    },
  ];

  const pillars = [
    {
      icon: Cpu,
      title: 'Intelligent Robotics & Edge IoT',
      desc: 'From dual-core ESP32-S3 neural co-processors to multi-axis PWM servo controllers, every board is bench-tested before shipping.',
      tag: 'HARDWARE QA',
    },
    {
      icon: Layers,
      title: 'Additive Slicing (.STL / .3MF)',
      desc: 'Industrial-grade 3D print queue supporting engineering filaments: PETG, Carbon-Fiber PLA, TPU, and tough resin at 0.05mm layer resolution.',
      tag: '0.05MM TOLERANCE',
    },
    {
      icon: ShieldCheck,
      title: '100% Genuine & Bench-Tested',
      desc: 'Zero knock-offs. All microcontrollers, motor drivers, lidar sensors, and mechanical assemblies pass our Dhaka telemetry verification protocol.',
      tag: 'VERIFIED GENUINE',
    },
    {
      icon: Truck,
      title: 'Nationwide Express Dispatch',
      desc: 'Cash on Delivery across all 64 districts in Bangladesh. Same-day dispatch inside Dhaka and 48-hour transit for regional divisions.',
      tag: 'BANGLADESH WIDE',
    },
  ];

  const teamValues = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'Democratize access to bleeding-edge robotics hardware, microcontrollers, and digital fabrication tools for Bangladeshi engineers, students, and makers.',
    },
    {
      icon: Award,
      title: 'Engineering Standard',
      desc: 'We do not sell untested components. Every robotic car kit, lidar module, and ESC controller is subjected to high-voltage and signal continuity tests.',
    },
    {
      icon: Users,
      title: 'Maker Community',
      desc: 'Proud partners to university robotics competitions, national hackathons, and independent hardware inventors throughout the country.',
    },
  ];

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Breadcrumbs & Hero Intro */}
        <div className="border-b border-slate-200/90 pb-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <Link to="/" className="hover:text-[#0066FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">About Us</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              LAB MISSION // TELEMETRY DIRECTIVE
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-600">
              HQ: MIRPUR DOHS, DHAKA
            </span>
          </div>

          <div className="max-w-4xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-['Orbitron',sans-serif] uppercase leading-tight">
              Forging The <span className="text-[#0066FF]">Robotics & Additive</span> Future
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              LazyForge Technologies is Bangladesh’s premier engineering store and digital fabrication lab.
              From articulated robotics chassis and ESP32 neural controllers to precision 3D printing in .STL and .3MF,
              we equip makers, university teams, and researchers with industry-standard hardware.
            </p>
          </div>
        </div>

        {/* Live 3D Laboratory Showcase & Engineering Preview */}
        <div className="bg-[#0B0F19] text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Top glowing cyber accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0066FF] to-transparent" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/40 text-xs font-mono text-[#38BDF8]">
                <Activity className="w-3.5 h-3.5 text-[#00D2FF]" />
                INTERACTIVE 3D CAD LAB
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-['Orbitron',sans-serif] tracking-tight text-white uppercase">
                Born in the Lab, Built for the Field
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every LazyForge robot companion, articulated robotic arm, and rover is modeled in parametric CAD,
                sliced with industrial additive algorithms, and validated with high-frequency telemetry.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Direct .STL / .3MF Slicer Integration:</strong> Upload and preview 3D kinematics right from the browser.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Pre-Loaded Telemetry Firmware:</strong> Ready-to-flash sketches with ROS2, MicroPython, and Arduino IDE support.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Full Schematics & Wiring Guides:</strong> Comprehensive documentation for student builders and labs.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-['Orbitron',sans-serif] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,102,255,0.4)] flex items-center gap-2"
                >
                  <span>Explore Hardware</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-[#0066FF] text-slate-300 hover:text-white font-['Orbitron',sans-serif] font-bold text-xs tracking-wider uppercase transition-all"
                >
                  Contact Engineers
                </Link>
              </div>
            </div>

            {/* 3D Model interactive viewport */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-800 bg-[#07090E] p-2 shadow-inner">
                <RobotViewer3D height="440px" />
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-[#0066FF]/50 transition-all">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
              GEOGRAPHIC COVERAGE
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Orbitron',sans-serif] group-hover:text-[#0066FF] transition-colors">
              64 / 64
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">Districts reached via Cash on Delivery</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-[#0066FF]/50 transition-all">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
              DEPLOYED HARDWARE
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Orbitron',sans-serif] group-hover:text-[#0066FF] transition-colors">
              10,000+
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">Robotics units, sensors & microcontrollers</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-[#0066FF]/50 transition-all">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
              ADDITIVE RESOLUTION
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Orbitron',sans-serif] group-hover:text-[#0066FF] transition-colors">
              0.05 mm
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">Ultra-fine industrial slicer calibration</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:border-[#0066FF]/50 transition-all">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
              BENCH TESTING
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Orbitron',sans-serif] group-hover:text-[#0066FF] transition-colors">
              100%
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">Zero dead-on-arrival warranty guarantee</p>
          </div>
        </div>

        {/* 4 Core Technology Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#0066FF] uppercase tracking-wider">
              ENGINEERING ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Orbitron',sans-serif] uppercase">
              The Four Pillars of LazyForge
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We operate at the intersection of embedded electronics, rapid additive manufacturing, and robotics software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0066FF] transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center group-hover:bg-[#0066FF] group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-600">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Orbitron',sans-serif] mb-2 group-hover:text-[#0066FF] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline / Milestones */}
        <div className="space-y-8 bg-slate-50/80 p-6 sm:p-10 rounded-3xl border border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#0066FF] uppercase tracking-wider">
              CHRONOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Orbitron',sans-serif] uppercase">
              Our Journey & Evolution
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              From an experimental bench in Mirpur to powering automated systems nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-['Orbitron',sans-serif] text-[#0066FF]">
                    {m.year}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#0066FF]/10 text-[#0066FF]">
                    {m.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-['Orbitron',sans-serif]">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamValues.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Icon className="w-5 h-5 text-[#0066FF]" />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-['Orbitron',sans-serif]">
                  {v.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0066FF] to-blue-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black font-['Orbitron',sans-serif] tracking-tight uppercase">
              Ready to Build Your Next Machine?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Explore our full inventory of microcontrollers, sensors, 3D printing filaments, and robotic chassis.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-white text-[#0066FF] hover:bg-slate-100 font-['Orbitron',sans-serif] font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Browse Catalog
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border border-white/40 hover:bg-white/10 text-white font-['Orbitron',sans-serif] font-bold text-xs uppercase tracking-wider transition-all"
            >
              Contact Our Engineers
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
