"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  id: string;
  src: string;
  title: string;
  category: string;
  description?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex] || images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-3 rounded-full bg-surface/80 text-white/80 hover:text-white hover:bg-surface border border-white/10 transition-colors"
        aria-label="Close Lightbox (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      <button
        onClick={onPrev}
        className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-surface/80 text-white/80 hover:text-white hover:bg-surface border border-white/10 transition-transform hover:scale-105"
        aria-label="Previous Image (Left Arrow)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={onNext}
        className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-surface/80 text-white/80 hover:text-white hover:bg-surface border border-white/10 transition-transform hover:scale-105"
        aria-label="Next Image (Right Arrow)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image & Caption */}
      <div className="relative max-w-4xl max-h-[85vh] w-full mx-4 flex flex-col items-center">
        <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-surface-secondary">
          <Image
            src={current.src}
            alt={current.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Caption Bar */}
        <div className="mt-4 text-center max-w-lg">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-brand-violet/20 text-pink-300 border border-brand-violet/30">
            {current.category}
          </span>
          <h3 className="font-display font-medium text-lg text-content-primary mt-2">
            {current.title}
          </h3>
          {current.description && (
            <p className="text-xs text-content-secondary mt-1">{current.description}</p>
          )}
          <span className="text-[11px] text-content-muted mt-2 block">
            {currentIndex + 1} of {images.length} • Use Arrow Keys to navigate
          </span>
        </div>
      </div>
    </div>
  );
}
