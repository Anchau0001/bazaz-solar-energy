import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface FloatingWhatsAppProps {
  customMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const whatsappNumber = '2349168655473';

  const defaultPrompts = [
    'Hello Bazaz Solar, I need a quotation for a complete solar installation in Zaria.',
    'Hi, do you have Felicity 48V Lithium Battery and 5kVA Inverters currently in stock?',
    'Hello Comrd. Lawal Anchau, I want to book a site inspection for my house/business in Zaria.',
    'Hi Bazaz Solar, what is your price for 550W Tier-1 Monocrystalline Solar Panels?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || message || 'Hello Bazaz Solar Energy, I would like to make an inquiry.';
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-emerald-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-amber-400 border border-emerald-600">
                  BS
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-900 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Bazaz Solar WhatsApp Desk</h4>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Shop No. 7, Bazaz Plaza, Zaria
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-300 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50 text-xs space-y-3 max-h-72 overflow-y-auto">
            <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-slate-800">
              <p className="font-semibold text-emerald-900 mb-1">Assalamu Alaikum! Welcome to Bazaz Solar Energy.</p>
              <p className="text-slate-600 leading-relaxed">
                How can we assist you with solar panels, inverters, lithium batteries, or electrical materials today?
              </p>
              <span className="text-[10px] text-slate-400 block text-right mt-1">Official WhatsApp</span>
            </div>

            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Quick Inquiries</p>
            <div className="space-y-1.5">
              {defaultPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-200 transition text-[11px] flex items-center justify-between group shadow-2xs"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <Send className="w-3 h-3 text-emerald-600 opacity-60 group-hover:opacity-100 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              onClick={() => handleSend()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition shadow-sm shrink-0"
              title="Chat on WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition duration-200 group border-2 border-emerald-400/40"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
        </div>
        <span className="font-bold text-xs tracking-wide group-hover:inline-block hidden sm:inline">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
};
