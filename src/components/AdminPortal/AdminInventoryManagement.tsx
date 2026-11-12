import React, { useState, useEffect } from 'react';
import { Product, StockMovement, Supplier } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  Package,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  History,
  Building,
  RotateCcw,
  CheckCircle2,
  X,
  Search
} from 'lucide-react';

interface AdminInventoryManagementProps {
  products: Product[];
  onRefreshData: () => void;
}

export const AdminInventoryManagement: React.FC<AdminInventoryManagementProps> = ({
  products,
  onRefreshData
}) => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantityChange, setQuantityChange] = useState<number>(1);
  const [adjustmentType, setAdjustmentType] = useState<'stock_in' | 'adjustment' | 'return'>('stock_in');
  const [reason, setReason] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchMovement, setSearchMovement] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [movData, supData] = await Promise.all([
        api.getInventoryMovements(),
        api.getSuppliers()
      ]);
      setMovements(movData);
      setSuppliers(supData);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedProductId || !reason.trim() || quantityChange === 0) {
      setErrorMsg('Please select a product, enter quantity change, and specify reason.');
      return;
    }

    setIsSubmitting(true);
    try {
      const delta = adjustmentType === 'stock_in' || adjustmentType === 'return'
        ? Math.abs(quantityChange)
        : quantityChange;

      await api.adjustStock({
        productId: selectedProductId,
        quantityChange: delta,
        reason,
        type: adjustmentType,
        supplierId: supplierId || undefined
      });

      setShowAdjustModal(false);
      setSelectedProductId('');
      setReason('');
      setQuantityChange(1);
      loadData();
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to adjust stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMovements = movements.filter(m => {
    if (!searchMovement.trim()) return true;
    const q = searchMovement.toLowerCase();
    return (
      m.productName.toLowerCase().includes(q) ||
      m.reason.toLowerCase().includes(q) ||
      m.performedByName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Inventory Movements & Stock Intake</h3>
          <p className="text-xs text-slate-500">
            Log supplier consignments, warehouse adjustments, and trace every unit movement
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProductId(products[0]?.id || '');
            setShowAdjustModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Record Stock In / Adjustment</span>
        </button>
      </div>

      {/* Low Stock Warning Banner */}
      {products.some(p => p.availabilityStatus === 'low_stock' || p.availabilityStatus === 'out_of_stock') && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold">Inventory Replenishment Alert</h5>
            <p className="mt-0.5 leading-relaxed">
              The following products have reached or fallen below minimum stock thresholds:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {products
                .filter(p => p.availabilityStatus === 'low_stock' || p.availabilityStatus === 'out_of_stock')
                .map(p => (
                  <span key={p.id} className="bg-white px-2.5 py-1 rounded-lg border border-amber-300 font-semibold text-[11px]">
                    {p.name} ({p.stockQuantity} remaining)
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Movement History */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-800" />
            <h4 className="font-bold text-slate-900 text-sm">Movement Audit Trail</h4>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movements..."
              value={searchMovement}
              onChange={e => setSearchMovement(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px]">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Product</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-center">Change</th>
                <th className="p-3 text-center">Stock Balance</th>
                <th className="p-3">Audit Reason</th>
                <th className="p-3">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 text-slate-500">{new Date(m.timestamp).toLocaleString('en-GB')}</td>
                  <td className="p-3 font-bold text-slate-900">{m.productName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.type === 'stock_in' ? 'bg-emerald-100 text-emerald-800' : m.type === 'sale_deduct' ? 'bg-blue-100 text-blue-800' : m.type === 'return' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {m.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold">
                    <span className={m.quantityChange > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                      {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-600">
                    {m.previousStock} → <strong className="text-slate-900">{m.newStock}</strong>
                  </td>
                  <td className="p-3 text-slate-700">{m.reason}</td>
                  <td className="p-3 font-semibold text-emerald-900">{m.performedByName}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMovements.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No inventory movements recorded.
            </div>
          )}
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Record Inventory Adjustment / Intake</h4>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="p-6 space-y-3.5 text-xs">
              {errorMsg && <p className="text-rose-600 font-bold">{errorMsg}</p>}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Equipment Item *</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current Stock: {p.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Adjustment Type *</label>
                  <select
                    value={adjustmentType}
                    onChange={e => setAdjustmentType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="stock_in">Stock-In (New Consignment)</option>
                    <option value="adjustment">Manual Correction (+/-)</option>
                    <option value="return">Customer Return</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {adjustmentType === 'adjustment' ? 'Quantity (+/-)' : 'Units Count *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={quantityChange}
                    onChange={e => setQuantityChange(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white"
                  />
                </div>
              </div>

              {adjustmentType === 'stock_in' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Supplier (Optional)</label>
                  <select
                    value={supplierId}
                    onChange={e => setSupplierId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    <option value="">-- Direct Local Procurement --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Audit Reason / Consignment Ref *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Lagos supplier delivery waybill #009384, or damaged carton write-off..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  {isSubmitting ? 'Recording...' : 'Update Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
