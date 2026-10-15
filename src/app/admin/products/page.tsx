"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Product, ProductCategory } from "@/types";
import { formatINR } from "@/lib/utils";

const SAMPLE_PRESET_IMAGES = [
  "/images/products/calendar-hoop.jpg",
  "/images/products/hair-bows-linen.jpg",
  "/images/products/boho-dreamcatcher.jpg",
  "/images/products/couple-name-hoop.jpg",
  "/images/products/velvet-bow-set.jpg",
  "/images/products/celestial-moon-dreamcatcher.jpg",
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Wall Hangings");
  const [stock, setStock] = useState("10");
  const [imageUrl, setImageUrl] = useState("/images/products/calendar-hoop.jpg");
  const [featured, setFeatured] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Wall Hangings");
    setStock("10");
    setImageUrl("/images/products/calendar-hoop.jpg");
    setFeatured(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setStock(product.stock.toString());
    setImageUrl(product.images?.[0] || "/images/products/calendar-hoop.jpg");
    setFeatured(Boolean(product.featured));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !description.trim() || !price || !stock) {
      setFormError("All fields are required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
        images: [imageUrl],
        featured,
      };

      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to update product (${res.status})`);
        }
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to create product (${res.status})`);
        }
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      setFormError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmId(null);
        await fetchProducts();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-content-primary">
            Products <span className="text-gradient">Catalog</span>
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Manage your handmade creations, pricing, stock levels, and gallery images.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
          />
        </div>
        <span className="text-xs text-content-muted">
          Total Products: <strong className="text-content-primary">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface/70 text-content-secondary border-b border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-content-muted">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-content-muted">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const img = product.images?.[0] || "/images/products/calendar-hoop.jpg";
                  return (
                    <tr key={product.id} className="hover:bg-surface-hover/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-secondary flex-shrink-0">
                            <Image src={img} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-medium text-content-primary block line-clamp-1">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-content-muted line-clamp-1 max-w-xs">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-surface border border-white/10 text-pink-300">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-content-primary">
                        {formatINR(product.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-semibold ${
                            product.stock <= 3 ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {product.featured ? (
                          <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/30">
                            Yes
                          </span>
                        ) : (
                          <span className="text-[10px] text-content-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg bg-surface text-content-secondary hover:text-content-primary hover:bg-surface-hover border border-white/5 transition-colors"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 rounded-lg bg-surface text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-white/5 transition-colors"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-display text-lg font-semibold text-content-primary">
                {editingProduct ? "Edit Product" : "Add New Handmade Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-content-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Personalized Anniversary Calendar Hoop"
                  className="w-full p-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500 cursor-pointer"
                  >
                    <option value="Wall Hangings">Wall Hangings</option>
                    <option value="Hair Bows">Hair Bows</option>
                    <option value="Dreamcatchers">Dreamcatchers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1899"
                    className="w-full p-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="10"
                    className="w-full p-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-content-primary">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded text-pink-500"
                    />
                    <span>Show in Featured Showcase</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Product Image (Preset or URL)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                    placeholder="/images/products/calendar-hoop.jpg"
                  />
                </div>
                {/* Preset image selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setImageUrl(preset)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-transform ${
                        imageUrl === preset ? "border-pink-500 scale-105" : "border-white/10 opacity-60"
                      }`}
                    >
                      <Image src={preset} alt="preset" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the stitches, thread colors, materials, dimensions..."
                  className="w-full p-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface text-xs text-content-secondary hover:text-content-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold shadow-glow"
                >
                  {saving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full border border-white/10 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-content-primary">
              Delete Product?
            </h3>
            <p className="text-xs text-content-secondary">
              Are you sure you want to remove this handcrafted creation from your catalog? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-secondary hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
