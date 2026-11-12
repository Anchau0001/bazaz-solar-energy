import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
  Zap
} from 'lucide-react';

interface DownloadAPKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAPKModal: React.FC<DownloadAPKModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'apk'>('direct');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.bazazsolar.ng';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    const success = await install();
    setIsInstalling(false);
    if (success) {
      setInstallSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Bazaz Solar Energy Logo"
              className="w-13 h-13 object-contain rounded-2xl bg-white p-1 border-2 border-amber-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-amber-300 uppercase tracking-wider">
                  Android APK & PWA Edition
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-white font-serif mt-0.5">
                Install Bazaz Solar on Android
              </h3>
              <p className="text-xs text-emerald-200">
                Shop No. 7, Bazaz Plaza, Nagoyi, Zaria
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'direct'
                ? 'bg-white text-emerald-950 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Android Install (WebAPK)</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-white text-emerald-950 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Standalone APK Package (.apk)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {activeTab === 'direct' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>Native Android Integration (WebAPK)</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Android devices automatically mint and compile an official native Android app (WebAPK) directly on your device. Once installed, it behaves exactly like an APK downloaded from Google Play:
                </p>
                <ul className="space-y-1 text-slate-700 font-medium text-[11px] pt-1">
                  <li>• ✓ Official <strong>Bazaz Solar</strong> icon on home screen & app drawer</li>
                  <li>• ✓ Instant full-screen mode without browser address bar</li>
                  <li>• ✓ Offline catalog browsing during network blackouts in Zaria</li>
                  <li>• ✓ Rapid POS transactions for showroom staff</li>
                </ul>
              </div>

              {installSuccess || isInstalled ? (
                <div className="p-5 text-center bg-emerald-100/70 border border-emerald-300 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">App Already Installed!</h4>
                  <p className="text-slate-600 text-[11px]">
                    Bazaz Solar is already installed on this device. You can launch it directly from your Android home screen or app launcher.
                  </p>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full py-4 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstalling ? 'Installing to Android Device...' : 'Install App to Android Phone Now'}</span>
                </button>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                  <span className="font-bold text-slate-900 block text-xs">
                    How to install on any Android phone (Chrome / Samsung Internet):
                  </span>
                  <div className="space-y-2 text-slate-600 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                      <span>Tap the <strong>three dots (⋮)</strong> menu in the top-right corner of your browser.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                      <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                      <span>Tap <strong>Install</strong>. Android will mint the APK with the Bazaz Solar icon on your phone!</span>
                    </div>
                  </div>
                </div>
              )}

              {isIOS && (
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
                  <strong>iPhone / iPad Notice:</strong> Tap the Safari <strong>Share</strong> icon and choose <strong>"Add to Home Screen"</strong>.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Generate Standalone Sideloadable `.apk` Package:
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  If you need a physical `.apk` file to distribute via WhatsApp, share over Xender/Bluetooth, or upload to Google Play / Android stores:
                </p>
              </div>

              {/* PWABuilder Cloud Package Generator */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 text-xs">Option A: Microsoft PWABuilder (1-Click APK)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">RECOMMENDED</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  PWABuilder packages this app into a signed Android APK with splash screens and push notification support in seconds:
                </p>
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Build Android APK on PWABuilder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Bubblewrap CLI Option */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-400 font-sans font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>Option B: Google Bubblewrap CLI (Terminal Command)</span>
                </div>
                <p className="font-sans text-slate-400 text-[11px]">
                  Generate a native Android Studio Gradle project and signed APK locally:
                </p>
                <div className="bg-black/60 p-2.5 rounded-lg border border-slate-700 text-emerald-400 overflow-x-auto">
                  <code>npx @bubblewrap/cli init --manifest={currentUrl}/manifest.webmanifest</code>
                  <br />
                  <code>npx @bubblewrap/cli build</code>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Package ID: <strong>ng.bazazsolar.app</strong> • Optimized for all Android versions (Android 8.0 through Android 15+)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Bazaz Solar Energy & Materials</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
