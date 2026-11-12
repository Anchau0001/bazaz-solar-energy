import React, { useState } from 'react';
import { CustomerEnquiry } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { MessageSquare, Phone, Mail, Clock, CheckCircle2, ChevronRight, X, Send } from 'lucide-react';

interface StaffEnquiriesViewProps {
  enquiries: CustomerEnquiry[];
  onRefreshData: () => void;
}

export const StaffEnquiriesView: React.FC<StaffEnquiriesViewProps> = ({
  enquiries,
  onRefreshData
}) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [status, setStatus] = useState<CustomerEnquiry['status']>('pending');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenDetail = (enq: CustomerEnquiry) => {
    setSelectedEnquiry(enq);
    setStatus(enq.status);
    setFollowUpNotes(enq.followUpNotes || '');
  };

  const handleSaveUpdate = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      await api.updateEnquiry(selectedEnquiry.id, {
        status,
        followUpNotes
      });
      setSelectedEnquiry(null);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to update enquiry status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Website Enquiries & Quotation Leads</h3>
          <p className="text-xs text-slate-500">
            Follow up with homeowners and business prospects in Zaria who submitted website requests
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {enquiries.filter(e => e.status === 'pending').length} Actionable Pending
        </span>
      </div>

      <div className="space-y-3">
        {enquiries.map(enq => (
          <div
            key={enq.id}
            className={`p-5 rounded-2xl border transition duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              enq.status === 'pending'
                ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                : enq.status === 'in_progress'
                ? 'bg-blue-50/30 border-blue-200/60'
                : 'bg-slate-50 border-slate-200/60 opacity-80'
            }`}
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {enq.enquiryRef}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  enq.status === 'pending' ? 'bg-amber-200 text-amber-900' : enq.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {enq.status.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(enq.createdAt).toLocaleString()}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{enq.customerName}</h4>
              <p className="font-semibold text-emerald-900 text-xs">{enq.productOrService}</p>
              <p className="text-slate-600 text-xs italic">"{enq.message}"</p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-bold text-emerald-800">
                  <Phone className="w-3.5 h-3.5" />
                  {enq.phone}
                </span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                  Prefers: {enq.preferredContact}
                </span>
                {enq.followUpNotes && (
                  <span className="text-[11px] text-slate-500">
                    <strong>Note:</strong> {enq.followUpNotes}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <a
                href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enq.customerName}, this is Bazaz Solar Energy (Zaria) responding to your inquiry regarding ${enq.productOrService}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-2xs transition"
              >
                WhatsApp Customer
              </a>
              <button
                onClick={() => handleOpenDetail(enq)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                Update Status
              </button>
            </div>
          </div>
        ))}

        {enquiries.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No customer inquiries found.
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="font-mono text-amber-400 text-xs font-bold block">{selectedEnquiry.enquiryRef}</span>
                <h4 className="font-bold text-white text-sm">Update Enquiry Lead</h4>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">{selectedEnquiry.customerName} ({selectedEnquiry.phone})</p>
                <p className="text-emerald-800 font-medium mt-0.5">{selectedEnquiry.productOrService}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status:</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress (Contacted / Site Inspection Scheduled)</option>
                  <option value="converted">Converted to Sale</option>
                  <option value="closed">Closed / Cancelled</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Follow-up Notes / Remarks:</label>
                <textarea
                  rows={3}
                  placeholder="Record outcome of call, site survey schedule, or quote provided..."
                  value={followUpNotes}
                  onChange={e => setFollowUpNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdate}
                  disabled={isUpdating}
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  {isUpdating ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
