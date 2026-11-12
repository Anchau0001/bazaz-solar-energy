import React, { useState, useEffect } from 'react';
import { Expense } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Plus,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  X,
  CreditCard
} from 'lucide-react';

interface AdminFinancialManagementProps {
  analytics: any;
  onRefreshData: () => void;
}

export const AdminFinancialManagement: React.FC<AdminFinancialManagementProps> = ({
  analytics,
  onRefreshData
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Rent & Plaza Service');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'POS'>('Bank Transfer');
  const [paidTo, setPaidTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadExpenses = async () => {
    try {
      const data = await api.getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!title.trim() || amount <= 0) {
      setErrorMsg('Please specify expense title and an amount greater than zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createExpense({
        title,
        category,
        amount: Number(amount),
        paymentMethod,
        paidTo: paidTo || 'N/A',
        date,
        notes: notes.trim() || undefined
      });
      setShowExpenseModal(false);
      setTitle('');
      setAmount(0);
      setPaidTo('');
      setNotes('');
      loadExpenses();
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = analytics?.totalRevenue || 0;
  const totalCogs = analytics?.totalCogs || 0;
  const grossProfit = analytics?.grossProfit || (totalRevenue - totalCogs);
  const totalOperatingExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = grossProfit - totalOperatingExpenses;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Financial Audit & Profitability Analysis</h3>
          <p className="text-xs text-slate-500">
            Reconcile revenue, cost of inventory sold (COGS), operating overheads, and net margins
          </p>
        </div>

        <button
          onClick={() => setShowExpenseModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Record Business Expense</span>
        </button>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Turnover / Revenue</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">₦{totalRevenue.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">Total Customer Inflow</span>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
          <span className="text-xs text-amber-800 font-bold uppercase">Cost of Goods Sold (COGS)</span>
          <span className="text-2xl font-black text-amber-950 block mt-1">₦{totalCogs.toLocaleString()}</span>
          <span className="text-[11px] text-amber-700">Wholesale equipment costs</span>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200">
          <span className="text-xs text-rose-800 font-bold uppercase">Operating Overheads</span>
          <span className="text-2xl font-black text-rose-950 block mt-1">₦{totalOperatingExpenses.toLocaleString()}</span>
          <span className="text-[11px] text-rose-700">{expenses.length} expense entry(ies)</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs text-emerald-800 font-bold uppercase">Net Business Profit</span>
          <span className={`text-2xl font-black block mt-1 ${netProfit >= 0 ? 'text-emerald-950' : 'text-rose-600'}`}>
            ₦{netProfit.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-700">Actual Retained Earnings</span>
        </div>
      </div>

      {/* Operating Expenses Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm">Operating Expenses Log</h4>
          <span className="text-xs text-slate-500">Rent, logistics, generator fuel, and shop upkeep</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px]">
                <th className="p-3">Ref</th>
                <th className="p-3">Date</th>
                <th className="p-3">Title / Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Paid To</th>
                <th className="p-3">Method</th>
                <th className="p-3 text-right">Amount (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-mono font-bold text-slate-600">{e.expenseRef}</td>
                  <td className="p-3 text-slate-500">{e.date}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{e.title}</span>
                    {e.notes && <span className="text-[11px] text-slate-400">{e.notes}</span>}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[11px]">
                      {e.category}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{e.paidTo}</td>
                  <td className="p-3 text-slate-500">{e.paymentMethod}</td>
                  <td className="p-3 text-right font-black text-rose-700">
                    ₦{e.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {expenses.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              No operating expenses logged yet.
            </div>
          )}
        </div>
      </div>

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Record Store Expense</h4>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-6 space-y-3.5 text-xs">
              {errorMsg && <p className="text-rose-600 font-bold">{errorMsg}</p>}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Title / Item *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Generator Diesel for Load Testing Bench"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expense Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="Rent & Plaza Service">Rent & Plaza Service</option>
                    <option value="Transport & Logistics">Transport & Logistics</option>
                    <option value="Utilities & Generator Fuel">Utilities & Fuel</option>
                    <option value="Staff Allowance">Staff Allowance</option>
                    <option value="Tools & Safety Equipment">Tools & Safety</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount (₦) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Paid To *</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient / Vendor name"
                    value={paidTo}
                    onChange={e => setPaidTo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="POS">POS Terminal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Receipt number or plaza committee note..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  {isSubmitting ? 'Recording...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
