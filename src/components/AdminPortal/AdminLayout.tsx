import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Product, Category, Customer, Sale, CustomerEnquiry, AdminAnalytics, User, BusinessSettings } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  LayoutDashboard,
  Package,
  Layers,
  Receipt,
  Users,
  DollarSign,
  Clock,
  ShieldAlert,
  Settings,
  LogOut,
  Globe,
  Plus
} from 'lucide-react';

import { AdminDashboardOverview } from './AdminDashboardOverview.tsx';
import { AdminProductManagement } from './AdminProductManagement.tsx';
import { AdminInventoryManagement } from './AdminInventoryManagement.tsx';
import { AdminSalesMonitoring } from './AdminSalesMonitoring.tsx';
import { AdminStaffManagement } from './AdminStaffManagement.tsx';
import { AdminFinancialManagement } from './AdminFinancialManagement.tsx';
import { AdminEnquiriesManager } from './AdminEnquiriesManager.tsx';
import { AdminActivityAuditLogs } from './AdminActivityAuditLogs.tsx';
import { AdminBusinessSettings } from './AdminBusinessSettings.tsx';

interface AdminLayoutProps {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  settings: BusinessSettings;
  onOpenReceipt: (sale: Sale) => void;
  onNavigateToPublic: () => void;
  onRefreshData: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  products,
  categories,
  customers,
  settings,
  onOpenReceipt,
  onNavigateToPublic,
  onRefreshData
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'sales' | 'staff' | 'financials' | 'enquiries' | 'logs' | 'settings'>('dashboard');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, salesData, staffData, enquiriesData] = await Promise.all([
        api.getAnalytics() as Promise<AdminAnalytics>,
        api.getSales(),
        api.getStaffList(),
        api.getEnquiries()
      ]);
      setAnalytics(analyticsData);
      setSales(salesData);
      setStaffList(staffData);
      setEnquiries(enquiriesData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-3.5 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Bazaz Solar Energy Logo"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border border-purple-500/70 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm font-serif">BAZAZ SOLAR</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 uppercase">
                  Administrator Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in: <strong className="text-white">{user?.fullName}</strong> (Super Administrator)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
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

      {/* Admin Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Inventory Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'sales'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Sales & Voids</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'financials'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financials & COGS</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'staff'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Management</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'enquiries'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'logs'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <AdminDashboardOverview
            analytics={analytics}
            recentSales={sales}
            pendingEnquiries={enquiries.filter(e => e.status === 'pending')}
            onNavigateTab={tab => setActiveTab(tab as any)}
            onOpenReceipt={onOpenReceipt}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductManagement
            products={products}
            categories={categories}
            onRefreshData={() => {
              loadAdminData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'inventory' && (
          <AdminInventoryManagement
            products={products}
            onRefreshData={() => {
              loadAdminData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'sales' && (
          <AdminSalesMonitoring
            sales={sales}
            staffList={staffList}
            onOpenReceipt={onOpenReceipt}
            onRefreshData={() => {
              loadAdminData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'financials' && (
          <AdminFinancialManagement
            analytics={analytics}
            onRefreshData={() => {
              loadAdminData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'staff' && (
          <AdminStaffManagement
            staffList={staffList}
            onRefreshData={() => {
              loadAdminData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'enquiries' && (
          <AdminEnquiriesManager
            enquiries={enquiries}
            staffList={staffList}
            onRefreshData={() => {
              loadAdminData();
              onRefreshData();
            }}
          />
        )}

        {activeTab === 'logs' && (
          <AdminActivityAuditLogs />
        )}

        {activeTab === 'settings' && (
          <AdminBusinessSettings
            settings={settings}
            onRefreshData={() => {
              loadAdminData();
              onRefreshData();
            }}
          />
        )}
      </main>
    </div>
  );
};
