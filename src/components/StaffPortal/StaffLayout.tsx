import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Product, Customer, Sale, CustomerEnquiry, StaffAnalytics } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Clock,
  FileText,
  LogOut,
  Globe,
  Receipt,
  Bell,
  CheckCircle2
} from 'lucide-react';

import { StaffDashboardOverview } from './StaffDashboardOverview.tsx';
import { SalesTerminal } from './SalesTerminal.tsx';
import { StaffInventoryView } from './StaffInventoryView.tsx';
import { StaffCustomerDirectory } from './StaffCustomerDirectory.tsx';
import { StaffEnquiriesView } from './StaffEnquiriesView.tsx';
import { StaffSalesReport } from './StaffSalesReport.tsx';

interface StaffLayoutProps {
  products: Product[];
  customers: Customer[];
  onOpenReceipt: (sale: Sale) => void;
  onNavigateToPublic: () => void;
  onRefreshData: () => void;
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({
  products,
  customers,
  onOpenReceipt,
  onNavigateToPublic,
  onRefreshData
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pos' | 'inventory' | 'customers' | 'enquiries' | 'reports'>('dashboard');
  const [analytics, setAnalytics] = useState<StaffAnalytics | null>(null);
  const [staffSales, setStaffSales] = useState<Sale[]>([]);
  const [staffEnquiries, setStaffEnquiries] = useState<CustomerEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadStaffData = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, salesData, enquiriesData] = await Promise.all([
        api.getAnalytics() as Promise<StaffAnalytics>,
        api.getSales(),
        api.getEnquiries()
      ]);
      setAnalytics(analyticsData);
      setStaffSales(salesData);
      setStaffEnquiries(enquiriesData);
    } catch (err) {
      console.error('Failed to load staff portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData();
  }, []);

  const handleSaleCompleted = (sale: Sale) => {
    loadStaffData();
    onRefreshData();
    onOpenReceipt(sale);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Staff Portal Top Header */}
      <div className="bg-emerald-950 text-white px-4 sm:px-6 lg:px-8 py-3.5 border-b border-emerald-900 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Bazaz Solar Energy Logo"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border border-emerald-500/70 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm font-serif">BAZAZ SOLAR</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-amber-300 uppercase">
                  Staff Sales Desk
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Staff: <strong className="text-white">{user?.fullName}</strong> ({user?.phone})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <button
              onClick={() => setActiveTab('pos')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>New POS Sale</span>
            </button>

            <button
              onClick={onNavigateToPublic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            <button
              onClick={logout}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-900/60 text-slate-300 hover:text-white transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Staff Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-emerald-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'pos'
                ? 'bg-emerald-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>POS Sales Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-emerald-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Live Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'customers'
                ? 'bg-emerald-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'enquiries'
                ? 'bg-emerald-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Assigned Enquiries ({staffEnquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'reports'
                ? 'bg-emerald-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Daily Sales Reports</span>
          </button>
        </div>
      </div>

      {/* Main Staff Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <StaffDashboardOverview
            staffName={user?.fullName || 'Staff Member'}
            analytics={analytics}
            recentSales={staffSales}
            pendingEnquiries={staffEnquiries.filter(e => e.status === 'pending')}
            onNavigateTab={tab => setActiveTab(tab as any)}
            onOpenReceipt={onOpenReceipt}
          />
        )}

        {activeTab === 'pos' && (
          <SalesTerminal
            products={products}
            customers={customers}
            onSaleCompleted={handleSaleCompleted}
            onRefreshData={() => {
              loadStaffData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'inventory' && (
          <StaffInventoryView
            products={products}
            onStartSaleForProduct={prod => {
              setActiveTab('pos');
            }}
          />
        )}

        {activeTab === 'customers' && (
          <StaffCustomerDirectory
            customers={customers}
            onRefreshData={() => {
              loadStaffData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'enquiries' && (
          <StaffEnquiriesView
            enquiries={staffEnquiries}
            onRefreshData={() => {
              loadStaffData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'reports' && (
          <StaffSalesReport
            sales={staffSales}
            staffName={user?.fullName || 'Staff'}
            onOpenReceipt={onOpenReceipt}
          />
        )}
      </main>
    </div>
  );
};
