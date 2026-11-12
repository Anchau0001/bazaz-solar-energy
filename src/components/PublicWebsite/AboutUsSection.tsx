import React from 'react';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, HeartHandshake, MapPin, Users } from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about-us" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-3.5">
              <img
                src="/logo.png"
                alt="Bazaz Solar Energy Logo"
                className="w-16 h-16 object-contain rounded-full bg-white p-1 border border-emerald-600/30 shadow-md shrink-0"
              />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>About Bazaz Solar Energy</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight leading-tight">
              Pioneering Clean, Uninterrupted Power Across Kaduna State & Beyond
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>Bazaz Solar Energy and Electricity Material</strong> is a trusted solar technology and electrical procurement firm headquartered at <strong>Shop No. 7, Bazaz Plaza, Nagoyi, Zaria, Kaduna State, Nigeria</strong>.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              We specialize in the supply, engineering design, installation, and lifecycle maintenance of Grade-A solar batteries (Lithium LiFePO4 & Deep Cycle Tubular), pure sine wave hybrid inverters, tier-1 monocrystalline panels, intelligent charge controllers, and certified electrical wiring accessories.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-2xl font-black text-emerald-900 block font-serif">8+ Years</span>
                <span className="text-xs text-slate-500">Solar Engineering Experience in Northern Nigeria</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-2xl font-black text-amber-500 block font-serif">350+</span>
                <span className="text-xs text-slate-500">Successful Residential & Commercial Installations</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1508873696983-2df570464756?auto=format&fit=crop&w=1000&q=80"
                  alt="Bazaz Solar Rooftop Installation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-emerald-950 text-white p-5 rounded-2xl shadow-xl max-w-xs border border-emerald-800 hidden sm:block">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Local Physical Presence</span>
                </div>
                <p className="text-xs text-slate-300">
                  Shop No. 7, Bazaz Plaza, Nagoyi, Zaria. Visit our physical showroom to inspect equipment before buying.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To eradicate power interruptions for Nigerian households, businesses, hospitals, and agricultural farms by providing reliable, affordable, high-efficiency solar energy systems built with genuine materials.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To be the most reputable and dependable solar energy and electrical material partner across Northern Nigeria, distinguished by technical excellence and unbending product integrity.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Our Core Values</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <li>• <strong>Product Authenticity:</strong> Zero tolerance for fake batteries or sub-par cables.</li>
              <li>• <strong>Engineering Rigor:</strong> Exact mathematical load calculations without overloading.</li>
              <li>• <strong>After-Sales Support:</strong> Fast response within Zaria and Kaduna metropolis.</li>
              <li>• <strong>Transparency:</strong> Honest pricing in Nigerian Naira with no hidden fees.</li>
            </ul>
          </div>
        </div>

        {/* Why Trust Us */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-emerald-800/60">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">Trust Factors</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif mb-4">
              Why Homeowners & Businesses Trust Bazaz Solar Energy
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Unlike online-only vendors who disappear when you experience technical faults, Bazaz Solar maintains an open, accessible retail and engineering base in Bazaz Plaza, Nagoyi, Zaria.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Grade-A Lithium & Tubular Cells:</strong> Direct manufacturer batch testing to ensure full rated capacity.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Qualified Solar Engineers:</strong> Registered electrical technicians handling all cabling, fusing, and earthing.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Complete Electrical Accessories:</strong> In-stock MCBs, changeovers, pure copper cables, and surge arrestors.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Fast Local Dispatch:</strong> Same-day pickup from Shop 7, Bazaz Plaza, or swift on-site installation across Zaria.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
