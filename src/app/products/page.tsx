"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { Product, ProductCategory } from "@/types";

const CATEGORIES: (ProductCategory | "All")[] = [
  "All",
  "Wall Hangings",
  "Hair Bows",
  "Dreamcatchers",
];

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    async function loadProducts() {
      try {
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
    }
    loadProducts();
  }, []);

  // Update category when URL query changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">
          Handmade Catalog
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-content-primary mt-2">
          Our Handcrafted <span className="text-gradient">Creations</span>
        </h1>
        <p className="text-content-secondary text-sm mt-3">
          Explore personalized calendar hoops, embroidered hair bows, and bohemian dreamcatchers made with artisanal precision.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 mb-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, styles..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-primary placeholder-content-muted focus:outline-none focus:border-pink-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-content-muted hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3.5 py-2.5 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500/50 transition-colors cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-brand-violet to-brand-pink text-white shadow-glow"
                    : "bg-surface hover:bg-surface-hover text-content-secondary hover:text-content-primary border border-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-content-muted mb-6 px-1">
        <span>
          Showing <strong className="text-content-primary">{filteredProducts.length}</strong> items
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </span>
        {(searchQuery || selectedCategory !== "All" || sortBy !== "featured") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSortBy("featured");
            }}
            className="text-pink-300 hover:text-white underline underline-offset-4"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 h-96 animate-pulse space-y-4">
              <div className="aspect-square bg-surface-secondary rounded-xl" />
              <div className="h-4 bg-surface-secondary rounded w-3/4" />
              <div className="h-3 bg-surface-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 glass-card rounded-3xl p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mx-auto mb-4 text-content-muted">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl text-content-primary mb-2">
            No creations found
          </h3>
          <p className="text-xs text-content-secondary mb-6">
            We couldn't find any handmade pieces matching your current filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="btn-primary px-6 py-2.5 rounded-xl text-xs font-medium"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 text-center">
          <div className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-content-muted">Loading handcrafted catalog...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
