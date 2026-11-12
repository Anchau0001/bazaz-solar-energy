import React, { useState, useMemo } from 'react';
import { Product, Customer, Sale } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  CreditCard,
  Banknote,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SalesTerminalProps {
  products: Product[];
  customers: Customer[];
  onSaleCompleted: (sale: Sale) => void;
  onRefreshData: () => void;
}

export const SalesTerminal: React.FC<SalesTerminalProps> = ({
  products,
  customers,
  onSaleCompleted,
  onRefreshData
}) => {
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'POS' | 'Split Payment'>('Cash');
  const [customerMode, setCustomerMode] = useState<'existing' | 'walkin' | 'new'>('walkin');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Categories
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => map.set(p.categoryId, p.categoryId.replace('cat_', '').replace('-', ' ')));
    return Array.from(map.entries());
  }, [products]);

  // Filter available products
  const availableProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      if (!productSearch.trim()) return true;
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.refNumber.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    });
  }, [products, selectedCategory, productSearch]);

  const addToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      alert(`Cannot add "${product.name}". It is currently out of stock.`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert(`Cannot exceed available stock (${product.stockQuantity}) for ${product.name}.`);
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stockQuantity) {
              alert(`Maximum stock available is ${item.product.stockQuantity}`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
  const totalAmount = Math.max(0, subtotal - discount);

  const handleCustomerSelect = (id: string) => {
    setSelectedCustomerId(id);
    const found = customers.find(c => c.id === id);
    if (found) {
      setCustomerName(found.fullName);
      setCustomerPhone(found.phone);
    }
  };

  const handleRecordSale = async () => {
    setErrorMessage('');
    if (cart.length === 0) {
      setErrorMessage('Please add at least one product to the sales order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsPayload = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice
      }));

      const finalCustomerName = customerMode === 'walkin'
        ? (customerName.trim() || 'Walk-in Customer')
        : customerName.trim();

      const finalPhone = customerPhone.trim() || 'N/A';

      const sale = await api.recordSale({
        customerId: customerMode === 'existing' ? selectedCustomerId : undefined,
        customerName: finalCustomerName,
        customerPhone: finalPhone,
        items: itemsPayload,
        discount: Number(discount) || 0,
        paymentMethod,
        notes: notes.trim() || undefined
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Clear cart
      setCart([]);
      setDiscount(0);
      setNotes('');
      if (customerMode === 'walkin') {
        setCustomerName('');
        setCustomerPhone('');
      }

      onRefreshData();
      onSaleCompleted(sale);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Product Catalog Selection (Left Side) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Point of Sale (POS) Terminal</h3>
            <p className="text-xs text-slate-500">Select items to add to the customer order</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {products.length} Items in System
          </span>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name, ref number, or brand..."
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          >
            <option value="all">All Product Categories</option>
            {categories.map(([catId, catName]) => (
              <option key={catId} value={catId}>{catName.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Product Items Table / Grid */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {availableProducts.map(prod => {
            const inCart = cart.find(c => c.product.id === prod.id)?.quantity || 0;
            const remainingStock = prod.stockQuantity - inCart;

            return (
              <div
                key={prod.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/70 transition duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{prod.refNumber}</span>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">{prod.brand}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</h4>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px]">
                      <span className="font-black text-emerald-950">₦{prod.sellingPrice.toLocaleString()}</span>
                      <span className={`text-[10px] font-semibold ${
                        prod.stockQuantity <= 0 ? 'text-rose-600' : prod.stockQuantity <= prod.minStockLevel ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        Stock: {prod.stockQuantity} ({remainingStock} left)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  disabled={remainingStock <= 0}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition shadow-2xs shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart & Billing Checkout (Right Side) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900">
            <ShoppingCart className="w-5 h-5 text-emerald-800" />
            <h3 className="font-extrabold text-base">Current Sales Order</h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">{cart.length} distinct item(s)</span>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Customer Information Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Customer Details:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setCustomerMode('walkin')}
                className={`px-2 py-0.5 rounded-md font-semibold transition ${customerMode === 'walkin' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'}`}
              >
                Walk-in
              </button>
              <button
                type="button"
                onClick={() => setCustomerMode('existing')}
                className={`px-2 py-0.5 rounded-md font-semibold transition ${customerMode === 'existing' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'}`}
              >
                Existing
              </button>
            </div>
          </div>

          {customerMode === 'existing' ? (
            <select
              value={selectedCustomerId}
              onChange={e => handleCustomerSelect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            >
              <option value="">-- Choose Existing Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.fullName} ({c.phone})</option>
              ))}
            </select>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Customer Name (Optional)"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white"
              />
              <input
                type="tel"
                placeholder="Customer Phone"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white"
              />
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="border border-slate-100 rounded-2xl p-3 bg-slate-50/50 max-h-48 overflow-y-auto space-y-2.5">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Your cart is empty. Click "+ Add" on any product on the left to start recording a sale.
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="max-w-[55%]">
                  <h5 className="font-bold text-slate-900 truncate">{item.product.name}</h5>
                  <span className="text-[10px] text-slate-500">
                    ₦{item.product.sellingPrice.toLocaleString()} each
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center bg-white text-slate-700 font-bold hover:bg-slate-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center bg-white text-slate-700 font-bold hover:bg-slate-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-extrabold text-slate-900 w-16 text-right">
                    ₦{(item.product.sellingPrice * item.quantity).toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Discounts */}
        <div className="space-y-2 text-xs pt-1">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold">₦{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-600">Apply Discount (₦):</span>
            <input
              type="number"
              min="0"
              max={subtotal}
              value={discount || ''}
              onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
              className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-right text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>VAT (0% Solar Exemption):</span>
            <span>₦0</span>
          </div>

          <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
            <span className="text-emerald-950 font-black">TOTAL DUE:</span>
            <span className="text-emerald-800 text-lg">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 text-xs block">Payment Method:</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['Cash', 'Bank Transfer', 'POS', 'Split Payment'] as const).map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                  paymentMethod === method
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {method === 'Cash' && <Banknote className="w-3.5 h-3.5" />}
                {method === 'POS' && <CreditCard className="w-3.5 h-3.5" />}
                <span>{method}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <input
            type="text"
            placeholder="Transaction notes (e.g. Stanbic transfer ref, customer pickup)..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white"
          />
        </div>

        {/* Complete Transaction Button */}
        <button
          onClick={handleRecordSale}
          disabled={isSubmitting || cart.length === 0}
          className="w-full py-4 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 active:scale-98"
        >
          {isSubmitting ? (
            <span>Processing & Deducting Stock...</span>
          ) : (
            <>
              <Receipt className="w-4 h-4" />
              <span>Complete Sale & Issue Receipt</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
