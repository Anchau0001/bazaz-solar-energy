import React, { useState } from 'react';
import { CustomerEnquiry, User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { MessageSquare, Phone, Mail, Clock, UserCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface AdminEnquiriesManagerProps {
  enquiries: CustomerEnquiry[];
  staffList: User[];
  onRefreshData: () => void;
}

export const AdminEnquiriesManager: React.FC<AdminEnquiriesManagerProps> = ({
  enquiries,
  staffList,
  onRefreshData
}) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [status, setStatus] = useState<CustomerEnquiry['status']>('pending');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenAssign = (enq: CustomerEnquiry) => {
    setSelectedEnquiry(enq);
    setStatus(enq.status);
    setAssignedStaffId(enq.assignedStaffId || '');
    setFollowUpNotes(enq.followUpNotes || '');
  };

  const handleSave = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      const staffMember = staffList.find(s => s.id === assignedStaffId);
      await api.updateEnquiry(selectedEnquiry.id, {
        status,
        assignedStaffId: assignedStaffId || undefined,
        assignedStaffName: staffMember?.fullName || undefined,
        followUpNotes
      });
      setSelectedEnquiry(null);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to update enquiry');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Customer Inquiry & Lead Pipeline</h3>
          <p className="text-xs text-slate-500">
            Monitor public inquiries, assign tasks to technicians, and track conversion to sales
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {enquiries.length} Inquiries on Record
        </span>
      </div>

      <div className="space-y-3">
        {enquiries.map(enq => (
          <div
            key={enq.id}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {enq.enquiryRef}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  enq.status === 'pending' ? 'bg-amber-100 text-amber-900' : enq.status === 'assigned' ? 'bg-purple-100 text-purple-900' : enq.status === 'in_progress' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
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
                {enq.email && (
                  <span className="text-slate-500">Email: {enq.email}</span>
                )}
                <span className="bg-white px-2 py-0.5 rounded border text-[11px]">
                  Preferred: {enq.preferredContact}
                </span>
                {enq.assignedStaffName && (
                  <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                    Assigned to: {enq.assignedStaffName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <a
                href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enq.customerName}, this is Bazaz Solar Energy (Zaria) reaching out regarding your inquiry ${enq.enquiryRef}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-2xs transition"
              >
                WhatsApp Lead
              </a>
              <button
                onClick={() => handleOpenAssign(enq)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                Assign / Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="font-mono text-amber-400 text-xs font-bold block">{selectedEnquiry.enquiryRef}</span>
                <h4 className="font-bold text-white text-sm">Assign & Manage Lead</h4>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">{selectedEnquiry.customerName} ({selectedEnquiry.phone})</p>
                <p className="text-emerald-800 font-medium">{selectedEnquiry.productOrService}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assign Responsible Staff Technician:</label>
                <select
                  value={assignedStaffId}
                  onChange={e => setAssignedStaffId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                >
                  <option value="">-- Unassigned (General Pool) --</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.role.toUpperCase()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status:</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress (Site Inspection / Quote Sent)</option>
                  <option value="converted">Converted to Closed Sale</option>
                  <option value="closed">Closed / Not Interested</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Follow-up Notes / Instructions:</label>
                <textarea
                  rows={3}
                  value={followUpNotes}
                  onChange={e => setFollowUpNotes(e.target.value)}
                  placeholder="Notes for staff or quotation details..."
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
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  {isUpdating ? 'Saving...' : 'Save Lead Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
