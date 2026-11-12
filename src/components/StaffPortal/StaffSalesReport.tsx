import React, { useState } from 'react';
import { Sale } from '../../types/index.ts';
import { Printer, Download, Calendar, Search, Filter, Receipt, TrendingUp, CheckCircle2 } from 'lucide-react';

interface StaffSalesReportProps {
  sales: Sale[];
  staffName: string;
  onOpenReceipt: (sale: Sale) => void;
}

export const StaffSalesReport: React.FC<StaffSalesReportProps> = ({
  sales,
  staffName,
  onOpenReceipt
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [search, setSearch] = useState('');

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  const weekStr = oneWeekAgo.toISOString();

  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(now.getDate() - 30);
  const monthStr = oneMonthAgo.toISOString();

  const filteredSales = sales.filter(s => {
    if (s.paymentStatus === 'cancelled') return false;

    if (filterPeriod === 'today') {
      if (!s.date.startsWith(todayStr)) return false;
    } else if (filterPeriod === 'week') {
      if (s.date < weekStr) return false;
    } else if (filterPeriod === 'month') {
      if (s.date < monthStr) return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.transactionRef.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.paymentMethod.toLowerCase().includes(q) ||
        s.items.some(i => i.productName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalUnits = filteredSales.reduce((acc, s) => acc + s.items.reduce((sum, item) => sum + item.quantity, 0), 0);

  const paymentBreakdown: Record<string, number> = {};
  filteredSales.forEach(s => {
    paymentBreakdown[s.paymentMethod] = (paymentBreakdown[s.paymentMethod] || 0) + s.totalAmount;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction Ref', 'Date', 'Customer Name', 'Customer Phone', 'Payment Method', 'Items Count', 'Total Amount (NGN)'];
    const rows = filteredSales.map(s => [
      s.transactionRef,
      new Date(s.date).toLocaleString('en-GB'),
      s.customerName,
      s.customerPhone,
      s.paymentMethod,
      s.items.length,
      s.totalAmount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bazaz-Staff-Sales-${filterPeriod}-${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 no-print">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Daily & Period Sales Reports</h3>
          <p className="text-xs text-slate-500">
            Shift accounting, transactions breakdown, and reconciliation for {staffName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          {(['today', 'week', 'month', 'all'] as const).map(period => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1.5 rounded-lg font-bold transition capitalize ${
                filterPeriod === period
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period === 'today' ? 'Today (Shift)' : period === 'week' ? 'Last 7 Days' : period === 'month' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Printable Report Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <span className="text-slate-500 text-xs font-semibold block">Total Revenue Recorded</span>
          <span className="text-2xl font-black text-emerald-950 block mt-1">₦{totalRevenue.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-700 font-medium">Period: {filterPeriod.toUpperCase()}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-xs font-semibold block">Total Transactions Completed</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">{filteredSales.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Receipts Issued</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <span className="text-slate-500 text-xs font-semibold block">Total Equipment Units Sold</span>
          <span className="text-2xl font-black text-amber-950 block mt-1">{totalUnits}</span>
          <span className="text-[11px] text-amber-700 font-medium">Batteries, Inverters, Panels, etc.</span>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs flex flex-wrap items-center gap-6">
        <span className="font-bold text-slate-700">Payment Breakdown:</span>
        {Object.entries(paymentBreakdown).map(([method, amount]) => (
          <div key={method} className="flex items-center gap-1.5">
            <span className="text-slate-500">{method}:</span>
            <span className="font-bold text-slate-900">₦{amount.toLocaleString()}</span>
          </div>
        ))}
        {Object.keys(paymentBreakdown).length === 0 && (
          <span className="text-slate-400">No payment data for this period</span>
        )}
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px]">
              <th className="p-3">Ref Number</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items Sold</th>
              <th className="p-3">Payment</th>
              <th className="p-3 text-right">Amount (₦)</th>
              <th className="p-3 text-right no-print">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSales.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/70 transition">
                <td className="p-3 font-mono font-bold text-slate-900">{s.transactionRef}</td>
                <td className="p-3 text-slate-500">{new Date(s.date).toLocaleString('en-GB')}</td>
                <td className="p-3">
                  <span className="font-bold text-slate-900 block">{s.customerName}</span>
                  <span className="text-[11px] text-slate-400">{s.customerPhone}</span>
                </td>
                <td className="p-3 text-slate-600">
                  {s.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[11px]">
                    {s.paymentMethod}
                  </span>
                </td>
                <td className="p-3 text-right font-black text-emerald-950 text-sm">
                  ₦{s.totalAmount.toLocaleString()}
                </td>
                <td className="p-3 text-right no-print">
                  <button
                    onClick={() => onOpenReceipt(s)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 transition"
                    title="View & Print Official Receipt"
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSales.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No transactions found for the selected time filter.
          </div>
        )}
      </div>
    </div>
  );
};
