import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Eye,
  SlidersHorizontal,
  Box,
  Upload,
  Sparkles,
  Bot,
  Layers,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { formatBDT } from '../../utils/currency';
import { RobotViewer3D } from '../../components/storefront/RobotViewer3D';

const PRESET_OPTIONS = [
  { value: '', label: 'None (Standard 2D Listing)' },
  { value: 'apex_mascot', label: 'Apex-01 Cyber Mascot Companion' },
  { value: 'spider_bot', label: 'ESP32 12-DOF Quadruped Spider Robot' },
  { value: 'robotic_arm', label: '4-DOF Metal Industrial Robotic Arm' },
  { value: 'esp32_core', label: 'ESP32-WROOM-32D IoT Core Dev Board' },
  { value: 'mech_drone', label: 'Articulated Mech Drone & Swarm' },
];

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading3D, setIsUploading3D] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState(null);

  // Unified Product Modal State (Supports Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState({
    id: null,
    name: '',
    sku: '',
    category_id: '1',
    regular_price: '',
    sale_price: '',
    short_description: '',
    stock_quantity: '10',
    image_url: '',
    is_featured: false,
    model_3d_url: '',
    model_3d_format: 'preset',
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/categories', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || data.data || []);
      }
    } catch {
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory) params.append('category_id', selectedCategory);

      const res = await fetch(`/api/v1/admin/products?${params.toString()}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || data.products || []);
      } else {
        setError(data.error || 'Failed to load products');
      }
    } catch (err) {
      setError('Network communication failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const handleStockUpdate = async (productId) => {
    const qty = parseInt(stockInput, 10);
    if (isNaN(qty) || qty < 0) {
      alert('Please enter a valid stock number');
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin/products/${productId}/stock`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_quantity: qty }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, total_stock: qty } : p))
        );
        setEditingStockId(null);
      } else {
        alert(data.error || 'Failed to update stock');
      }
    } catch {
      alert('Network error while updating stock');
    }
  };

  const handleToggleActive = async (productId) => {
    try {
      const res = await fetch(`/api/v1/admin/products/${productId}/toggle-active`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, is_active: !p.is_active } : p))
        );
      }
    } catch {
      alert('Failed to toggle status');
    }
  };

  const handleOpenCreateModal = () => {
    setModalProduct({
      id: null,
      name: '',
      sku: '',
      category_id: categories[0]?.id ? String(categories[0].id) : '1',
      regular_price: '',
      sale_price: '',
      short_description: '',
      stock_quantity: '10',
      image_url: '',
      is_featured: false,
      model_3d_url: 'spider_bot',
      model_3d_format: 'preset',
    });
    setUploadSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setModalProduct({
      id: p.id,
      name: p.name || '',
      sku: p.sku || '',
      category_id: String(p.category_id || categories[0]?.id || '1'),
      regular_price: p.regular_price || '',
      sale_price: p.sale_price || '',
      short_description: p.short_description || '',
      stock_quantity: String(p.total_stock ?? 10),
      image_url: p.primary_image || '',
      is_featured: Boolean(p.is_featured),
      model_3d_url: p.model_3d_url || '',
      model_3d_format: p.model_3d_format || (p.model_3d_url ? 'preset' : ''),
    });
    setUploadSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading3D(true);
    setUploadSuccessMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target.result;
        const res = await fetch('/api/v1/admin/upload-3d', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileData,
            format: file.name.split('.').pop()?.toLowerCase() || 'glb',
          }),
        });

        const data = await res.json();
        if (data.success && data.fileUrl) {
          setModalProduct((prev) => ({
            ...prev,
            model_3d_url: data.fileUrl,
            model_3d_format: data.format || 'glb',
          }));
          setUploadSuccessMsg(`Asset "${file.name}" uploaded successfully!`);
        } else {
          alert(data.error || 'Failed to upload 3D model');
        }
        setIsUploading3D(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert('Error uploading 3D model asset');
      setIsUploading3D(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(modalProduct.id);
      const url = isEdit ? `/api/v1/admin/products/${modalProduct.id}` : '/api/v1/admin/products';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalProduct),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch {
      alert('Network error while saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const render3DBadge = (p) => {
    if (!p.model_3d_url) {
      return (
        <span className="text-[10px] text-brand-muted font-mono bg-brand-softGray px-2 py-0.5 rounded">
          No 3D Model
        </span>
      );
    }

    if (p.model_3d_format === 'preset' || !p.model_3d_url.startsWith('/uploads/')) {
      const matched = PRESET_OPTIONS.find((opt) => opt.value === p.model_3d_url);
      const label = matched ? matched.label.split(' ')[0] : p.model_3d_url;
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 border border-purple-500/30">
          <Bot className="w-3 h-3 text-brand-accent" />
          <span>Preset: {label}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 border border-cyan-500/30">
        <Upload className="w-3 h-3 text-cyan-500" />
        <span>Custom {p.model_3d_format?.toUpperCase() || 'GLB'}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-accent font-bold">
            Catalog &amp; 3D CAD Inventory Control
          </span>
          <h1 className="text-2xl font-extrabold text-brand-graphite mt-1">Robotics Catalog</h1>
          <p className="text-xs text-brand-muted mt-1">
            Manage product models, 3D WebGL CAD previews, uploaded GLB files, inventory thresholds, and pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-brand-border text-brand-graphite hover:text-brand-accent hover:border-brand-accent transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-accent' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Robot Model</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search products by model name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs bg-brand-softGray border border-brand-border text-brand-graphite focus:outline-none focus:border-brand-accent"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-graphite text-white hover:bg-brand-accent transition-colors"
        >
          Filter
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        {error && (
          <div className="p-4 bg-rose-500/10 text-rose-500 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-softGray border-b border-brand-border text-brand-muted font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Model &amp; SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">3D View / CAD</th>
                <th className="py-3.5 px-4">Regular Price</th>
                <th className="py-3.5 px-4">Sale Price</th>
                <th className="py-3.5 px-4">Inventory Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-muted">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-muted">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-softGray/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {p.primary_image ? (
                          <img
                            src={p.primary_image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-brand-softGray border border-brand-border shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-brand-softGray border border-brand-border flex items-center justify-center text-brand-muted shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-brand-graphite line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-brand-muted font-mono">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-brand-graphite font-medium">
                      {p.category_name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4">
                      {render3DBadge(p)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-brand-graphite">
                      {formatBDT(p.regular_price)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-accent">
                      {p.sale_price ? formatBDT(p.sale_price) : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {editingStockId === p.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={stockInput}
                            onChange={(e) => setStockInput(e.target.value)}
                            className="w-16 px-2 py-1 rounded border border-brand-accent text-xs font-mono font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => handleStockUpdate(p.id)}
                            className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingStockId(null)}
                            className="p-1 rounded bg-brand-softGray border border-brand-border hover:bg-brand-border"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] ${
                              p.total_stock <= 5
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-600'
                            }`}
                          >
                            {p.total_stock} in stock
                          </span>
                          <button
                            onClick={() => {
                              setEditingStockId(p.id);
                              setStockInput(p.total_stock.toString());
                            }}
                            className="text-brand-muted hover:text-brand-accent p-1"
                            title="Edit Stock"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(p.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          p.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 hover:bg-rose-500/10 hover:text-rose-600'
                            : 'bg-brand-softGray text-brand-muted hover:bg-emerald-500/10 hover:text-emerald-600'
                        }`}
                        title="Click to toggle active state"
                      >
                        {p.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="inline-flex p-1.5 rounded-lg border border-brand-border text-brand-graphite hover:text-brand-accent hover:border-brand-accent transition-colors"
                          title="Edit Product & 3D Model"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex p-1.5 rounded-lg border border-brand-border text-brand-graphite hover:text-brand-accent hover:border-brand-accent transition-colors"
                          title="View on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with 3D CAD Upload & Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-graphite/60 backdrop-blur-xs">
          <div className="bg-white border border-brand-border rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div>
                <span className="text-[10px] font-mono text-brand-accent uppercase font-bold tracking-wider">
                  {modalProduct.id ? 'Product Editor & 3D CAD Config' : 'Catalog Expansion'}
                </span>
                <h3 className="text-xl font-extrabold text-brand-graphite">
                  {modalProduct.id ? `Edit: ${modalProduct.name}` : 'Add New Robotics Unit'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-brand-muted hover:text-brand-graphite hover:bg-brand-softGray transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Basic Info */}
              <div className="space-y-1">
                <label className="font-bold text-brand-graphite">Model Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hexapod Recon Swarm Scout Mk.II"
                  value={modalProduct.name}
                  onChange={(e) => setModalProduct({ ...modalProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-brand-graphite">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LF-BOT-HEX"
                    value={modalProduct.sku}
                    onChange={(e) => setModalProduct({ ...modalProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none uppercase font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-graphite">Category *</label>
                  <select
                    value={modalProduct.category_id}
                    onChange={(e) => setModalProduct({ ...modalProduct, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-brand-graphite">Regular Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="15000"
                    value={modalProduct.regular_price}
                    onChange={(e) => setModalProduct({ ...modalProduct, regular_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-graphite">Sale Price (Optional BDT)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="13500"
                    value={modalProduct.sale_price}
                    onChange={(e) => setModalProduct({ ...modalProduct, sale_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-brand-graphite">Inventory Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={modalProduct.stock_quantity}
                    onChange={(e) => setModalProduct({ ...modalProduct, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-graphite">Primary Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={modalProduct.image_url}
                    onChange={(e) => setModalProduct({ ...modalProduct, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* 3D Model Configuration Section */}
              <div className="p-4 rounded-2xl bg-brand-softGray/80 border border-brand-border space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                  <div className="flex items-center gap-1.5 font-bold text-brand-graphite">
                    <Bot className="w-4 h-4 text-brand-accent" />
                    <span>3D Model &amp; Interactive WebGL CAD View</span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded">
                    Hardware 60 FPS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select 3D Preset */}
                  <div className="space-y-1">
                    <label className="font-bold text-brand-graphite">Option 1: Choose 3D Preset</label>
                    <select
                      value={modalProduct.model_3d_format === 'preset' ? modalProduct.model_3d_url : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setModalProduct((prev) => ({
                          ...prev,
                          model_3d_url: val,
                          model_3d_format: val ? 'preset' : null,
                        }));
                        setUploadSuccessMsg(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-brand-border focus:border-brand-accent focus:outline-none"
                    >
                      {PRESET_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upload 3D File */}
                  <div className="space-y-1">
                    <label className="font-bold text-brand-graphite">
                      Option 2: Upload Custom 3D (.glb, .gltf, .stl)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".glb,.gltf,.stl,.obj"
                        disabled={isUploading3D}
                        onChange={handleFileUpload}
                        className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-brand-accentHover cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Status / Clear */}
                {isUploading3D && (
                  <div className="flex items-center gap-2 text-xs text-brand-accent font-mono animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading 3D model asset to server storage...</span>
                  </div>
                )}

                {uploadSuccessMsg && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{uploadSuccessMsg}</span>
                  </div>
                )}

                {/* Current 3D Path info and remove button */}
                {modalProduct.model_3d_url && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-brand-border text-[11px] font-mono">
                    <div className="truncate max-w-sm">
                      <span className="text-brand-muted">Active 3D Source: </span>
                      <span className="text-brand-accent font-bold">{modalProduct.model_3d_url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setModalProduct((prev) => ({
                          ...prev,
                          model_3d_url: '',
                          model_3d_format: null,
                        }))
                      }
                      className="text-rose-500 hover:text-rose-700 flex items-center gap-1 font-bold"
                      title="Clear 3D model"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                )}

                {/* Real-time 3D Model Live Preview */}
                <div className="pt-2">
                  <div className="text-[10px] font-mono text-brand-muted uppercase font-bold tracking-wider mb-1.5">
                    Live 3D CAD Preview:
                  </div>
                  {modalProduct.model_3d_url ? (
                    <div className="relative rounded-2xl overflow-hidden border border-brand-border">
                      <RobotViewer3D
                        key={modalProduct.model_3d_url}
                        height="240px"
                        modelType={modalProduct.model_3d_url}
                        modelUrl={
                          modalProduct.model_3d_format === 'preset' ? null : modalProduct.model_3d_url
                        }
                        productName={modalProduct.name || 'Preview Unit'}
                        showControls={true}
                        showTelemetry={false}
                      />
                    </div>
                  ) : (
                    <div className="h-32 rounded-2xl bg-white border border-dashed border-brand-border flex flex-col items-center justify-center text-center p-4 text-brand-muted">
                      <Box className="w-8 h-8 text-brand-muted/40 mb-1" />
                      <span className="font-semibold text-xs">No 3D Model Selected</span>
                      <span className="text-[10px]">
                        Choose a preset above or upload a .glb model to see real-time 3D rendering.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-graphite">Short Description</label>
                <textarea
                  rows="2"
                  placeholder="Key features, onboard microcontrollers, primary use cases..."
                  value={modalProduct.short_description}
                  onChange={(e) => setModalProduct({ ...modalProduct, short_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-brand-softGray border border-brand-border focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={modalProduct.is_featured}
                  onChange={(e) => setModalProduct({ ...modalProduct, is_featured: e.target.checked })}
                  className="rounded text-brand-accent focus:ring-0"
                />
                <label htmlFor="is_featured" className="font-bold text-brand-graphite cursor-pointer">
                  Feature this unit on Storefront Homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold border border-brand-border hover:bg-brand-softGray"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading3D}
                  className="px-5 py-2 rounded-xl font-semibold bg-brand-accent text-white hover:bg-brand-accentHover shadow-glow-sm disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : modalProduct.id
                    ? 'Update Product & 3D Model'
                    : 'Create Robot Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
