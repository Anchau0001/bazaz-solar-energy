export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  refNumber: string;
  name: string;
  slug: string;
  categoryId: string;
  brand: string;
  description: string;
  technicalSpecs: Record<string, string>;
  purchasePrice?: number; // Only returned to admins
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  isPublic: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'sale_deduct' | 'adjustment' | 'return';
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  supplierId?: string;
  performedByUserId: string;
  performedByName: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  customerType: 'retail' | 'installer' | 'corporate';
  outstandingBalance: number;
  totalPurchases: number;
  assignedStaffId?: string;
  notes?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  productRef: string;
  unitPrice: number;
  unitCost?: number;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  transactionRef: string;
  date: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  staffId: string;
  staffName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'POS' | 'Split Payment';
  paymentStatus: 'completed' | 'partial' | 'refunded' | 'cancelled';
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  createdAt: string;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: string;
}

export interface CustomerEnquiry {
  id: string;
  enquiryRef: string;
  customerName: string;
  phone: string;
  email?: string;
  productOrService: string;
  category?: string;
  quantity?: number;
  message: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
  status: 'pending' | 'assigned' | 'in_progress' | 'converted' | 'closed';
  assignedStaffId?: string;
  assignedStaffName?: string;
  followUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  quoteRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  systemCapacity: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted_to_sale';
  createdByStaffId: string;
  createdByStaffName: string;
  validUntil: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  expenseRef: string;
  title: string;
  category: 'Rent & Plaza Service' | 'Transport & Logistics' | 'Utilities & Generator Fuel' | 'Staff Allowance' | 'Tools & Safety Equipment' | 'Marketing' | 'Other';
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'POS';
  paidTo: string;
  recordedByUserId: string;
  recordedByName: string;
  date: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  productsSupplied: string;
  balanceOwed: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'staff';
  actionType: string;
  description: string;
  details?: Record<string, any>;
}

export interface BusinessSettings {
  companyName: string;
  tradingName: string;
  address: string;
  phones: string[];
  whatsapp: string;
  email: string;
  website: string;
  currencySymbol: string;
  currencyCode: string;
  taxRatePercent: number;
  receiptHeaderMessage: string;
  receiptFooterMessage: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  }[];
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalCogs: number;
  grossProfit: number;
  totalOperatingExpenses: number;
  netProfit: number;
  totalTransactions: number;
  totalUnitsSold: number;
  stockValuation: number;
  retailStockValuation: number;
  paymentMethods: Record<string, number>;
  staffPerformance: { staffName: string; totalRevenue: number; transactionCount: number }[];
  lowStockProductsCount: number;
  outOfStockProductsCount: number;
  totalProductsCount: number;
  totalCustomersCount: number;
  pendingEnquiriesCount: number;
}

export interface StaffAnalytics {
  role: 'staff';
  staffName: string;
  todayRevenue: number;
  todayTransactions: number;
  totalRevenue: number;
  totalTransactions: number;
  assignedPendingEnquiries: number;
  availableProductsCount: number;
  lowStockAlertsCount: number;
}
