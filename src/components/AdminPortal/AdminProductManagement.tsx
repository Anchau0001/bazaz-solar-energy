import React, { useState } from 'react';
import { Product, Category } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Save,
  Layers
} from 'lucide-react';

interface AdminProductManagementProps {
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
}

export const AdminProductManagement: React.FC<AdminProductManagementProps> = ({
  products,
  categories,
  onRefreshData
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [minStockLevel, setMinStockLevel] = useState<number>(2);
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [technicalSpecs, setTechnicalSpecs] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.refNumber.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setRefNumber(`BSE-${Math.floor(100 + Math.random() * 900)}`);
    setCategoryId(categories[0]?.id || '');
    setBrand('');
    setDescription('');
    setPurchasePrice(0);
    setSellingPrice(0);
    setStockQuantity(5);
    setMinStockLevel(2);
    setImageUrl('https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80');
    setIsPublic(true);
    setTechnicalSpecs({
      "Warranty": "2 Years",
      "Origin": "Grade-A Certified"
    });
    setErrorMsg('');
    setIsEditingModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setRefNumber(prod.refNumber);
    setCategoryId(prod.categoryId);
    setBrand(prod.brand);
    setDescription(prod.description);
    setPurchasePrice(prod.purchasePrice || 0);
    setSellingPrice(prod.sellingPrice);
    setStockQuantity(prod.stockQuantity);
    setMinStockLevel(prod.minStockLevel);
    setImageUrl(prod.imageUrl);
    setIsPublic(prod.isPublic);
    setTechnicalSpecs(prod.technicalSpecs || {});
    setErrorMsg('');
    setIsEditingModalOpen(true);
  };

  const addSpec = () => {
    if (!specKey.trim() || !specValue.trim()) return;
    setTechnicalSpecs(prev => ({ ...prev, [specKey.trim()]: specValue.trim() }));
    setSpecKey('');
    setSpecValue('');
  };

  const removeSpec = (keyToRemove: string) => {
    const next = { ...technicalSpecs };
    delete next[keyToRemove];
    setTechnicalSpecs(next);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !categoryId || !brand.trim() || !sellingPrice) {
      setErrorMsg('Please complete all required fields (Name, Category, Brand, Selling Price).');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        refNumber,
        categoryId,
        brand,
        description,
        purchasePrice: Number(purchasePrice) || 0,
        sellingPrice: Number(sellingPrice),
        stockQuantity: Number(stockQuantity),
        minStockLevel: Number(minStockLevel),
        imageUrl,
        isPublic,
        technicalSpecs
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }

      setIsEditingModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${prodName}" from the catalog?`)) {
      return;
    }
    try {
      await api.deleteProduct(id);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Product & Catalog Management</h3>
          <p className="text-xs text-slate-500">
            Maintain wholesale purchase costs, retail selling prices, stock levels, and public visibility
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, ref code, or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px]">
              <th className="p-3.5">Product & Ref</th>
              <th className="p-3.5">Brand</th>
              <th className="p-3.5">Cost (COGS)</th>
              <th className="p-3.5">Retail Price</th>
              <th className="p-3.5 text-center">Stock</th>
              <th className="p-3.5 text-center">Visibility</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(p => {
              const margin = p.purchasePrice ? (p.sellingPrice - p.purchasePrice) : 0;
              return (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold block">{p.refNumber}</span>
                        <span className="font-bold text-slate-900">{p.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-slate-700">{p.brand}</td>
                  <td className="p-3.5 font-medium text-slate-600">
                    ₦{(p.purchasePrice || 0).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className="font-black text-emerald-950 text-sm block">₦{p.sellingPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Margin: +₦{margin.toLocaleString()}</span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      p.stockQuantity <= 0 ? 'bg-rose-100 text-rose-700' : p.stockQuantity <= p.minStockLevel ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {p.isPublic ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <Eye className="w-3.5 h-3.5" /> Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <EyeOff className="w-3.5 h-3.5" /> Hidden
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Product Add / Edit Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 my-8">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">
                  {editingProduct ? 'Edit Product & Pricing' : 'Add New Solar / Electrical Product'}
                </h4>
                <p className="text-[11px] text-emerald-300">Bazaz Solar Inventory Manager</p>
              </div>
              <button onClick={() => setIsEditingModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Felicity Solar 5kVA 48V Hybrid Inverter"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ref Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="BSE-INV-001"
                    value={refNumber}
                    onChange={e => setRefNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Felicity, Jinko, Luminous, etc."
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                  />
                </div>
              </div>

              {/* Pricing & Stock Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Purchase Cost (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-900 block mb-1">Selling Price (₦) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={sellingPrice}
                    onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-emerald-300 rounded-xl p-2 text-xs font-black text-emerald-950"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={e => setStockQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={minStockLevel}
                    onChange={e => setMinStockLevel(parseInt(e.target.value) || 2)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Key features and applications..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                ></textarea>
              </div>

              {/* Technical Specs Editor */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Technical Specifications</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. Voltage, Capacity)"
                    value={specKey}
                    onChange={e => setSpecKey(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 48V, 100Ah)"
                    value={specValue}
                    onChange={e => setSpecValue(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addSpec}
                    className="px-3 py-2 bg-slate-800 text-white font-bold rounded-xl shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.entries(technicalSpecs).map(([k, v]) => (
                    <span key={k} className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px]">
                      <strong>{k}:</strong> {v}
                      <button type="button" onClick={() => removeSpec(k)} className="text-rose-500 hover:text-rose-700 font-bold ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4"
                />
                <label htmlFor="isPublic" className="font-bold text-slate-700 text-xs">
                  Display this product in public website catalog
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
