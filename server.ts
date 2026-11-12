import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { db, User } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple session token simulation (in-memory token store mapped to User)
const activeSessions: Map<string, { user: User; expiresAt: number }> = new Map();

function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  (req as any).user = session.user;
  next();
}

function requireRole(allowedRoles: ('admin' | 'staff')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as User;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: `Forbidden: Access restricted to ${allowedRoles.join(' or ')} role.` });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Your account is currently inactive. Contact your administrator.' });
    }
    next();
  };
}

// -------------------------------------------------------------
// PUBLIC & SETTINGS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/settings', (_req, res) => {
  res.json(db.getSettings());
});

app.put('/api/settings', authenticate, requireRole(['admin']), (req, res) => {
  const actor = (req as any).user;
  const updated = db.updateSettings(req.body, { userId: actor.id, userName: actor.fullName });
  res.json(updated);
});

app.get('/api/stats/public', (_req, res) => {
  const products = db.getProducts({ isPublicOnly: true });
  const sales = db.getSales();
  const customers = db.getCustomers();

  res.json({
    totalProducts: products.length,
    activeInstallations: 350 + sales.length,
    servedClients: 420 + customers.length,
    solarCapacityInstalledMW: 1.85,
    businessYears: 8
  });
});

// -------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username/Email and Password are required.' });
  }

  const user = db.findUserByUsername(username);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Account has been deactivated. Please contact Comrd. Lawal Anchau or System Administrator.' });
  }

  // Update last login
  db.updateUser(user.id, { lastLogin: new Date().toISOString() });

  // Record login activity
  db.recordActivity({
    userId: user.id,
    userName: user.fullName,
    userRole: user.role,
    actionType: 'AUTH_LOGIN',
    description: `${user.fullName} (${user.role.toUpperCase()}) logged in successfully.`
  });

  const token = `token_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { user, expiresAt });

  // Exclude password in response
  const { passwordHash: _, ...safeUser } = user;
  res.json({
    token,
    user: safeUser
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = (req as any).user as User;
  const freshUser = db.findUserById(user.id);
  if (!freshUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { passwordHash: _, ...safeUser } = freshUser;
  res.json({ user: safeUser });
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1]?.trim();
    if (token) activeSessions.delete(token);
  }
  res.json({ message: 'Logged out successfully.' });
});

// Password reset entry interface
interface PasswordResetRecord {
  userId: string;
  email: string;
  fullName: string;
  otpCode: string;
  token: string;
  expiresAt: number;
}

// Stores reset records indexed by both token and otpCode
const passwordResets: Map<string, PasswordResetRecord> = new Map();

// Helper to attempt dispatching email via nodemailer
async function dispatchResetEmail(recipientEmail: string, recipientName: string, otpCode: string, resetLink: string) {
  try {
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
      });
    }

    await transporter.sendMail({
      from: `"Bazaz Solar Energy & Material" <${process.env.SMTP_FROM || 'security@bazazsolar.ng'}>`,
      to: recipientEmail,
      subject: `[Bazaz Solar] Your Password Reset OTP Code: ${otpCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #064e3b; margin: 0; font-size: 22px;">BAZAZ SOLAR ENERGY</h2>
            <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Shop No. 7, Bazaz Plaza, Nagoyi, Zaria, Kaduna State</p>
          </div>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #166534; font-size: 14px; margin: 0 0 12px 0;">Hello <strong>${recipientName}</strong>,</p>
            <p style="color: #1e293b; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;">You requested a password reset for your staff/administrator access portal. Enter the 6-digit verification OTP code below:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #064e3b; background-color: #ffffff; padding: 12px 28px; border-radius: 10px; border: 2px dashed #059669;">
                ${otpCode}
              </span>
            </div>
            <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">This OTP code is valid for 15 minutes. Never share this code with anyone.</p>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 12px; margin-bottom: 12px;">Or use the direct one-click link below:</p>
            <a href="${resetLink}" style="display: inline-block; background-color: #064e3b; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 24px; border-radius: 10px;">Reset Password Directly</a>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0;">Bazaz Solar Security Desk • Support: 09168655473 | 08130675552</p>
          </div>
        </div>
      `,
      text: `Hello ${recipientName},\n\nYour 6-digit password reset OTP code is: ${otpCode}\n\nDirect link: ${resetLink}\n\nValid for 15 minutes.\nBazaz Solar Energy, Nagoyi, Zaria.`
    });
  } catch (err: any) {
    console.warn('[Email Dispatch Notice] Note: SMTP relay output:', err.message);
  }
}

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Please enter your registered email address or staff username.' });
  }

  const user = db.findUserByEmail(email.trim()) || db.findUserByUsername(email.trim());
  if (!user) {
    return res.status(404).json({
      error: 'No registered staff or administrator account found with that email address. Please contact Comrd. Lawal Anchau.'
    });
  }

  // Generate 6-digit numeric OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Generate secure token
  const token = `rst_${Date.now()}_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  const record: PasswordResetRecord = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    otpCode,
    token,
    expiresAt
  };

  // Store under both token and OTP code
  passwordResets.set(token, record);
  passwordResets.set(otpCode, record);

  db.recordActivity({
    userId: user.id,
    userName: user.fullName,
    userRole: user.role,
    actionType: 'STAFF_MODIFIED',
    description: `Generated 6-digit password reset OTP for ${user.fullName} (${user.email})`
  });

  const appUrl = process.env.APP_URL || '';
  const resetLink = `${appUrl}/?resetToken=${token}`;

  // Attempt background email dispatch
  dispatchResetEmail(user.email, user.fullName, otpCode, resetLink).catch(() => {});

  res.json({
    success: true,
    message: `6-digit OTP verification code sent to your registered email (${user.email}).`,
    email: user.email,
    fullName: user.fullName,
    otpCode,
    token,
    resetLink,
    expiresInMinutes: 15
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otpCode } = req.body;
  if (!otpCode || !otpCode.trim()) {
    return res.status(400).json({ error: 'Please enter the 6-digit OTP verification code.' });
  }

  const code = otpCode.trim();
  const entry = passwordResets.get(code);

  if (!entry || entry.expiresAt < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired OTP code. Please request a new code.' });
  }

  if (email && entry.email.toLowerCase() !== email.toLowerCase().trim()) {
    return res.status(400).json({ error: 'OTP code does not match this email address.' });
  }

  res.json({
    success: true,
    message: 'OTP verified successfully.',
    token: entry.token,
    email: entry.email
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required.' });
  }

  if (newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters long.' });
  }

  const entry = passwordResets.get(token);
  if (!entry || entry.expiresAt < Date.now()) {
    if (entry) passwordResets.delete(token);
    return res.status(400).json({ error: 'This password reset request is invalid or has expired. Please request a new code.' });
  }

  const updatedUser = db.updateUser(entry.userId, { passwordHash: newPassword.trim() });
  passwordResets.delete(entry.token);
  passwordResets.delete(entry.otpCode);

  if (!updatedUser) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  db.recordActivity({
    userId: updatedUser.id,
    userName: updatedUser.fullName,
    userRole: updatedUser.role,
    actionType: 'STAFF_MODIFIED',
    description: `Password reset successfully completed for ${updatedUser.fullName}`
  });

  res.json({
    success: true,
    message: 'Your password has been successfully reset! You can now log in with your new password.',
    username: updatedUser.username
  });
});

