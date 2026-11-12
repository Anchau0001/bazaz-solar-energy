import {
  User,
  Product,
  Category,
  Sale,
  Customer,
  CustomerEnquiry,
  Quotation,
  Expense,
  Supplier,
  ActivityLog,
  BusinessSettings,
  AdminAnalytics,
  StaffAnalytics,
  StockMovement
} from '../types/index.ts';

const TOKEN_KEY = 'bazaz_auth_token';

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clearToken: (): void => localStorage.removeItem(TOKEN_KEY)
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg = data?.error || (typeof data === 'string' ? data : 'An unexpected error occurred.');
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Public
  getSettings: () => request<BusinessSettings>('/api/settings'),
  getPublicStats: () => request<{
    totalProducts: number;
    activeInstallations: number;
    servedClients: number;
    solarCapacityInstalledMW: number;
    businessYears: number;
  }>('/api/stats/public'),

  // Auth
  login: async (username: string, password: string) => {
    const res = await request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    authStorage.setToken(res.token);
    return res;
  },
  getMe: () => request<{ user: User }>('/api/auth/me'),
  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      authStorage.clearToken();
    }
  },
  forgotPassword: (email: string) => request<{
    success: boolean;
    message: string;
    email: string;
    fullName: string;
    otpCode: string;
    token: string;
    resetLink: string;
    expiresInMinutes: number;
  }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  verifyOtp: (payload: { email?: string; otpCode: string }) => request<{
    success: boolean;
    message: string;
    token: string;
    email?: string;
  }>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  resetPassword: (payload: { token: string; newPassword: string }) => request<{
    success: boolean;
    message: string;
    username: string;
  }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Categories & Products
  getCategories: () => request<Category[]>('/api/categories'),
  getProducts: (params?: { categoryId?: string; brand?: string; search?: string; isPublicOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.brand) query.append('brand', params.brand);
    if (params?.search) query.append('search', params.search);
    if (params?.isPublicOnly) query.append('isPublicOnly', 'true');
    return request<Product[]>(`/api/products?${query.toString()}`);
  },
  getProductById: (id: string) => request<Product>(`/api/products/${id}`),
  createProduct: (productData: any) => request<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  updateProduct: (id: string, updates: any) => request<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),
  deleteProduct: (id: string) => request<{ message: string }>(`/api/products/${id}`, {
    method: 'DELETE'
  }),

  // Inventory
  getInventoryMovements: (productId?: string) => {
    const query = productId ? `?productId=${encodeURIComponent(productId)}` : '';
    return request<StockMovement[]>(`/api/inventory/movements${query}`);
  },
  adjustStock: (payload: { productId: string; quantityChange: number; reason: string; type?: string; supplierId?: string }) =>
    request<{ product: Product; movement: StockMovement }>('/api/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Sales
  getSales: (filter?: { startDate?: string; endDate?: string; paymentMethod?: string; paymentStatus?: string }) => {
    const query = new URLSearchParams();
    if (filter?.startDate) query.append('startDate', filter.startDate);
    if (filter?.endDate) query.append('endDate', filter.endDate);
    if (filter?.paymentMethod) query.append('paymentMethod', filter.paymentMethod);
    if (filter?.paymentStatus) query.append('paymentStatus', filter.paymentStatus);
    return request<Sale[]>(`/api/sales?${query.toString()}`);
  },
  getSaleById: (id: string) => request<Sale>(`/api/sales/${id}`),
  recordSale: (saleInput: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    items: { productId: string; quantity: number; unitPrice?: number }[];
    discount: number;
    paymentMethod: string;
    notes?: string;
  }) => request<Sale>('/api/sales', {
    method: 'POST',
    body: JSON.stringify(saleInput)
  }),
  voidSale: (saleId: string, reason: string) => request<{ message: string; sale: Sale }>(`/api/sales/${saleId}/void`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),

  // Customers
  getCustomers: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Customer[]>(`/api/customers${query}`);
  },
  createCustomer: (customer: any) => request<Customer>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(customer)
  }),
  updateCustomer: (id: string, updates: any) => request<Customer>(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  // Enquiries
  submitPublicEnquiry: (enquiry: {
    customerName: string;
    phone: string;
    email?: string;
    productOrService: string;
    category?: string;
    quantity?: number;
    message: string;
    preferredContact?: string;
  }) => request<{ message: string; enquiryRef: string; enquiry: CustomerEnquiry }>('/api/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiry)
  }),
  getEnquiries: (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<CustomerEnquiry[]>(`/api/enquiries${query}`);
  },
  updateEnquiry: (id: string, updates: any) => request<CustomerEnquiry>(`/api/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  // Quotations
  getQuotations: () => request<Quotation[]>('/api/quotations'),
  createQuotation: (quote: any) => request<Quotation>('/api/quotations', {
    method: 'POST',
    body: JSON.stringify(quote)
  }),

  // Financials & Admin
  getExpenses: () => request<Expense[]>('/api/expenses'),
  createExpense: (expense: any) => request<Expense>('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expense)
  }),
  getSuppliers: () => request<Supplier[]>('/api/suppliers'),
  createSupplier: (supplier: any) => request<Supplier>('/api/suppliers', {
    method: 'POST',
    body: JSON.stringify(supplier)
  }),
  getStaffList: () => request<User[]>('/api/staff'),
  createStaff: (staffData: any) => request<User>('/api/staff', {
    method: 'POST',
    body: JSON.stringify(staffData)
  }),
  updateStaff: (id: string, updates: any) => request<User>(`/api/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),
  getActivityLogs: (limit = 100) => request<ActivityLog[]>(`/api/logs?limit=${limit}`),
  getAnalytics: () => request<AdminAnalytics | StaffAnalytics>('/api/analytics'),
  updateSettings: (settings: Partial<BusinessSettings>) => request<BusinessSettings>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  })
};
