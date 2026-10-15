"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Sparkles,
  Heart,
  Minus,
  Plus,
  CheckCircle2,
  Gift,
  HelpCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { formatINR } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);

          // Fetch related in same category
          const allRes = await fetch(`/api/products?category=${encodeURIComponent(data.category)}`);
          if (allRes.ok) {
            const allData = await allRes.json();
            setRelated(allData.filter((p: Product) => p.id !== id).slice(0, 3));
          }
        } else {
          router.push("/products");
        }
      } catch (err) {
        console.error("Failed to load product detail", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadProduct();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 aspect-square bg-surface-secondary rounded-3xl" />
          <div className="lg:col-span-6 space-y-6">
            <div className="h-6 bg-surface-secondary rounded w-1/4" />
            <div className="h-10 bg-surface-secondary rounded w-3/4" />
            <div className="h-8 bg-surface-secondary rounded w-1/3" />
            <div className="h-24 bg-surface-secondary rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h2 className="text-xl text-content-primary">Product not found</h2>
        <Link href="/products" className="btn-primary mt-4 inline-block px-6 py-2.5 rounded-xl text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ["/images/products/calendar-hoop.jpg"];

  const handleAddToCart = () => {
    addToCart(product, quantity, customNote.trim() || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden glass-card border border-white/10 bg-surface-secondary">
            <Image
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {/* Category tag */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-xs font-medium tracking-wide uppercase px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-pink-300 border border-brand-pink/30">
                {product.category}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-pink-500 scale-105 shadow-glow-pink"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-violet">
                Handmade in Ahmedabad
              </span>
              {product.stock > 0 ? (
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  Made to Order
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-content-primary">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-bold text-gradient">
                {formatINR(product.price)}
              </span>
              <span className="text-xs text-content-muted">Inclusive of all taxes & free delivery</span>
            </div>

            {/* Description */}
            <p className="text-content-secondary text-sm leading-relaxed border-t border-b border-white/5 py-4">
              {product.description}
            </p>

            {/* Customization Note input */}
            <div className="p-4 rounded-2xl bg-surface/80 border border-white/10 space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-pink-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalization / Custom Note (Optional)</span>
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="E.g., Anniversary Date: 21 Sept 2024, Names: Sarah & David, Preferred thread colors..."
                rows={2}
                className="w-full p-3 rounded-xl bg-background border border-white/10 text-xs text-content-primary placeholder-content-muted focus:outline-none focus:border-pink-500/50 resize-none"
              />
              <p className="text-[10px] text-content-muted">
                Our artisans will hand-stitch these custom details with precision.
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center rounded-xl bg-surface border border-white/10 p-1 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-content-secondary hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-semibold text-content-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="p-2.5 text-content-secondary hover:text-content-primary hover:bg-surface-hover rounded-lg transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 px-6 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-glow ${
                  added ? "bg-emerald-600 text-white" : "btn-primary hover:shadow-glow-pink"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? "Added to Bag!" : `Add to Bag • ${formatINR(product.price * quantity)}`}</span>
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5 text-xs text-content-secondary">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-pink-400" />
              <span>Free Delivery in India</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-amber" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span>Artisan Gift Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>100% Handcrafted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-24 pt-16 border-t border-white/10">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-violet">
              More from this category
            </span>
            <h3 className="font-display text-2xl font-semibold text-content-primary mt-1">
              You May Also Love
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
