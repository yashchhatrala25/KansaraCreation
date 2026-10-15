"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Maximize2, ArrowRight } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import Lightbox, { LightboxImage } from "@/components/ui/Lightbox";

const GALLERY_ITEMS: LightboxImage[] = [
  {
    id: "g1",
    src: "/images/products/calendar-hoop.jpg",
    title: "Hand-Stitched Anniversary Calendar Hoop",
    category: "Wall Hangings",
    description: "Detailed shot of September anniversary date circled in red embroidery thread surrounded by pastel French knots.",
  },
  {
    id: "g2",
    src: "/images/products/hair-bows-linen.jpg",
    title: "Daisy Meadow Natural Linen Bows",
    category: "Hair Bows",
    description: "Pair of hand-embroidered wild daisy linen hair bows styled with natural lavender sprigs.",
  },
  {
    id: "g3",
    src: "/images/products/boho-dreamcatcher.jpg",
    title: "Bohemian Dip-Dyed Rose Quartz Dreamcatcher",
    category: "Dreamcatchers",
    description: "Intricately woven mandala lace center with rose quartz and ombre dip-dyed macrame tassels.",
  },
  {
    id: "g4",
    src: "/images/products/couple-name-hoop.jpg",
    title: "Aarav & Priya Gold Monogram Hoop",
    category: "Wall Hangings",
    description: "Personalized wedding hoop featuring gold thread calligraphy and eucalyptus laurel wreath.",
  },
  {
    id: "g5",
    src: "/images/products/velvet-bow-set.jpg",
    title: "Artisanal Velvet Honeybee Trio",
    category: "Hair Bows",
    description: "Plush velvet hair clips in sage, rose, and mustard with hand-stitched bees and wildflowers.",
  },
  {
    id: "g6",
    src: "/images/products/celestial-moon-dreamcatcher.jpg",
    title: "Celestial Dusk Crescent Moon Hanging",
    category: "Dreamcatchers",
    description: "Golden crescent moon frame with iridescent beads and twilight purple ombre silk fringe.",
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const categories = ["All", "Wall Hangings", "Hair Bows", "Dreamcatchers"];

  const filteredItems = selectedCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentIdx(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">
          Visual Showcase
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-content-primary mt-2">
          The Artisan <span className="text-gradient">Gallery</span>
        </h1>
        <p className="text-content-secondary text-sm mt-3">
          A visual collection of custom orders, intricate stitches, and handmade keepsakes created in our studio.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-brand-violet to-brand-pink text-white shadow-glow"
                  : "bg-surface hover:bg-surface-hover text-content-secondary hover:text-content-primary border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-Style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="group relative rounded-2xl overflow-hidden glass-card border border-white/10 aspect-[4/5] cursor-pointer"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-pink-300">
                {item.category}
              </span>
              <h3 className="font-display font-medium text-lg text-white mt-1">
                {item.title}
              </h3>
              <p className="text-xs text-content-secondary line-clamp-2 mt-1">
                {item.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-white/90">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Click to view in Lightbox</span>
              </div>
            </div>

            {/* Quick Badge */}
            <div className="absolute top-3 left-3 z-10 group-hover:opacity-0 transition-opacity">
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md text-content-secondary border border-white/10">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Instagram Banner */}
      <div className="mt-20 p-8 rounded-3xl glass-card border border-white/10 text-center max-w-2xl mx-auto space-y-4">
        <InstagramIcon className="w-8 h-8 text-pink-400 mx-auto" />
        <h3 className="font-display text-xl font-semibold text-content-primary">
          Want to see more custom creations?
        </h3>
        <p className="text-xs text-content-secondary max-w-md mx-auto">
          We post daily stitch tutorials, packaging stories, and client feedback reels on Instagram.
        </p>
        <div>
          <a
            href="https://www.instagram.com/kansara_creation/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-medium"
          >
            <span>Visit @kansara_creation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      <Lightbox
        images={filteredItems}
        currentIndex={currentIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