// -------------------------------------------------------------
// CATEGORIES & PRODUCTS
// -------------------------------------------------------------
app.get('/api/categories', (_req, res) => {
  res.json(db.getCategories());
});

app.get('/api/products', (req, res) => {
  const { categoryId, brand, search, isPublicOnly } = req.query;
  const products = db.getProducts({
    categoryId: categoryId as string,
    brand: brand as string,
    search: search as string,
    isPublicOnly: isPublicOnly === 'true'
  });

  // Check if requester is authenticated as admin
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1].trim();
    const session = activeSessions.get(token);
    if (session && session.user.role === 'admin') {
      isAdmin = true;
    }
  }

  // Hide purchase price for non-admins to ensure business privacy
  const sanitized = products.map(p => {
    if (isAdmin) return p;
    const { purchasePrice: _, ...rest } = p;
    return rest;
  });

  res.json(sanitized);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1].trim();
    const session = activeSessions.get(token);
    if (session && session.user.role === 'admin') {
      isAdmin = true;
    }
  }

  if (!isAdmin) {
    const { purchasePrice: _, ...safeProd } = product;
    return res.json(safeProd);
  }
  res.json(product);
});

app.post('/api/products', authenticate, requireRole(['admin']), (req, res) => {
  const actor = (req as any).user;
  const { name, categoryId, brand, description, technicalSpecs, purchasePrice, sellingPrice, stockQuantity, minStockLevel, imageUrl, refNumber } = req.body;

  if (!name || !categoryId || !brand || sellingPrice === undefined) {
    return res.status(400).json({ error: 'Name, Category, Brand, and Selling Price are required.' });
  }

  const generatedRef = refNumber || `BSE-PRD-${Math.floor(100 + Math.random() * 900)}`;

  const created = db.createProduct(
    {
      refNumber: generatedRef,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      categoryId,
      brand,
      description: description || '',
      technicalSpecs: technicalSpecs || {},
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice),
      stockQuantity: parseInt(stockQuantity) || 0,
      minStockLevel: parseInt(minStockLevel) || 2,
      isPublic: req.body.isPublic !== undefined ? !!req.body.isPublic : true,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    },
    { userId: actor.id, userName: actor.fullName }
  );

  res.status(201).json(created);
});

