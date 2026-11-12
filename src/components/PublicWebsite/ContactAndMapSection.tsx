import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Building2,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Navigation
} from 'lucide-react';

interface ContactAndMapSectionProps {
  onOpenInquiry: () => void;
}

export const ContactAndMapSection: React.FC<ContactAndMapSectionProps> = ({ onOpenInquiry }) => {
  const whatsappNumber = '2349168655473';

  return (
    <section id="contact-us" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Store Location & Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Visit Our Showroom in Zaria
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Have questions about solar panel sizing or want to test inverters and lithium batteries in person? Visit our store at Bazaz Plaza, Nagoyi, or contact our engineering helpline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Physical Showroom & Office</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Shop No. 7, Bazaz Plaza, Nagoyi, Zaria, Kaduna State, Nigeria.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Easily accessible along the main Nagoyi commercial corridor.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Phone Lines Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Direct Phone Numbers</h4>
                  <div className="space-y-1 pt-1">
                    <a
                      href="tel:09168655473"
                      className="text-xs font-bold text-emerald-900 hover:text-emerald-700 block transition"
                    >
                      09168655473 (General Sales & Site Surveys)
                    </a>
                    <a
                      href="tel:08130675552"
                      className="text-xs font-bold text-emerald-900 hover:text-emerald-700 block transition"
                    >
                      08130675552 (Technical Support & Inverter Repairs)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp & Email Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">WhatsApp & Email Inquiries</h4>
                  <p className="text-xs text-slate-600">
                    WhatsApp: <span className="font-bold text-emerald-800">+234 916 865 5473</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Email: <span className="font-medium text-slate-800">bazazsolarenergy@gmail.com</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Website: <span className="font-medium text-slate-800">www.bazazsolar.ng</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Business Operating Hours</h4>
                  <p className="text-xs text-slate-700">
                    • <strong>Monday – Saturday:</strong> 8:00 AM – 6:30 PM
                  </p>
                  <p className="text-xs text-slate-500">
                    • <strong>Sunday:</strong> Closed (Emergency Engineering Available)
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Bank Transfer Notice */}
            <div className="bg-emerald-950 text-white p-5 rounded-3xl border border-emerald-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <CreditCard className="w-4 h-4" />
                <span>Official Business Bank Accounts</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Always verify bank transfer details when paying for solar consignments:
              </p>
              <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-800 space-y-1 font-mono text-[11px]">
                <div>• First Bank: <strong>2039485721</strong> (Bazaz Solar Energy & Materials)</div>
                <div>• Stanbic IBTC: <strong>0048192847</strong> (Bazaz Solar Energy Ent)</div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map & Directions */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Google Maps Location Integration</h3>
                <p className="text-xs text-slate-500">Nagoyi, Zaria, Kaduna State</p>
              </div>
              <a
                href="https://maps.google.com/?q=Nagoyi+Zaria+Kaduna+Nigeria"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            {/* Map Frame / Visual Embed */}
            <div className="aspect-16/10 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-inner">
              <iframe
                title="Bazaz Solar Energy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15664.128766158223!2d7.7001!3d11.0855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b27fc945b0d0b5%3A0x6b7724128f73b64c!2sZaria%2C%20Kaduna%20State!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>

              {/* Pin Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold">
                  <MapPin className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                  <span>Bazaz Solar Energy & Electricity Material</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Shop No. 7, Bazaz Plaza, Nagoyi, Zaria
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px]">
                  <a
                    href="tel:09168655473"
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    📞 09168655473
                  </a>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    💬 WhatsApp Direct
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Trigger Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-amber-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Need a Custom Engineering Quotation?</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Submit your building appliances and our certified engineers will prepare an official quotation.
                </p>
              </div>
              <button
                onClick={onOpenInquiry}
                className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm shrink-0"
              >
                Send Request Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
