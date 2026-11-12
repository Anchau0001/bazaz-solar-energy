import React, { useState } from 'react';
import { Calculator, Sun, Zap, BatteryCharging, CheckCircle2, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

interface Appliance {
  id: string;
  name: string;
  category: 'lighting' | 'cooling' | 'refrigeration' | 'electronics' | 'heavy';
  watts: number;
  defaultQty: number;
  dailyHours: number;
}

const APPLIANCES: Appliance[] = [
  { id: 'app_led', name: 'LED Energy Bulbs (9W - 15W)', category: 'lighting', watts: 12, defaultQty: 6, dailyHours: 8 },
  { id: 'app_fan', name: 'Ceiling / Standing Fans (OX / Lontor)', category: 'cooling', watts: 65, defaultQty: 3, dailyHours: 10 },
  { id: 'app_tv', name: 'LED Smart TV (43" - 55")', category: 'electronics', watts: 85, defaultQty: 1, dailyHours: 6 },
  { id: 'app_decoder', name: 'DSTV / StarTimes / Soundbar', category: 'electronics', watts: 35, defaultQty: 1, dailyHours: 6 },
  { id: 'app_fridge', name: 'Inverter Refrigerator (Double Door)', category: 'refrigeration', watts: 150, defaultQty: 1, dailyHours: 12 },
  { id: 'app_freezer', name: 'Inverter Chest Deep Freezer', category: 'refrigeration', watts: 200, defaultQty: 0, dailyHours: 10 },
  { id: 'app_ac_1hp', name: '1.0 HP Inverter Air Conditioner', category: 'cooling', watts: 750, defaultQty: 0, dailyHours: 6 },
  { id: 'app_ac_15hp', name: '1.5 HP Inverter Air Conditioner', category: 'cooling', watts: 1150, defaultQty: 0, dailyHours: 6 },
  { id: 'app_laptop', name: 'Laptops & Workstations', category: 'electronics', watts: 65, defaultQty: 2, dailyHours: 6 },
  { id: 'app_cctv', name: 'CCTV Camera System & WiFi Router', category: 'electronics', watts: 55, defaultQty: 1, dailyHours: 24 },
  { id: 'app_pump', name: 'Submersible Water Pump (0.75HP / 1HP)', category: 'heavy', watts: 750, defaultQty: 0, dailyHours: 1 }
];

interface SolarLoadCalculatorProps {
  onOpenInquiry?: (loadSummary: string) => void;
}

export const SolarLoadCalculator: React.FC<SolarLoadCalculatorProps> = ({ onOpenInquiry }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    APPLIANCES.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.defaultQty }), {})
  );

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Calculations
  let totalRunningWatts = 0;
  let totalDailyWattHours = 0;

  APPLIANCES.forEach(app => {
    const qty = quantities[app.id] || 0;
    const running = qty * app.watts;
    totalRunningWatts += running;
    totalDailyWattHours += running * app.dailyHours;
  });

  const dailyKWh = (totalDailyWattHours / 1000);

  // Inverter Sizing (with 25% safety margin)
  let recommendedInverter = '1.5kVA / 12V Pure Sine Wave';
  let inverterKVA = 1.5;
  if (totalRunningWatts > 3500) {
    recommendedInverter = '10kVA / 48V High Voltage Hybrid';
    inverterKVA = 10;
  } else if (totalRunningWatts > 1800) {
    recommendedInverter = '5kVA / 48V MPPT Hybrid Inverter';
    inverterKVA = 5;
  } else if (totalRunningWatts > 800) {
    recommendedInverter = '3kVA / 24V Pure Sine Wave Inverter';
    inverterKVA = 3;
  }

  // Battery Sizing (Lithium vs Tubular options)
  let recommendedLithium = '1x 48V 100Ah (5.12kWh) LiFePO4';
  let recommendedTubular = '2x 220Ah 12V Tubular Batteries';
  if (dailyKWh > 12) {
    recommendedLithium = '2x 48V 200Ah (20.4kWh) Lithium Bank';
    recommendedTubular = '8x 220Ah Tubular Deep Cycle (48V)';
  } else if (dailyKWh > 6) {
    recommendedLithium = '1x 48V 200Ah (10.24kWh) Lithium Battery';
    recommendedTubular = '4x 220Ah Tubular Deep Cycle (48V)';
  } else if (dailyKWh <= 3) {
    recommendedLithium = '1x 24V 100Ah (2.56kWh) Lithium Battery';
    recommendedTubular = '2x 220Ah 12V Tubular Batteries (24V)';
  }

  // Panels required (assuming 4.8 peak sun hours in Northern Nigeria/Zaria)
  const requiredSolarWatts = (totalDailyWattHours / 4.8) * 1.25; // with loss factor
  const panelWatts = 550; // Jinko 550W Tier 1 standard
  const panelCount = Math.max(2, Math.ceil(requiredSolarWatts / panelWatts));

  const summaryText = `Load Sizing Summary:
• Total Running Load: ${totalRunningWatts} Watts
• Estimated Daily Usage: ${dailyKWh.toFixed(1)} kWh/day
• Recommended Inverter: ${recommendedInverter}
• Recommended Lithium Battery: ${recommendedLithium}
• Solar Array: ${panelCount}x 550W Tier-1 Panels`;

  const handleWhatsAppSend = () => {
    const message = `Hello Bazaz Solar Energy! I used your Solar Load Calculator for my building in Zaria.\n\n${summaryText}\n\nPlease send me an official quotation with installation cost.`;
    window.open(`https://wa.me/2349168655473?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="load-calculator" className="py-16 bg-gradient-to-b from-slate-50 to-emerald-50/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive System Sizing Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            Calculate Your Solar Load & Sizing
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Select your household or business appliances in Zaria and instantly calculate the exact Inverter capacity, Lithium battery storage, and Solar panels required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Appliance Selection Panel */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Select Your Appliances</h3>
                <p className="text-xs text-slate-500">Adjust the quantity of appliances you want to power</p>
              </div>
              <button
                onClick={() => setQuantities(APPLIANCES.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {}))}
                className="text-xs text-slate-400 hover:text-emerald-700 font-medium transition"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {APPLIANCES.map(app => {
                const qty = quantities[app.id] || 0;
                return (
                  <div
                    key={app.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition duration-150 ${
                      qty > 0
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50/60 border-slate-200/60 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-sm">{app.name}</span>
                        {qty > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800">
                            {qty * app.watts}W
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ~{app.watts}W each • Approx {app.dailyHours} hrs runtime/day
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => updateQty(app.id, -1)}
                        className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-30"
                        disabled={qty <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-900">{qty}</span>
                      <button
                        onClick={() => updateQty(app.id, 1)}
                        className="w-8 h-8 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-700 flex items-center justify-center transition shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results & Recommendation Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-sm text-amber-300">Engineering Recommendation</span>
                  </div>
                  <span className="text-xs bg-emerald-800/80 px-2.5 py-1 rounded-full text-emerald-200 font-medium">
                    Kaduna Climate Calibrated
                  </span>
                </div>

                {/* Main Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/50">
                    <span className="text-[11px] text-emerald-300 font-medium block">Total Running Load</span>
                    <span className="text-2xl font-black text-white">{totalRunningWatts}</span>
                    <span className="text-xs text-amber-400 ml-1 font-bold">Watts</span>
                  </div>
                  <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/50">
                    <span className="text-[11px] text-emerald-300 font-medium block">Daily Energy Needs</span>
                    <span className="text-2xl font-black text-white">{dailyKWh.toFixed(1)}</span>
                    <span className="text-xs text-amber-400 ml-1 font-bold">kWh / Day</span>
                  </div>
                </div>

                {/* Sized Components Breakdown */}
                <div className="space-y-3.5 mb-6 text-xs">
                  <div className="flex items-start gap-3 bg-emerald-900/30 p-3 rounded-xl border border-emerald-800/30">
                    <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-100 block">Recommended Inverter</span>
                      <span className="text-emerald-200 font-medium">{recommendedInverter}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-emerald-900/30 p-3 rounded-xl border border-emerald-800/30">
                    <BatteryCharging className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-100 block">Battery Storage (Choice)</span>
                      <span className="text-emerald-200 font-medium block">• Lithium: {recommendedLithium}</span>
                      <span className="text-slate-300 block text-[11px] mt-0.5">• Tubular: {recommendedTubular}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-emerald-900/30 p-3 rounded-xl border border-emerald-800/30">
                    <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-100 block">Solar PV Generation Array</span>
                      <span className="text-emerald-200 font-medium">
                        {panelCount} Units of 550W Monocrystalline Panels ({(panelCount * 0.55).toFixed(1)} kW Array)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    onClick={handleWhatsAppSend}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20"
                  >
                    <MessageSquare className="w-4 h-4 fill-slate-950" />
                    <span>Get Official Quote on WhatsApp</span>
                  </button>

                  {onOpenInquiry && (
                    <button
                      onClick={() => onOpenInquiry(summaryText)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800/90 hover:bg-emerald-800 text-white font-medium text-xs transition border border-emerald-700"
                    >
                      <span>Submit Website Inquiry Form</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Guarantee Tag */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                All systems sized by Bazaz Solar include dedicated DC Surge Protection, Earthing and Free On-Site Inspection within Zaria metropolis.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
