import React from 'react';
import { Sun, ShieldCheck, Zap, ArrowRight, MessageCircle, Phone, CheckCircle, Calculator, BatteryCharging, Smartphone } from 'lucide-react';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onRequestQuote: () => void;
  onOpenCalculator: () => void;
  onContactUs: () => void;
  onDownloadAPK?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onRequestQuote,
  onOpenCalculator,
  onContactUs,
  onDownloadAPK
}) => {
  const whatsappNumber = '2349168655473';

  return (
    <div className="relative bg-emerald-950 text-white overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1920&q=80"
          alt="Solar Panel Array Installation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-900/80"></div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/90 border border-emerald-600/60 text-amber-300 text-xs font-semibold shadow-inner">
              <img
                src="/logo.png"
                alt="Bazaz Solar Logo"
                className="w-5 h-5 rounded-full object-contain bg-white p-0.5 shrink-0 shadow-xs"
              />
              <span>Leading Solar & Electrical Engineering in Zaria, Kaduna State</span>
            </div>

            {/* Slogan & Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-serif">
              Reliable Solar Energy Solutions for a <span className="text-amber-400 underline decoration-amber-400/40 decoration-wavy">Brighter Tomorrow.</span>
            </h1>

            {/* Subtitle with business info */}
            <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Direct distributors of Grade-A <strong className="text-white font-semibold">Lithium Batteries</strong>, Pure Sine Wave <strong className="text-white font-semibold">Hybrid Inverters</strong>, Tier-1 <strong className="text-white font-semibold">Solar Panels</strong>, and pure copper electrical materials in Nagoyi, Zaria.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreProducts}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-400/20 active:scale-95"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRequestQuote}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm transition border border-emerald-600/60 active:scale-95 shadow-md"
              >
                <span>Request a Quote</span>
              </button>

              <button
                onClick={onOpenCalculator}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 font-semibold text-sm transition border border-slate-700 active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>Load Sizing</span>
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Bazaz Solar Energy! I would like to inquire about your solar products and installations in Zaria.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition active:scale-95 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              {onDownloadAPK && (
                <button
                  onClick={onDownloadAPK}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm transition active:scale-95 shadow-md"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Download APK</span>
                </button>
              )}
            </div>

            {/* Trust Markers */}
            <div className="pt-6 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-200">100% Genuine Gear</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-200">2 - 5 Yr Warranty</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-200">Local Shop in Zaria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-200">Certified Engineers</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900/90 to-emerald-950/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Store Highlights</span>
                </div>
                <span className="text-[11px] text-slate-300">Shop No. 7, Bazaz Plaza</span>
              </div>

              {/* Featured Power Bundle Card */}
              <div className="bg-emerald-900/50 rounded-2xl p-4 border border-emerald-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Most Popular Setup in Zaria</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    BEST SELLER
                  </span>
                </div>
                <h4 className="font-bold text-base text-white">5kVA 48V Felicity Lithium Solar Combo</h4>
                <p className="text-xs text-slate-300">
                  Powers 1.5HP Inverter AC, Fridge, Freezer, 55" TV, Fans, Laptops, Lighting & Pumping Machine.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Starting Package</span>
                    <span className="text-lg font-black text-amber-400">₦2,950,000</span>
                  </div>
                  <button
                    onClick={onRequestQuote}
                    className="text-xs font-bold bg-white hover:bg-slate-100 text-emerald-950 px-3.5 py-2 rounded-xl transition"
                  >
                    View Package
                  </button>
                </div>
              </div>

              {/* Quick Stat Counter */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
                  <span className="text-xl font-black text-white block">350+</span>
                  <span className="text-[10px] text-emerald-300">Installations</span>
                </div>
                <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
                  <span className="text-xl font-black text-amber-400 block">1.8MW+</span>
                  <span className="text-[10px] text-slate-300">Solar Power</span>
                </div>
                <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
                  <span className="text-xl font-black text-white block">100%</span>
                  <span className="text-[10px] text-emerald-300">Uptime Focus</span>
                </div>
              </div>

              {/* Direct Call / Shop Visit Banner */}
              <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-800/70 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">Visit Our Shop Today</p>
                  <p className="text-[11px] text-slate-400">Open Mon - Sat: 8:00 AM - 6:30 PM</p>
                </div>
                <a
                  href="tel:09168655473"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
