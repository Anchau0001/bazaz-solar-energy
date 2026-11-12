import React from 'react';
import { CheckCircle2, Zap, Sun, MapPin, ArrowUpRight } from 'lucide-react';

interface FeaturedProjectsProps {
  onRequestQuote: (projectContext?: string) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ onRequestQuote }) => {
  const projects = [
    {
      title: '10kVA Hybrid Lithium Solar Installation',
      location: 'ABU Senior Staff Quarters, Samaru, Zaria',
      category: 'Residential Villa',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      specs: '10kVA Growatt Hybrid Inverter • 2x 10kWh Felicity Lithium LiFePO4 • 16x 550W Jinko Mono PERC Panels',
      loadPowered: 'Runs 3 Inverter ACs, 2 Refrigerators, Deep Freezer, 1HP Borehole Water Pump, CCTV & Entire House Lighting',
      result: 'Zero fuel consumption; complete 24/7 grid independence during frequent national grid collapse.'
    },
    {
      title: '5kVA Commercial Plaza & Pharmacy Backup',
      location: 'Nagoyi Main Commercial Corridor, Zaria',
      category: 'Commercial Business',
      image: 'https://images.unsplash.com/photo-1548611716-ad957e87ce6a?auto=format&fit=crop&w=800&q=80',
      specs: '5kVA Felicity 48V Hybrid MPPT Inverter • 1x 5.12kWh Wall-Mounted Lithium Battery • 8x 550W Tier-1 Panels',
      loadPowered: 'Powers 2 Medicine Cold Storage Fridges, Point of Sale (POS) Terminals, Computers, Fans & Signboards',
      result: 'Saves ₦180,000 monthly on generator diesel and petrol expenses while safeguarding temperature-sensitive vaccines.'
    },
    {
      title: 'Direct Solar Submersible Water Pumping Station',
      location: 'Shika Agro-Industrial Farm, Kaduna State',
      category: 'Agricultural & Irrigation',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      specs: '3HP Solar MPPT Water Pump Inverter (VFD) • 10x 450W Canadian Solar Panels • Float Switch Automation',
      loadPowered: 'Pumps over 45,000 Litres of water daily from 120m borehole depth directly into irrigation storage tanks',
      result: 'Automated daylight water delivery with zero battery costs, boosting crop yield and cattle drinking supplies.'
    },
    {
      title: '3.5kVA Clean Silent Power for Diagnostic Medical Clinic',
      location: 'Sabon Gari, Zaria, Kaduna State',
      category: 'Healthcare & Diagnostics',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      specs: '3.5kVA 24V Pure Sine Wave Inverter • 4x 220Ah Luminous Tubular Deep Cycle Batteries • Schneider DC Protections',
      loadPowered: 'Laboratory centrifuges, microscopes, patient monitors, ultrasound backup and emergency room lighting',
      result: 'Silent, vibration-free, non-polluting electrical energy critical for delicate diagnostic medical readings.'
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
              <Sun className="w-3.5 h-3.5 text-emerald-700" />
              <span>Proven Track Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              Featured Installations in Zaria & Kaduna
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Inspect real-world residential, commercial, healthcare, and agricultural solar power installations completed by our certified engineering team.
            </p>
          </div>

          <button
            onClick={() => onRequestQuote('Featured Projects Inquiry')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-md self-start md:self-auto"
          >
            <span>Request a Site Survey</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-lg transition duration-200 flex flex-col group"
            >
              <div className="aspect-16/9 relative overflow-hidden bg-slate-900">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-emerald-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {proj.category}
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{proj.location}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-900 transition">
                    {proj.title}
                  </h3>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs text-slate-700 mb-3 space-y-1">
                    <span className="font-bold text-emerald-900 block">System Components:</span>
                    <p className="font-mono text-[11px] text-slate-600">{proj.specs}</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p><strong>Load Handled:</strong> {proj.loadPowered}</p>
                    <p className="text-emerald-800 font-semibold"><strong>Impact:</strong> {proj.result}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Tested in Kaduna climate</span>
                  <button
                    onClick={() => onRequestQuote(`Quotation for similar project: ${proj.title}`)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>Get Similar System</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
