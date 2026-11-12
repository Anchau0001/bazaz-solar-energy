import React, { useState, useMemo } from 'react';
import { Product } from '../../types/index.ts';
import { Search, Package, AlertTriangle, CheckCircle2, XCircle, Eye, ShieldCheck, X } from 'lucide-react';

interface StaffInventoryViewProps {
  products: Product[];
  onStartSaleForProduct?: (product: Product) => void;
}

export const StaffInventoryView: React.FC<StaffInventoryViewProps> = ({
  products,
  onStartSaleForProduct
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => map.set(p.categoryId, p.categoryId.replace('cat_', '').replace('-', ' ')));
    return Array.from(map.entries());
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.refNumber.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        Object.values(p.technicalSpecs).some(v => v.toLowerCase().includes(q))
      );
    });
  }, [products, selectedCategory, search]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Live Stock & Inventory Catalog</h3>
          <p className="text-xs text-slate-500">
            Check real-time warehouse counts, official retail pricing, and equipment specifications
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Staff Read-Only Access
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equipment by name, reference code, or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          >
            <option value="all">All Inventory Categories</option>
            {categories.map(([catId, catName]) => (
              <option key={catId} value={catId}>{catName.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px]">
              <th className="p-3.5">Product / Reference</th>
              <th className="p-3.5">Brand</th>
              <th className="p-3.5">Approved Price (₦)</th>
              <th className="p-3.5 text-center">Available Stock</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(prod => (
              <tr key={prod.id} className="hover:bg-slate-50/70 transition">
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 font-bold block">{prod.refNumber}</span>
                      <span className="font-bold text-slate-900">{prod.name}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 font-bold text-slate-700 uppercase">{prod.brand}</td>
                <td className="p-3.5 font-black text-emerald-950 text-sm">
                  ₦{prod.sellingPrice.toLocaleString()}
                </td>
                <td className="p-3.5 text-center font-bold text-slate-800">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${
                    prod.stockQuantity <= 0
                      ? 'bg-rose-100 text-rose-700'
                      : prod.stockQuantity <= prod.minStockLevel
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {prod.stockQuantity} Units
                  </span>
                </td>
                <td className="p-3.5">
                  {prod.availabilityStatus === 'in_stock' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      In Stock
                    </span>
                  ) : prod.availabilityStatus === 'low_stock' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-900 hover:bg-slate-100 transition"
                      title="View Specifications"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {onStartSaleForProduct && prod.stockQuantity > 0 && (
                      <button
                        onClick={() => onStartSaleForProduct(prod)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-700 transition"
                      >
                        Sell
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Spec Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="font-mono text-amber-400 text-xs font-bold block">{selectedProduct.refNumber}</span>
                <h4 className="font-bold text-white text-base">{selectedProduct.name}</h4>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Selling Price:</span>
                <span className="font-black text-emerald-950 text-base">₦{selectedProduct.sellingPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block mb-1">Description:</span>
                <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
              </div>
              <div>
                <span className="font-bold text-slate-800 block mb-2">Technical Specifications:</span>
                <div className="bg-slate-50 rounded-xl divide-y divide-slate-200/80 border border-slate-200">
                  {Object.entries(selectedProduct.technicalSpecs).map(([k, v]) => (
                    <div key={k} className="p-2.5 flex justify-between">
                      <span className="font-medium text-slate-600">{k}:</span>
                      <span className="font-semibold text-slate-900 text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
