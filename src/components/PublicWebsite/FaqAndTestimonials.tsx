import React, { useState } from 'react';
import { ChevronDown, Star, MessageSquareQuote, HelpCircle, CheckCircle2 } from 'lucide-react';

export const FaqAndTestimonials: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the main difference between Lithium LiFePO4 batteries and Tubular Deep Cycle batteries?',
      a: 'Lithium (LiFePO4) batteries offer 6,000+ cycle life (approx 10-15 years), 90% usable depth of discharge (DOD), faster charging times, zero acid fumes, and zero maintenance. Tubular batteries are reliable lead-acid batteries with a 3-5 year lifespan, requiring periodic distilled water top-ups and 50-60% recommended DOD. While lithium has a higher initial cost, its cost-per-year is significantly lower.'
    },
    {
      q: 'Will my solar panels generate power during cloudy or harmattan days in Zaria?',
      a: 'Yes. Our Tier-1 Monocrystalline PERC solar panels (e.g. Jinko and Canadian Solar) utilize high-efficiency half-cut cells designed to capture diffuse solar irradiance during overcast, rainy, or dusty Harmattan skies in Northern Nigeria. Output will be slightly lower than on clear sunny days, which is why our system sizing includes adequate battery autonomy margins.'
    },
    {
      q: 'Can a 5kVA Inverter power a 1.5HP or 1HP Inverter Air Conditioner?',
      a: 'Absolutely. A 5kVA (5,000W continuous) Pure Sine Wave Hybrid Inverter can comfortably run a 1.5HP Inverter AC alongside refrigerators, deep freezers, ceiling fans, 55" TV, and lighting, provided you have a well-sized 48V battery bank (minimum 5.12kWh lithium or 4x 220Ah tubular batteries).'
    },
    {
      q: 'What warranties are provided on equipment purchased from Bazaz Solar?',
      a: 'All our equipment comes with official manufacturer warranties: Felicity Lithium Batteries have a 5-Year warranty; Tier-1 Solar Panels have a 12-Year product and 25-Year linear power output warranty; Hybrid Inverters carry 18 to 24-Month warranties. We handle all warranty replacements locally from our shop in Bazaz Plaza.'
    },
    {
      q: 'Do you offer site inspection and engineering installation outside Zaria metropolis?',
      a: 'Yes, our certified electrical engineering team undertakes site surveys, load audits, and installations across Kaduna State (Kaduna metropolis, Kafanchan, Soba, Giwa, Makarfi) as well as neighbouring Kano and Katsina states.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Ibrahim Danladi',
      role: 'Senior Lecturer, Ahmadu Bello University (ABU), Samaru, Zaria',
      content: 'I installed a 5kVA hybrid system with a 5.12kWh Felicity lithium battery through Engr. Aliyu at Bazaz Solar. For the past year, my family has completely forgotten about KEDCO blackouts and generator noise. Flawless workmanship.',
      rating: 5,
      system: '5kVA Hybrid + 5.12kWh Lithium'
    },
    {
      name: 'Hajiya Zainab Ahmed',
      role: 'Owner, Nagoyi Pharmacy & Wellness Store, Zaria',
      content: 'Running medication cold storage in Zaria on diesel generator was eating up all our business profits. Bazaz Solar designed a custom battery backup that keeps our cold-chain intact 24/7. Their after-sales support is phenomenal.',
      rating: 5,
      system: '3.5kVA Pure Sine Wave Setup'
    },
    {
      name: 'Mallam Usman Garba',
      role: 'Managing Director, Garba Agro Farms, Shika Road',
      content: 'Their direct solar submersible pumping system solved our livestock and irrigation water shortage permanently. High quality Canadian Solar panels and prompt delivery to the farm site. Highly recommended.',
      rating: 5,
      system: '3HP Solar Water Pumping Station'
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Customer Satisfaction</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              What Our Clients in Zaria Are Saying
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Read authentic feedback from homeowners, university lecturers, retail plaza managers, and commercial farmers who transitioned to solar with Bazaz Energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                    "{t.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{t.role}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {t.system}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Answers to Common Questions</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-xs sm:text-sm hover:text-emerald-900 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-800' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white/70">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
