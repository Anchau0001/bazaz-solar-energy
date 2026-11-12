import React from 'react';
import {
  Wrench,
  Cpu,
  Zap,
  BatteryCharging,
  Cable,
  RefreshCw,
  SearchCheck,
  Headphones,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ServicesSectionProps {
  onRequestService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onRequestService }) => {
  const services = [
    {
      id: 'solar-installation',
      title: 'Solar System Installation',
      description: 'End-to-end turnkey installation of solar PV panels on metal roofs, concrete slabs, and ground-mount arrays with optimal tilt angles for maximum Northern Nigerian irradiance.',
      icon: Zap,
      features: ['Precision Rooftop Racking', 'TUV DC Cabling & Conduit Protection', 'Lightning & Earth Surge Rod Installation']
    },
    {
      id: 'system-design',
      title: 'Solar System Design & Sizing',
      description: 'Engineering load audits and design calculations to match your appliances (fans, refrigerators, air conditioners, pumps) with mathematically balanced inverter and battery sizing.',
      icon: Cpu,
      features: ['Appliance Wattage Load Analysis', 'Sun Hours & Battery Autonomy Calculation', 'Custom Single-Line Electrical Diagrams']
    },
    {
      id: 'inverter-installation',
      title: 'Inverter Installation & Setup',
      description: 'Mounting and electrical integration of Pure Sine Wave and Hybrid MPPT Inverters (1.5kVA to 50kVA) with automatic changeover systems for seamless grid-to-solar transitions.',
      icon: RefreshCw,
      features: ['Dual Power Changeover Switch Integration', 'Smart LCD Parameter Calibration', 'Zero Power Blinking Guarantee']
    },
    {
      id: 'battery-installation',
      title: 'Solar Battery Bank Setup',
      description: 'Safe installation and balancing of Lithium LiFePO4 rack batteries and Deep Cycle Tubular battery banks with proper DC isolator breakers and heavy-duty 25mm² copper links.',
      icon: BatteryCharging,
      features: ['Smart BMS Communication Programming', 'Equalized Float Charging Parameters', 'Battery Bank Fire-Safe Enclosures']
    },
    {
      id: 'electrical-wiring',
      title: 'Electrical Wiring & DB Boards',
      description: 'Professional separation of essential solar backup loads from heavy industrial loads, rewiring distribution boards, and installing dedicated surge protection devices (SPD).',
      icon: Cable,
      features: ['Pure Copper Coleman Cable Wiring', 'Surge & Voltage Fluctuation Protectors', 'Phase Balancing across 3-Phase Grids']
    },
    {
      id: 'solar-maintenance',
      title: 'Solar Maintenance & Cleaning',
      description: 'Periodic preventive servicing, dusting and de-soiling of solar panels, battery terminal cleaning, cable tightness torque tests, and thermal heat checks on circuit breakers.',
      icon: Wrench,
      features: ['Solar Panel Dust & Soot Removal', 'Tubular Battery Distilled Water Top-Up', 'System Yield Performance Audit']
    },
    {
      id: 'solar-troubleshooting',
      title: 'Solar Troubleshooting & Repairs',
      description: 'Rapid diagnostic intervention for malfunctioning inverters, error codes (e.g. F05, F08, Overload), weak battery capacity, tripping circuit breakers, or burnt bypass diodes.',
      icon: SearchCheck,
      features: ['On-Site Inverter Fault Code Diagnostics', 'Battery Internal Resistance Cell Testing', 'Rapid Component Replacement in Zaria']
    },
    {
      id: 'solar-consultation',
      title: 'Solar Consultation & Support',
      description: 'Independent expert guidance for property developers, agricultural farm owners, schools, and health facilities in Kaduna State planning renewable energy transitions.',
      icon: Headphones,
      features: ['Payback & Fuel-Saving Feasibility Studies', 'Vendor Equipment Verification', '24/7 Telephone & WhatsApp Technical Desk']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
            <Wrench className="w-3.5 h-3.5 text-emerald-700" />
            <span>Engineering & Field Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Comprehensive Solar & Electrical Services
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From initial site survey to professional mounting, battery commissioning, and scheduled maintenance, our Zaria-based engineers ensure unyielding power for your home or business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(service => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-slate-50 hover:bg-emerald-50/40 rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-300 transition duration-200 flex flex-col justify-between group shadow-2xs hover:shadow-md"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-800 group-hover:text-amber-400 group-hover:border-emerald-700 transition duration-200 mb-5 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-950 transition">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-200/70 mb-6">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onRequestService(service.title)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white group-hover:bg-emerald-800 text-slate-800 group-hover:text-white border border-slate-200 group-hover:border-emerald-800 font-semibold text-xs transition duration-150 shadow-2xs"
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
