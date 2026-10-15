"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { Product } from "@/types";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 800);
  };

  const firstImage = product.images?.[0] || "/images/products/calendar-hoop.jpg";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-container group"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
        }}
        className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full preserve-3d"
      >
        {/* Image Container */}
        <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-surface-secondary">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category Pill */}
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md text-pink-300 border border-brand-pink/30 shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Stock Tag */}
          {product.stock <= 3 && product.stock > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Only {product.stock} left
              </span>
            </div>
          )}

          {/* Quick Actions Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="w-10 h-10 rounded-full bg-surface/90 text-content-primary flex items-center justify-center shadow-lg border border-white/20 transform scale-75 group-hover:scale-100 transition-transform">
              <Eye className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Content Details */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-display font-medium text-lg text-content-primary group-hover:text-pink-300 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-content-secondary text-xs mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-content-muted block">Price</span>
              <span className="font-semibold text-lg text-content-primary text-gradient">
                {formatINR(product.price)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                product.stock <= 0
                  ? "bg-surface-hover text-content-muted cursor-not-allowed border border-white/5"
                  : addedAnim
                  ? "bg-emerald-600 text-white shadow-glow"
                  : "btn-primary hover:shadow-glow-pink"
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${addedAnim ? "animate-bounce" : ""}`} />
              <span>{addedAnim ? "Added!" : product.stock <= 0 ? "Out of Stock" : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
