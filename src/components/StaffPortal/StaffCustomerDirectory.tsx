import React, { useState } from 'react';
import { Customer } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { UserPlus, Search, Phone, Mail, MapPin, CheckCircle2, UserCheck, X } from 'lucide-react';

interface StaffCustomerDirectoryProps {
  customers: Customer[];
  onRefreshData: () => void;
}

export const StaffCustomerDirectory: React.FC<StaffCustomerDirectoryProps> = ({
  customers,
  onRefreshData
}) => {
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [customerType, setCustomerType] = useState<'retail' | 'installer' | 'corporate'>('retail');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      c.address.toLowerCase().includes(q)
    );
  });

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Full Name and Phone Number are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createCustomer({
        fullName,
        phone,
        email: email.trim() || undefined,
        address: address.trim() || 'Zaria',
        customerType,
        notes: notes.trim() || undefined
      });
      setShowCreateModal(false);
      setFullName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setNotes('');
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Customer Directory & Registration</h3>
          <p className="text-xs text-slate-500">
            Maintain client records, installers, and corporate accounts in Zaria
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search customer by name, phone number (080...), or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  c.customerType === 'corporate' ? 'bg-purple-100 text-purple-800' : c.customerType === 'installer' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {c.customerType}
                </span>
                <span className="text-[11px] font-black text-slate-900">
                  Total: ₦{c.totalPurchases.toLocaleString()}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm leading-snug">{c.fullName}</h4>

              <div className="space-y-1 text-xs text-slate-600 mt-2">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <a href={`tel:${c.phone}`} className="font-semibold text-emerald-900 hover:underline">{c.phone}</a>
                </div>
                {c.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                <div className="flex items-start gap-1.5 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-500 line-clamp-1">{c.address}, {c.city}</span>
                </div>
              </div>

              {c.notes && (
                <div className="mt-2.5 p-2 bg-white rounded-lg border border-slate-200/60 text-[11px] text-slate-600 italic">
                  "{c.notes}"
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Added: {new Date(c.createdAt).toLocaleDateString()}</span>
              <a
                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-700 hover:underline"
              >
                WhatsApp Customer
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Register New Customer</h4>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="p-6 space-y-3.5 text-xs">
              {errorMsg && <p className="text-rose-600 font-semibold">{errorMsg}</p>}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alh. Bashir Lawal"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="080..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Type</label>
                  <select
                    value={customerType}
                    onChange={e => setCustomerType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="retail">Retail Buyer</option>
                    <option value="installer">Solar Installer</option>
                    <option value="corporate">Corporate / Farm</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Address / Landmark in Zaria</label>
                <input
                  type="text"
                  placeholder="e.g. Nagoyi, near Central Mosque"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes / Preferences</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Planning 5kVA installation next month..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                ></textarea>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  {isSubmitting ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
