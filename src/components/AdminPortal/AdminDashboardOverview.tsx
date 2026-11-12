import React from 'react';
import { AdminAnalytics, Sale, CustomerEnquiry } from '../../types/index.ts';
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  Users,
  ShieldCheck,
  CreditCard,
  Building,
  ArrowUpRight,
  Receipt,
  Clock,
  PieChart,
  BarChart3
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  analytics: AdminAnalytics | null;
  recentSales: Sale[];
  pendingEnquiries: CustomerEnquiry[];
  onNavigateTab: (tabId: string) => void;
  onOpenReceipt: (sale: Sale) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  analytics,
  recentSales,
  pendingEnquiries,
  onNavigateTab,
  onOpenReceipt
}) => {
  return (
    <div className="space-y-6">
      {/* Executive Welcome & Business Health Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Business Control Center • Zaria, Kaduna State</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Bazaz Solar Business Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time financial status, inventory asset valuation, staff sales metrics, and customer pipeline monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20"
          >
            Manage Products
          </button>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20"
          >
            Inventory Intake
          </button>
          <button
            onClick={() => onNavigateTab('financials')}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20"
          >
            Financial Audit
          </button>
        </div>
      </div>

      {/* Primary Financial & Stock Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            ₦{(analytics?.totalRevenue || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Across {analytics?.totalTransactions || 0} completed transactions
          </span>
        </div>

        {/* Gross Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Trading Profit</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-950 block">
            ₦{(analytics?.grossProfit || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            After COGS deduction (₦{(analytics?.totalCogs || 0).toLocaleString()})
          </span>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Net Profit</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <span className={`text-2xl font-black block ${
            (analytics?.netProfit || 0) >= 0 ? 'text-emerald-900' : 'text-rose-600'
          }`}>
            ₦{(analytics?.netProfit || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Operating Expenses: ₦{(analytics?.totalOperatingExpenses || 0).toLocaleString()}
          </span>
        </div>

        {/* Stock Valuation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Asset Value</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            ₦{(analytics?.stockValuation || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
            Retail Value: ₦{(analytics?.retailStockValuation || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Secondary Status Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">Total Products</span>
          <span className="text-xl font-bold text-slate-900">{analytics?.totalProductsCount || 0}</span>
          <span className="text-[10px] text-slate-400 block">In 9 Categories</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">Low Stock Alerts</span>
          <span className="text-xl font-bold text-amber-600">{analytics?.lowStockProductsCount || 0}</span>
          <span className="text-[10px] text-amber-500 block">At or below minimum threshold</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">Total Customers</span>
          <span className="text-xl font-bold text-slate-900">{analytics?.totalCustomersCount || 0}</span>
          <span className="text-[10px] text-slate-400 block">Retail, Corporate & Installers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">Pending Inquiries</span>
          <span className="text-xl font-bold text-emerald-800">{analytics?.pendingEnquiriesCount || 0}</span>
          <span className="text-[10px] text-emerald-600 block">Leads awaiting follow-up</span>
        </div>
      </div>

      {/* Charts & Analytical Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-800" />
              <h3 className="font-extrabold text-slate-900 text-sm">Payment Methods Distribution</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">All Time</span>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.paymentMethods && Object.entries(analytics.paymentMethods).map(([method, amount]) => {
              const totalRev = analytics.totalRevenue || 1;
              const percentage = Math.round((amount / totalRev) * 100);
              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">{method}</span>
                    <span className="font-black text-slate-900">
                      ₦{amount.toLocaleString()} <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        method === 'Bank Transfer' ? 'bg-emerald-600' : method === 'POS' ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Sales Performance Leaderboard */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">Staff Sales Performance Leaderboard</h3>
            </div>
            <button
              onClick={() => onNavigateTab('staff')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>Manage Staff</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {analytics?.staffPerformance && analytics.staffPerformance.map((sp, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{sp.staffName}</h4>
                    <p className="text-[11px] text-slate-500">{sp.transactionCount} transaction(s) recorded</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-950 text-sm">
                    ₦{sp.totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Total Sales</span>
                </div>
              </div>
            ))}

            {(!analytics?.staffPerformance || analytics.staffPerformance.length === 0) && (
              <div className="text-center py-6 text-slate-400 text-xs">
                No staff sales records found yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Business Transactions Across All Staff */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-800" />
            <h3 className="font-extrabold text-slate-900 text-sm">Recent Storewide Sales Transactions</h3>
          </div>
          <button
            onClick={() => onNavigateTab('sales')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Complete Sales Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px]">
                <th className="p-3">Ref</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Responsible Staff</th>
                <th className="p-3">Payment</th>
                <th className="p-3 text-right">Amount (₦)</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.slice(0, 5).map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-mono font-bold text-slate-900">{sale.transactionRef}</td>
                  <td className="p-3 text-slate-500">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold text-slate-800">{sale.customerName}</td>
                  <td className="p-3 font-bold text-emerald-800">{sale.staffName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 text-right font-black text-emerald-950 text-sm">
                    ₦{sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenReceipt(sale)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
