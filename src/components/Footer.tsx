import React from 'react';
import {
  Sun,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenInquiry: () => void;
  onDownloadAPK?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onOpenInquiry, onDownloadAPK }) => {
  return (
    <footer className="bg-emerald-950 text-slate-300 pt-16 pb-12 border-t border-emerald-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Bazaz Solar Energy Logo"
                className="w-12 h-12 object-contain rounded-full bg-white p-0.5 border border-emerald-600/40 shadow-md shrink-0"
              />
              <div>
                <span className="font-serif font-black text-lg text-white tracking-tight block leading-none">
                  BAZAZ SOLAR ENERGY
                </span>
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                  & Electricity Material
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              "Reliable Solar Energy Solutions for a Brighter Tomorrow."
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              Wholesale distributor and engineering installer of Lithium LiFePO4 batteries, pure sine wave hybrid inverters, tier-1 monocrystalline panels, and certified electrical cables in Nagoyi, Zaria.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs">
              <a
                href="https://wa.me/2349168655473"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-semibold transition border border-emerald-700/60"
              >
                <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>WhatsApp Desk</span>
              </a>
              <button
                onClick={onOpenInquiry}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition"
              >
                Request Quote
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollToSection('products-catalogue')}
                  className="hover:text-white transition"
                >
                  Products Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('services')}
                  className="hover:text-white transition"
                >
                  Installation Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('load-calculator')}
                  className="hover:text-white transition"
                >
                  Solar Load Sizing Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('projects')}
                  className="hover:text-white transition"
                >
                  Completed Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('about-us')}
                  className="hover:text-white transition"
                >
                  About Our Company
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('contact-us')}
                  className="hover:text-white transition"
                >
                  Showroom Location
                </button>
              </li>
              {onDownloadAPK && (
                <li>
                  <button
                    onClick={onDownloadAPK}
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1 mt-1"
                  >
                    <span>Download Android APK</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Product Categories
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Solar Lithium & Tubular Batteries</li>
              <li>• Pure Sine Wave & Hybrid Inverters</li>
              <li>• Tier-1 Monocrystalline Solar Panels</li>
              <li>• Intelligent MPPT Charge Controllers</li>
              <li>• Pure Copper DC Cables (Coleman / KBE)</li>
              <li>• Circuit Breakers, SPDs & Changeovers</li>
              <li>• Heavy-Duty Distribution Boards & Lugs</li>
            </ul>
          </div>

          {/* Contact Details & Official Bank Info */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-amber-400">
              Store & Banking
            </h4>

            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Shop No. 7, Bazaz Plaza, Nagoyi, Zaria, Kaduna State</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>09168655473 / 08130675552</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>bazazsolarenergy@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>www.bazazsolar.ng</span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-emerald-900/60 rounded-xl border border-emerald-800 text-[11px] space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-amber-300 font-sans font-bold">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Direct Bank Transfer:</span>
              </div>
              <div>First Bank: <strong>2039485721</strong></div>
              <div>Stanbic IBTC: <strong>0048192847</strong></div>
              <span className="text-[10px] text-slate-400 font-sans block pt-0.5">
                Acct: Bazaz Solar Energy & Materials
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Bazaz Solar Energy and Electricity Material. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Nagoyi, Zaria, Nigeria</span>
            <span>•</span>
            <span>Zero-VAT Solar Renewables</span>
            <span>•</span>
            <span className="text-slate-400">RC / Registered Enterprise</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
