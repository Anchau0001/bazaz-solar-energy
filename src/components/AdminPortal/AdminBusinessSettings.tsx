import React, { useState } from 'react';
import { BusinessSettings } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { Settings, Save, CheckCircle2, Building, Phone, Mail, Globe, Receipt, CreditCard } from 'lucide-react';

interface AdminBusinessSettingsProps {
  settings: BusinessSettings;
  onRefreshData: () => void;
}

export const AdminBusinessSettings: React.FC<AdminBusinessSettingsProps> = ({
  settings,
  onRefreshData
}) => {
  const [formData, setFormData] = useState<BusinessSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field: keyof BusinessSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    try {
      await api.updateSettings(formData);
      setSuccessMessage('Business settings successfully updated!');
      onRefreshData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update business settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Business Profile & System Settings</h3>
          <p className="text-xs text-slate-500">
            Configure official business identity, contact lines, currency, and receipt design
          </p>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Company Identity */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-800" />
            <span>Company Name & Trading Identity</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Registered Business Name</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={e => handleChange('companyName', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Trading / Brand Name</label>
              <input
                type="text"
                required
                value={formData.tradingName}
                onChange={e => handleChange('tradingName', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Physical Store Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => handleChange('address', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
            />
          </div>
        </div>

        {/* Contact Lines */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-800" />
            <span>Communications & Digital Desk</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Phone</label>
              <input
                type="text"
                value={formData.phones[0] || ''}
                onChange={e => {
                  const p = [...formData.phones];
                  p[0] = e.target.value;
                  handleChange('phones', p);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Secondary Phone</label>
              <input
                type="text"
                value={formData.phones[1] || ''}
                onChange={e => {
                  const p = [...formData.phones];
                  p[1] = e.target.value;
                  handleChange('phones', p);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Desk Number (Intl format)</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={e => handleChange('whatsapp', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Website URL</label>
              <input
                type="text"
                value={formData.website}
                onChange={e => handleChange('website', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-800" />
            <span>Currency & Tax Policies</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formData.currencySymbol}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Currency Code</label>
              <input
                type="text"
                value={formData.currencyCode}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tax Rate % (Solar Exemption)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.taxRatePercent}
                onChange={e => handleChange('taxRatePercent', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Receipt Header & Footer */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-800" />
            <span>Receipt Branding & Warranty Messages</span>
          </h4>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Receipt Header Greeting</label>
            <input
              type="text"
              value={formData.receiptHeaderMessage}
              onChange={e => handleChange('receiptHeaderMessage', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Receipt Footer Warranty Disclaimer</label>
            <textarea
              rows={2}
              value={formData.receiptFooterMessage}
              onChange={e => handleChange('receiptFooterMessage', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
