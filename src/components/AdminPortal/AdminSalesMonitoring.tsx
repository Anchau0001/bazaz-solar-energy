import React, { useState } from 'react';
import { Sale, User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X
} from 'lucide-react';

interface AdminSalesMonitoringProps {
  sales: Sale[];
  staffList: User[];
  onOpenReceipt: (sale: Sale) => void;
  onRefreshData: () => void;
}

export const AdminSalesMonitoring: React.FC<AdminSalesMonitoringProps> = ({
  sales,
  staffList,
  onOpenReceipt,
  onRefreshData
}) => {
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [saleToVoid, setSaleToVoid] = useState<Sale | null>(null);
  const [voidReason, setVoidReason] = useState('');
  const [isVoiding, setIsVoiding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filtered = sales.filter(s => {
    if (selectedStaff !== 'all' && s.staffId !== selectedStaff) return false;
    if (selectedMethod !== 'all' && s.paymentMethod !== selectedMethod) return false;
    if (selectedStatus !== 'all' && s.paymentStatus !== selectedStatus) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.transactionRef.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      s.staffName.toLowerCase().includes(q) ||
      s.items.some(i => i.productName.toLowerCase().includes(q))
    );
  });

  const totalFilteredRevenue = filtered
    .filter(s => s.paymentStatus !== 'cancelled')
    .reduce((acc, s) => acc + s.totalAmount, 0);

  const handleConfirmVoid = async () => {
    if (!saleToVoid || !voidReason.trim()) {
      setErrorMsg('Please specify an audit reason for voiding this transaction.');
      return;
    }

    setIsVoiding(true);
    try {
      await api.voidSale(saleToVoid.id, voidReason.trim());
      setSaleToVoid(null);
      setVoidReason('');
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to void transaction');
    } finally {
      setIsVoiding(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Ref', 'Date', 'Customer', 'Phone', 'Staff', 'Method', 'Status', 'Total (NGN)'];
    const rows = filtered.map(s => [
      s.transactionRef,
      new Date(s.date).toLocaleString('en-GB'),
      s.customerName,
      s.customerPhone,
      s.staffName,
      s.paymentMethod,
      s.paymentStatus,
      s.totalAmount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Bazaz-Storewide-Sales-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Comprehensive Sales Monitoring & Audit</h3>
          <p className="text-xs text-slate-500">
            Monitor all staff transactions, handle reversals/corrections, and audit revenue streams
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export All to CSV</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ref, customer, or staff..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedStaff}
          onChange={e => setSelectedStaff(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
        >
          <option value="all">All Staff Members</option>
          {staffList.map(s => (
            <option key={s.id} value={s.id}>{s.fullName} ({s.role.toUpperCase()})</option>
          ))}
        </select>

        <select
          value={selectedMethod}
          onChange={e => setSelectedMethod(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
        >
          <option value="all">All Payment Channels</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="POS">POS Terminal</option>
          <option value="Split Payment">Split Payment</option>
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled / Voided</option>
        </select>
      </div>

      {/* Summary Highlight */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
        <span className="font-bold text-emerald-950">
          Showing {filtered.length} transaction(s)
        </span>
        <span className="font-black text-emerald-950 text-sm">
          Filtered Net Revenue: ₦{totalFilteredRevenue.toLocaleString()}
        </span>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px]">
              <th className="p-3">Ref Code</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Staff</th>
              <th className="p-3">Channel</th>
              <th className="p-3 text-right">Amount (₦)</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(s => {
              const isCancelled = s.paymentStatus === 'cancelled';
              return (
                <tr key={s.id} className={`hover:bg-slate-50/70 transition ${isCancelled ? 'opacity-50 line-through bg-rose-50/20' : ''}`}>
                  <td className="p-3 font-mono font-bold text-slate-900">{s.transactionRef}</td>
                  <td className="p-3 text-slate-500">{new Date(s.date).toLocaleString('en-GB')}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{s.customerName}</span>
                    <span className="text-[11px] text-slate-400">{s.customerPhone}</span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-900">{s.staffName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 text-right font-black text-slate-900 text-sm">
                    ₦{s.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {isCancelled ? (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold uppercase">
                        Voided
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenReceipt(s)}
                        className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold"
                        title="View Official Receipt"
                      >
                        Receipt
                      </button>
                      {!isCancelled && (
                        <button
                          onClick={() => {
                            setSaleToVoid(s);
                            setVoidReason('');
                            setErrorMsg('');
                          }}
                          className="px-2 py-1 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-[11px] font-bold"
                          title="Void / Cancel Transaction & Restore Stock"
                        >
                          Void
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Void Confirmation Modal */}
      {saleToVoid && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-rose-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-sm">Void Transaction & Restore Inventory</h4>
              </div>
              <button onClick={() => setSaleToVoid(null)} className="text-rose-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-1">
                <p><strong>Transaction:</strong> {saleToVoid.transactionRef}</p>
                <p><strong>Customer:</strong> {saleToVoid.customerName}</p>
                <p><strong>Total Amount:</strong> ₦{saleToVoid.totalAmount.toLocaleString()}</p>
                <p className="text-[11px] text-rose-700 pt-1 font-semibold">
                  ⚠️ Voiding this sale will automatically restore all deducted stock back into the warehouse inventory.
                </p>
              </div>

              {errorMsg && <p className="text-rose-600 font-bold">{errorMsg}</p>}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mandatory Audit Reason for Reversal *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Customer requested immediate order cancellation before dispatch; or mistaken barcode entry..."
                  value={voidReason}
                  onChange={e => setVoidReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSaleToVoid(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVoid}
                  disabled={isVoiding}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
                >
                  {isVoiding ? 'Processing Reversal...' : 'Confirm Void & Restore Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
