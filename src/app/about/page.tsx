import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, Scissors, Compass, Gift, ArrowRight } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">
          The Artisanal Journey
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-content-primary">
          The Soul of <span className="text-gradient">Handmade</span>
        </h1>
        <p className="text-content-secondary text-sm sm:text-base leading-relaxed">
          Kansara Creation was born in Ahmedabad, Gujarat out of a heartfelt passion for reviving traditional textile arts through contemporary personalized decor.
        </p>
      </div>

      {/* Story & Image Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border border-white/10">
          <Image
            src="/images/products/couple-name-hoop.jpg"
            alt="Handmade embroidery craftsmanship"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-violet">
            Our Heritage
          </span>
          <h2 className="font-display text-3xl font-semibold text-content-primary">
            Every Stitch Tells Your Story
          </h2>
          <p className="text-content-secondary text-xs sm:text-sm leading-relaxed">
            In a fast-paced world dominated by synthetic mass production, we slow down. Each hoop begins with raw natural linen cloth stretched over polished wood. Our artisans sketch custom lettering by hand before layering thousands of individual needle stitches.
          </p>
          <p className="text-content-secondary text-xs sm:text-sm leading-relaxed">
            Whether it's an anniversary calendar hoop with the wedding date circled in scarlet floss, or an intricate macrame dreamcatcher with dip-dyed rose-gold tassels, each piece is built to be a family heirloom passed down through generations.
          </p>
          <div className="pt-2">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-medium">
              <span>Explore Our Works</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center text-purple-300">
            <Scissors className="w-6 h-6" />
          </div>
          <h3 className="font-display font-medium text-lg text-content-primary">
            Artisanal Precision
          </h3>
          <p className="text-content-secondary text-xs leading-relaxed">
            Zero machines. Every petal, bead, leaf, and tassel is measured, knotted, and hand-embroidered by women artisans.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-pink/20 border border-brand-pink/30 flex items-center justify-center text-pink-300">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-display font-medium text-lg text-content-primary">
            Thoughtful Materials
          </h3>
          <p className="text-content-secondary text-xs leading-relaxed">
            We use sustainable bamboo hoops, pure cotton thread, unbleached linen, and natural crystals that respect the earth.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-amber/20 border border-brand-amber/30 flex items-center justify-center text-amber-300">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="font-display font-medium text-lg text-content-primary">
            Keepsake Memories
          </h3>
          <p className="text-content-secondary text-xs leading-relaxed">
            Commemorating milestones — weddings, anniversaries, housewarmings, and first baby birthdays with personalized artistry.
          </p>
        </div>
      </div>

      {/* Instagram Community CTA */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card border border-white/10 text-center max-w-3xl mx-auto space-y-4">
        <InstagramIcon className="w-10 h-10 text-pink-400 mx-auto" />
        <h3 className="font-display text-2xl font-semibold text-content-primary">
          Join our 10,000+ Handcraft Lovers
        </h3>
        <p className="text-xs text-content-secondary max-w-lg mx-auto">
          Follow our daily stories, live stitch videos, and customer reveal reels on Instagram.
        </p>
        <div>
          <a
            href="https://www.instagram.com/kansara_creation/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-semibold"
          >
            <span>Follow @kansara_creation</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
