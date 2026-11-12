import React from 'react';
import { StaffAnalytics, Sale, CustomerEnquiry } from '../../types/index.ts';
import {
  TrendingUp,
  CreditCard,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Receipt,
  UserPlus,
  Search,
  ArrowRight
} from 'lucide-react';

interface StaffDashboardOverviewProps {
  staffName: string;
  analytics: StaffAnalytics | null;
  recentSales: Sale[];
  pendingEnquiries: CustomerEnquiry[];
  onNavigateTab: (tabId: string) => void;
  onOpenReceipt: (sale: Sale) => void;
}

export const StaffDashboardOverview: React.FC<StaffDashboardOverviewProps> = ({
  staffName,
  analytics,
  recentSales,
  pendingEnquiries,
  onNavigateTab,
  onOpenReceipt
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
            Staff Operations Portal • Bazaz Plaza, Zaria
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Welcome back, {staffName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            You are ready to record customer transactions, check live inventory, and follow up on website quotations.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('pos')}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20 flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Receipt className="w-4 h-4" />
          <span>Open POS Counter</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Your Sales Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            ₦{(analytics?.todayRevenue || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            {analytics?.todayTransactions || 0} transaction(s) recorded today
          </span>
        </div>

        {/* Total Career Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Career Sales Volume</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            ₦{(analytics?.totalRevenue || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Across {analytics?.totalTransactions || 0} customer orders
          </span>
        </div>

        {/* Inventory Stock Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Products</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {analytics?.availableProductsCount || 0}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Inverters, panels, batteries & cables
          </span>
        </div>

        {/* Low Stock Warnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-600 block">
            {analytics?.lowStockAlertsCount || 0}
          </span>
          <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
            Requires restocking soon
          </span>
        </div>
      </div>

      {/* Two Column Section: Recent Sales & Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Personal Sales */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-800" />
              <h3 className="font-extrabold text-slate-900 text-sm">Your Recent Transactions</h3>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentSales.slice(0, 5).map(sale => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/60 transition text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900">{sale.transactionRef}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 font-semibold mt-0.5">{sale.customerName}</p>
                  <p className="text-[11px] text-slate-400">
                    {sale.items.length} item(s) • Method: {sale.paymentMethod}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className="font-black text-emerald-900 block text-sm">
                    ₦{sale.totalAmount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => onOpenReceipt(sale)}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            ))}

            {recentSales.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No transactions recorded yet in this session.
              </div>
            )}
          </div>
        </div>

        {/* Pending Customer Inquiries from Website */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">Customer Enquiries</h3>
            </div>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold"
            >
              See All ({pendingEnquiries.length})
            </button>
          </div>

          <div className="space-y-3">
            {pendingEnquiries.slice(0, 4).map(enq => (
              <div
                key={enq.id}
                className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{enq.customerName}</span>
                  <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                    {enq.preferredContact}
                  </span>
                </div>
                <p className="font-semibold text-emerald-900 line-clamp-1">{enq.productOrService}</p>
                <p className="text-slate-500 line-clamp-2 text-[11px]">{enq.message}</p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <a
                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Chat on WhatsApp ({enq.phone})
                  </a>
                  <button
                    onClick={() => onNavigateTab('enquiries')}
                    className="font-bold text-slate-700 hover:text-slate-900"
                  >
                    Respond
                  </button>
                </div>
              </div>
            ))}

            {pendingEnquiries.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No pending customer enquiries assigned to you right now.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