app.put('/api/products/:id', authenticate, requireRole(['admin']), (req, res) => {
  const actor = (req as any).user;
  const updated = db.updateProduct(req.params.id, req.body, {
    userId: actor.id,
    userName: actor.fullName,
    userRole: actor.role
  });

  if (!updated) return res.status(404).json({ error: 'Product not found.' });
  res.json(updated);
});

app.delete('/api/products/:id', authenticate, requireRole(['admin']), (req, res) => {
  const actor = (req as any).user;
  const success = db.deleteProduct(req.params.id, { userId: actor.id, userName: actor.fullName });
  if (!success) return res.status(404).json({ error: 'Product not found.' });
  res.json({ message: 'Product deleted successfully.' });
});

// -------------------------------------------------------------
// INVENTORY & STOCK ADJUSTMENTS
// -------------------------------------------------------------
app.get('/api/inventory/movements', authenticate, (req, res) => {
  const { productId } = req.query;
  const movements = db.getInventoryMovements(productId as string);
  res.json(movements);
});

app.post('/api/inventory/adjust', authenticate, requireRole(['admin', 'staff']), (req, res) => {
  const actor = (req as any).user;
  const { productId, quantityChange, reason, type, supplierId } = req.body;

  if (!productId || quantityChange === undefined || !reason) {
    return res.status(400).json({ error: 'Product ID, quantity change, and reason are required.' });
  }

  // Staff can only do stock-in or returns with approval; full adjustments reserved for admin or approved staff
  const result = db.adjustStock({
    productId,
    quantityChange: parseInt(quantityChange),
    reason,
    type: type || (parseInt(quantityChange) > 0 ? 'stock_in' : 'adjustment'),
    supplierId,
    actor: { userId: actor.id, userName: actor.fullName, userRole: actor.role }
  });

  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  res.json(result);
});

// -------------------------------------------------------------
// SALES MANAGEMENT & RECEIPT GENERATION
// -------------------------------------------------------------
app.get('/api/sales', authenticate, (req, res) => {
  const user = (req as any).user as User;
  const { startDate, endDate, paymentMethod, paymentStatus } = req.query;

  // Staff can view their own sales; Admin can view all sales
  const filter: any = {
    startDate: startDate as string,
    endDate: endDate as string,
    paymentMethod: paymentMethod as string,
    paymentStatus: paymentStatus as string
  };

  if (user.role !== 'admin') {
    filter.staffId = user.id;
  }

  const sales = db.getSales(filter);
  res.json(sales);
});

app.get('/api/sales/:id', authenticate, (req, res) => {
  const sale = db.getSaleById(req.params.id);
  if (!sale) return res.status(404).json({ error: 'Transaction not found.' });

  const user = (req as any).user as User;
  if (user.role !== 'admin' && sale.staffId !== user.id) {
    return res.status(403).json({ error: 'Forbidden: You can only view your own sales.' });
  }

  res.json(sale);
});

app.post('/api/sales', authenticate, requireRole(['admin', 'staff']), (req, res) => {
  const actor = (req as any).user;
  const { customerId, customerName, customerPhone, items, discount, paymentMethod, notes } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'At least one product item is required to complete a sale.' });
  }

  const result = db.recordSale({
    customerId,
    customerName: customerName || 'Walk-in Customer',
    customerPhone: customerPhone || 'N/A',
    items,
    discount: parseFloat(discount) || 0,
    paymentMethod: paymentMethod || 'Cash',
    notes,
    actor: {
      userId: actor.id,
      userName: actor.fullName,
      userRole: actor.role
    }
  });

  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json(result.sale);
});

