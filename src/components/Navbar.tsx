import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';
import {
  Sun,
  MapPin,
  Phone,
  MessageCircle,
  Menu,
  X,
  ShieldCheck,
  User,
  LogOut,
  Calculator,
  LayoutDashboard,
  Layers,
  Wrench,
  Globe,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';

interface NavbarProps {
  currentView: 'public' | 'staff' | 'admin';
  onNavigateView: (view: 'public' | 'staff' | 'admin') => void;
  onOpenAuthModal: () => void;
  onOpenDownloadAPK: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  onOpenAuthModal,
  onOpenDownloadAPK,
  onScrollToSection
}) => {
  const { user, isAdmin, isStaff, logout } = useAuth();
  const { isOnline, justReconnected } = useOnlineStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'public') {
      onNavigateView('public');
      setTimeout(() => onScrollToSection(id), 100);
    } else {
      onScrollToSection(id);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Top Emergency & Info Bar (Visible on Desktop) */}
      <div className="bg-emerald-950 text-slate-200 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/60 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Shop No. 7, Bazaz Plaza, Nagoyi, Zaria, Kaduna State</span>
            </span>
            <span className="text-emerald-700">|</span>
            <span className="text-amber-300 font-semibold">
              Monday – Saturday: 8:00 AM – 6:30 PM
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isOnline && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[10px]">
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Offline • Cached Data</span>
              </span>
            )}
            {justReconnected && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px]">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Back Online</span>
              </span>
            )}
            <a
              href="tel:09168655473"
              className="flex items-center gap-1 text-slate-200 hover:text-white transition font-medium"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>09168655473</span>
            </a>
            <a
              href="tel:08130675552"
              className="flex items-center gap-1 text-slate-200 hover:text-white transition font-medium"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>08130675552</span>
            </a>
            <a
              href="https://wa.me/2349168655473"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-300 hover:text-white transition font-bold"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => {
              if (currentView !== 'public') onNavigateView('public');
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="Bazaz Solar Energy and Electricity Materials Logo"
              className="w-13 h-13 sm:w-14 sm:h-14 object-contain rounded-full shadow-md bg-white p-0.5 border border-emerald-600/30 shrink-0 group-hover:scale-105 transition transform"
            />
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-black text-lg sm:text-xl text-emerald-950 tracking-tight leading-none group-hover:text-emerald-800 transition">
                  BAZAZ SOLAR
                </span>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest hidden sm:inline">
                  ENERGY
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                & Electricity Material • Zaria
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Public View) */}
          {currentView === 'public' && (
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
              <button
                onClick={() => handleLinkClick('products-catalogue')}
                className="hover:text-emerald-800 transition"
              >
                Products
              </button>
              <button
                onClick={() => handleLinkClick('services')}
                className="hover:text-emerald-800 transition"
              >
                Services
              </button>
              <button
                onClick={() => handleLinkClick('load-calculator')}
                className="hover:text-emerald-800 text-amber-600 transition flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Load Sizing</span>
              </button>
              <button
                onClick={() => handleLinkClick('projects')}
                className="hover:text-emerald-800 transition"
              >
                Projects
              </button>
              <button
                onClick={() => handleLinkClick('about-us')}
                className="hover:text-emerald-800 transition"
              >
                About Us
              </button>
              <button
                onClick={() => handleLinkClick('contact-us')}
                className="hover:text-emerald-800 transition"
              >
                Contact & Map
              </button>
            </nav>
          )}

          {/* Right Action / Portal Switcher */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Subtle Offline Status Indicator */}
            {!isOnline ? (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold tracking-tight shadow-2xs animate-in fade-in"
                title="You are currently offline. Accessing cached version of Bazaz Solar app."
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Offline • Cached Version</span>
              </div>
            ) : justReconnected ? (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold tracking-tight shadow-2xs animate-in fade-in"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Back Online</span>
              </div>
            ) : null}

            <button
              onClick={onOpenDownloadAPK}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition shadow-xs active:scale-95"
              title="Download Android APK / Install App"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download APK</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {currentView !== 'public' ? (
                  <button
                    onClick={() => onNavigateView('public')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    <span>View Public Website</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigateView(user.role === 'admin' ? 'admin' : 'staff')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Staff POS Portal'}</span>
                  </button>
                )}

                {/* Logged in User Tag */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-bold text-slate-800 truncate max-w-[120px]">{user.fullName}</span>
                  <button
                    onClick={logout}
                    className="text-slate-400 hover:text-rose-600 transition ml-1 p-0.5"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md shadow-emerald-950/20 active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Staff & Admin Portal</span>
              </button>
            )}
          </div>

          {/* Mobile Status and Controls */}
          <div className="lg:hidden flex items-center gap-2">
            {!isOnline && (
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-bold shadow-2xs"
                title="Offline (Cached Mode)"
              >
                <WifiOff className="w-3 h-3 text-amber-600" />
                <span>Cached</span>
              </div>
            )}
            {user && (
              <button
                onClick={() => onNavigateView(currentView === 'public' ? (user.role === 'admin' ? 'admin' : 'staff') : 'public')}
                className="px-2.5 py-1.5 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg"
              >
                {currentView === 'public' ? 'Portal' : 'Website'}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Offline Notification Ribbon */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1 text-center text-xs font-semibold flex items-center justify-center gap-2 border-b border-amber-600/30 shadow-2xs">
          <WifiOff className="w-3.5 h-3.5 text-slate-950 shrink-0" />
          <span>
            You are currently <strong>offline</strong>. Viewing the cached version of Bazaz Solar app.
          </span>
        </div>
      )}
      {justReconnected && (
        <div className="bg-emerald-700 text-white px-4 py-1 text-center text-xs font-semibold flex items-center justify-center gap-2 border-b border-emerald-800 shadow-2xs animate-in fade-in duration-300">
          <Wifi className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span>Connection restored! You are back online.</span>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 text-xs">
          {!isOnline && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2 text-xs font-medium">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Offline Mode: Accessing cached version of app.</span>
            </div>
          )}
          <div className="space-y-1 font-semibold text-slate-700">
            <button
              onClick={() => handleLinkClick('products-catalogue')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 block"
            >
              Products Catalogue
            </button>
            <button
              onClick={() => handleLinkClick('services')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 block"
            >
              Installation Services
            </button>
            <button
              onClick={() => handleLinkClick('load-calculator')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-900 font-bold block"
            >
              Solar Load Calculator & Sizing
            </button>
            <button
              onClick={() => handleLinkClick('projects')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 block"
            >
              Featured Installations in Zaria
            </button>
            <button
              onClick={() => handleLinkClick('about-us')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 block"
            >
              About Bazaz Solar Energy
            </button>
            <button
              onClick={() => handleLinkClick('contact-us')}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 block"
            >
              Showroom Location & Google Map
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDownloadAPK();
              }}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download Android APK / App</span>
            </button>

            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateView(user.role === 'admin' ? 'admin' : 'staff');
                  }}
                  className="w-full py-2.5 bg-emerald-900 text-white font-bold rounded-xl text-center"
                >
                  Enter {user.role === 'admin' ? 'Admin Dashboard' : 'Staff Portal'}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 border border-slate-200 text-rose-600 font-semibold rounded-xl text-center"
                >
                  Sign Out ({user.fullName})
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-3 bg-emerald-900 text-white font-bold rounded-xl text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Staff / Admin Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
