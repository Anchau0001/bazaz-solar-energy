import React, { useState, useMemo } from 'react';
import { Product, Category } from '../../types/index.ts';
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Layers,
  ArrowUpDown,
  X,
  Plus,
  Scale
} from 'lucide-react';

interface ProductCatalogueProps {
  products: Product[];
  categories: Category[];
  onOpenInquiry: (productName: string, refNumber: string) => void;
}

export const ProductCatalogue: React.FC<ProductCatalogueProps> = ({
  products,
  categories,
  onOpenInquiry
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name' | 'featured'>('featured');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.brand && set.add(p.brand));
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.isPublic);

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.refNumber.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        Object.entries(p.technicalSpecs).some(([k, v]) =>
          k.toLowerCase().includes(q) || v.toLowerCase().includes(q)
        )
      );
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const toggleComparison = (product: Product) => {
    if (comparisonList.some(p => p.id === product.id)) {
      setComparisonList(comparisonList.filter(p => p.id !== product.id));
    } else {
      if (comparisonList.length >= 3) {
        alert('You can compare a maximum of 3 products at a time.');
        return;
      }
      setComparisonList([...comparisonList, product]);
    }
  };

  const handleWhatsAppProductInquiry = (prod: Product) => {
    const text = `Hello Bazaz Solar Energy! I am interested in purchasing:\n\n*${prod.name}*\nRef Number: ${prod.refNumber}\nBrand: ${prod.brand}\nPrice: ₦${prod.sellingPrice.toLocaleString()}\n\nIs this available at Shop No. 7, Bazaz Plaza Nagoyi?`;
    window.open(`https://wa.me/2349168655473?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="products-catalogue" className="py-16 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Full Product Catalogue</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              Solar & Electrical Inventory
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Authentic solar batteries, inverters, monocrystalline panels, charge controllers, and certified electrical cables available at our Zaria store.
            </p>
          </div>

          {comparisonList.length > 0 && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Compare Selected ({comparisonList.length}/3)</span>
            </button>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, ref, brand, or technical spec..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="lg:col-span-4 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 shrink-0">Brand:</span>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">All Brands (Felicity, Jinko, Luminous, etc.)</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="lg:col-span-3 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="featured">Featured Order</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Badges / Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories ({products.filter(p => p.isPublic).length})
            </button>
            {categories.map(cat => {
              const count = products.filter(p => p.isPublic && p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full font-semibold transition shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No products match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const category = categories.find(c => c.id === product.categoryId);
              const isCompared = comparisonList.some(p => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-md transition duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Reference Tag */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {product.refNumber}
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {product.availabilityStatus === 'in_stock' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          In Stock ({product.stockQuantity})
                        </span>
                      ) : product.availabilityStatus === 'low_stock' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-500/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock ({product.stockQuantity})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Quick Specs Peek */}
                    <button
                      onClick={() => setSelectedProductForModal(product)}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white text-xs font-semibold"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>View Full Specifications</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-medium">
                        <span className="text-emerald-800 font-bold uppercase tracking-wider">{product.brand}</span>
                        <span>{category?.name || 'Solar & Electrical'}</span>
                      </div>

                      <h3
                        onClick={() => setSelectedProductForModal(product)}
                        className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-emerald-800 cursor-pointer transition mb-2"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      {/* Price Tag */}
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Selling Price</span>
                          <span className="text-lg font-black text-emerald-950">
                            ₦{product.sellingPrice.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleComparison(product)}
                          className={`text-[11px] font-medium px-2 py-1 rounded-lg border transition ${
                            isCompared
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                              : 'border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {isCompared ? '✓ Added' : '+ Compare'}
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleWhatsAppProductInquiry(product)}
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-2xs"
                          title="Ask price / availability on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => onOpenInquiry(product.name, product.refNumber)}
                          className="flex items-center justify-center py-2 px-2.5 rounded-xl border border-slate-200 hover:border-emerald-700 hover:text-emerald-900 text-slate-700 font-semibold text-xs transition"
                        >
                          <span>Inquire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-xs font-mono font-bold block">
                  {selectedProductForModal.refNumber} • {selectedProductForModal.brand}
                </span>
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {selectedProductForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductForModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={selectedProductForModal.imageUrl}
                    alt={selectedProductForModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <span className="text-xs text-slate-500 font-medium block">Approved Selling Price</span>
                    <span className="text-2xl font-black text-emerald-950">
                      ₦{selectedProductForModal.sellingPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                      ✓ Zero VAT Rate on Solar Renewables
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Availability:</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {selectedProductForModal.stockQuantity} Units In Stock (Shop No. 7)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProductForModal.description}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3">Technical Specifications</h4>
                <div className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-200/60 text-xs">
                  {Object.entries(selectedProductForModal.technicalSpecs).map(([specKey, specVal]) => (
                    <div key={specKey} className="grid grid-cols-2 p-3">
                      <span className="font-medium text-slate-600">{specKey}</span>
                      <span className="font-semibold text-slate-900">{specVal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  All products sold at Bazaz Solar Energy come with verified manufacturer warranties and post-installation support in Zaria.
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  handleWhatsAppProductInquiry(selectedProductForModal);
                  setSelectedProductForModal(null);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  onOpenInquiry(selectedProductForModal.name, selectedProductForModal.refNumber);
                  setSelectedProductForModal(null);
                }}
                className="px-4 py-2.5 bg-emerald-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
              >
                Request Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Drawer / Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Compare Solar Equipment Specifications</h3>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 text-slate-500 font-bold uppercase w-1/4">Specification</th>
                    {comparisonList.map(prod => (
                      <th key={prod.id} className="p-3 font-bold text-slate-900 w-1/4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-emerald-800 font-mono block">{prod.refNumber}</span>
                          <span className="line-clamp-2">{prod.name}</span>
                          <span className="text-emerald-900 font-black block">₦{prod.sellingPrice.toLocaleString()}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 bg-slate-50/70">Brand</td>
                    {comparisonList.map(prod => (
                      <td key={prod.id} className="p-3 font-bold text-emerald-900">{prod.brand}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 bg-slate-50/70">Stock Level</td>
                    {comparisonList.map(prod => (
                      <td key={prod.id} className="p-3 font-semibold">{prod.stockQuantity} units available</td>
                    ))}
                  </tr>
                  {/* Extract union of all technical specs */}
                  {Array.from(new Set(comparisonList.flatMap(p => Object.keys(p.technicalSpecs)))).map(specKey => (
                    <tr key={specKey}>
                      <td className="p-3 font-semibold text-slate-600 bg-slate-50/70">{specKey}</td>
                      {comparisonList.map(prod => (
                        <td key={prod.id} className="p-3 text-slate-800 font-medium">
                          {prod.technicalSpecs[specKey] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setComparisonList([])}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Clear Comparison
              </button>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