app.post('/api/sales/:id/void', authenticate, requireRole(['admin']), (req, res) => {
  const actor = (req as any).user;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'A valid audit reason is required to void or reverse a completed sale.' });
  }

  const result = db.voidSale(req.params.id, reason, {
    userId: actor.id,
    userName: actor.fullName,
    userRole: 'admin'
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ message: 'Sale successfully voided and inventory restored.', sale: result.sale });
});

// -------------------------------------------------------------
// CUSTOMERS
// -------------------------------------------------------------
app.get('/api/customers', authenticate, (req, res) => {
  const { search } = req.query;
  const customers = db.getCustomers(search as string);
  res.json(customers);
});

app.post('/api/customers', authenticate, (req, res) => {
  const actor = (req as any).user;
  const { fullName, phone, email, address, city, state, customerType, notes } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Customer Full Name and Phone Number are required.' });
  }

  const customer = db.createCustomer({
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email?.trim(),
    address: address?.trim() || 'Zaria',
    city: city?.trim() || 'Zaria',
    state: state?.trim() || 'Kaduna State',
    customerType: customerType || 'retail',
    outstandingBalance: 0,
    totalPurchases: 0,
    assignedStaffId: actor.id,
    notes
  });

  res.status(201).json(customer);
});

app.put('/api/customers/:id', authenticate, (req, res) => {
  const updated = db.updateCustomer(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Customer not found.' });
  res.json(updated);
});

// -------------------------------------------------------------
// CUSTOMER ENQUIRIES & QUOTATIONS
// -------------------------------------------------------------
// Public enquiry creation
app.post('/api/enquiries', (req, res) => {
  const { customerName, phone, email, productOrService, category, quantity, message, preferredContact } = req.body;

  if (!customerName || !phone || !message) {
    return res.status(400).json({ error: 'Customer Name, Phone Number, and Message are required.' });
  }

  const enquiry = db.createEnquiry({
    customerName,
    phone,
    email,
    productOrService: productOrService || 'General Solar Enquiry',
    category,
    quantity: parseInt(quantity) || 1,
    message,
    preferredContact
  });

  res.status(201).json({
    message: 'Enquiry received successfully! Our solar engineering team in Zaria will contact you shortly.',
    enquiryRef: enquiry.enquiryRef,
    enquiry
  });
});

app.get('/api/enquiries', authenticate, (req, res) => {
  const user = (req as any).user as User;
  const { status } = req.query;

  const enquiries = db.getEnquiries({
    status: status as string,
    staffId: user.role === 'admin' ? undefined : user.id
  });

  res.json(enquiries);
});

app.put('/api/enquiries/:id', authenticate, (req, res) => {
  const actor = (req as any).user;
  const updated = db.updateEnquiry(req.params.id, req.body, {
    userId: actor.id,
    userName: actor.fullName,
    userRole: actor.role
  });

  if (!updated) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json(updated);
});

app.get('/api/quotations', authenticate, (_req, res) => {
  res.json(db.getQuotations());
});

app.post('/api/quotations', authenticate, (req, res) => {
  const actor = (req as any).user;
  const { customerName, customerPhone, customerEmail, systemCapacity, items, discount, validUntil } = req.body;

  if (!customerName || !customerPhone || !items?.length) {
    return res.status(400).json({ error: 'Customer details and items are required.' });
  }

  const subtotal = items.reduce((acc: number, item: any) => acc + (item.unitPrice * item.quantity), 0);
  const totalAmount = Math.max(0, subtotal - (parseFloat(discount) || 0));

  const quote = db.createQuotation({
    customerName,
    customerPhone,
    customerEmail,
    systemCapacity: systemCapacity || 'Custom Solar System',
    items,
    subtotal,
    discount: parseFloat(discount) || 0,
    totalAmount,
    status: 'sent',
    createdByStaffId: actor.id,
    createdByStaffName: actor.fullName,
    validUntil: validUntil || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });

  res.status(201).json(quote);
});

// -------------------------------------------------------------
// FINANCIALS, EXPENSES & SUPPLIERS (ADMIN)
// -------------------------------------------------------------
app.get('/api/expenses', authenticate, requireRole(['admin']), (_req, res) => {
  res.json(db.getExpenses());
});

app.post('/api/expenses', authenticate, requireRole(['admin']), (req, res) => {
  const actor = (req as any).user;
  const { title, category, amount, paymentMethod, paidTo, date, notes } = req.body;

  if (!title || !category || !amount) {
    return res.status(400).json({ error: 'Title, Category, and Amount are required.' });
  }

  const exp = db.createExpense(
    {
      title,
      category,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || 'Cash',
      paidTo: paidTo || 'N/A',
      date: date || new Date().toISOString().slice(0, 10),
      notes,
      recordedByUserId: actor.id,
      recordedByName: actor.fullName
    },
    { userId: actor.id, userName: actor.fullName }
  );

  res.status(201).json(exp);
});

app.get('/api/suppliers', authenticate, requireRole(['admin']), (_req, res) => {
  res.json(db.getSuppliers());
});

app.post('/api/suppliers', authenticate, requireRole(['admin']), (req, res) => {
  const { name, contactPerson, phone, email, address, productsSupplied, balanceOwed } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Supplier Name and Phone are required.' });

  const sup = db.createSupplier({
    name,
    contactPerson: contactPerson || '',
    phone,
    email: email || '',
    address: address || '',
    productsSupplied: productsSupplied || '',
    balanceOwed: parseFloat(balanceOwed) || 0
  });

  res.status(201).json(sup);
});

// -------------------------------------------------------------
// STAFF ACCOUNTS & PERMISSIONS (ADMIN)
// -------------------------------------------------------------
app.get('/api/staff', authenticate, requireRole(['admin']), (_req, res) => {
  const users = db.getUsers().map(({ passwordHash: _, ...u }) => u);
  res.json(users);
});

app.post('/api/staff', authenticate, requireRole(['admin']), (req, res) => {
  const actor = (req as any).user;
  const { fullName, username, email, password, phone, role, status } = req.body;

  if (!fullName || !username || !password || !phone) {
    return res.status(400).json({ error: 'Full Name, Username, Phone, and Password are required.' });
  }

  if (db.findUserByUsername(username)) {
    return res.status(400).json({ error: 'Username or email already in use.' });
  }

  const newUser = db.createUser({
    fullName: fullName.trim(),
    username: username.trim(),
    email: (email || username).trim(),
    passwordHash: password,
    phone: phone.trim(),
    role: role || 'staff',
    status: status || 'active'
  });

  db.recordActivity({
    userId: actor.id,
    userName: actor.fullName,
    userRole: 'admin',
    actionType: 'STAFF_MODIFIED',
    description: `Created new staff account for ${newUser.fullName} (${newUser.role})`
  });

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

app.put('/api/staff/:id', authenticate, requireRole(['admin']), (req, res) => {
  const actor = (req as any).user;
  const { password, ...otherUpdates } = req.body;

  const updates: any = { ...otherUpdates };
  if (password && password.trim()) {
    updates.passwordHash = password.trim();
  }

  const updated = db.updateUser(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Staff account not found.' });

  db.recordActivity({
    userId: actor.id,
    userName: actor.fullName,
    userRole: 'admin',
    actionType: 'STAFF_MODIFIED',
    description: `Updated profile or status for staff ${updated.fullName}`
  });

  const { passwordHash: _, ...safeUser } = updated;
  res.json(safeUser);
});

// -------------------------------------------------------------
// AUDIT LOGS & REPORTS
// -------------------------------------------------------------
app.get('/api/logs', authenticate, requireRole(['admin']), (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
  res.json(db.getActivityLogs(limit));
});

app.get('/api/analytics', authenticate, (req, res) => {
  const user = (req as any).user as User;

  if (user.role === 'admin') {
    const report = db.getFinancialReport();
    return res.json(report);
  }

  // Staff summary: personal metrics only
  const today = new Date().toISOString().slice(0, 10);
  const staffSales = db.getSales({ staffId: user.id }).filter(s => s.paymentStatus !== 'cancelled');
  const todaySales = staffSales.filter(s => s.date.startsWith(today));
  const todayRevenue = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalRevenue = staffSales.reduce((acc, s) => acc + s.totalAmount, 0);

  const pendingEnquiries = db.getEnquiries({ staffId: user.id, status: 'pending' });

  res.json({
    role: 'staff',
    staffName: user.fullName,
    todayRevenue,
    todayTransactions: todaySales.length,
    totalRevenue,
    totalTransactions: staffSales.length,
    assignedPendingEnquiries: pendingEnquiries.length,
    availableProductsCount: db.getProducts().filter(p => p.stockQuantity > 0).length,
    lowStockAlertsCount: db.getProducts().filter(p => p.availabilityStatus === 'low_stock').length
  });
});

// -------------------------------------------------------------
// DEV VITE / PRODUCTION STATIC SERVING
// -------------------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bazaz Solar Engine] Running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to start Bazaz Solar Server:', err);
});
