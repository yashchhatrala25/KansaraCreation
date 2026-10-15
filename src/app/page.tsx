import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
  Star,
  Compass,
  Scissors,
  Gift,
} from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import HoopHero3D from "@/components/3d/HoopHero3D";
import ProductCard from "@/components/ui/ProductCard";
import { db } from "@/lib/db";
import { Product } from "@/types";

export const revalidate = 0;

export default async function HomePage() {
  const allProducts = await db.product.findMany();
  const featured = allProducts.filter((p) => p.featured).slice(0, 6);

  // Parse images safely
  const formattedFeatured: Product[] = featured.map((p) => {
    let images: string[] = [];
    try {
      images = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
    } catch {
      images = [p.images || "/images/products/calendar-hoop.jpg"];
    }
    return {
      ...p,
      images,
      category: p.category as any,
    };
  });

  const categories = [
    {
      name: "Wall Hangings",
      description: "Custom anniversary calendar hoops & couple initials",
      image: "/images/products/calendar-hoop.jpg",
      href: "/products?category=Wall+Hangings",
      count: allProducts.filter((p) => p.category === "Wall Hangings").length,
    },
    {
      name: "Hair Bows",
      description: "Delicate hand-embroidered linen & velvet bows",
      image: "/images/products/hair-bows-linen.jpg",
      href: "/products?category=Hair+Bows",
      count: allProducts.filter((p) => p.category === "Hair Bows").length,
    },
    {
      name: "Dreamcatchers",
      description: "Boho macrame woven webs with dip-dyed fringe",
      image: "/images/products/boho-dreamcatcher.jpg",
      href: "/products?category=Dreamcatchers",
      count: allProducts.filter((p) => p.category === "Dreamcatchers").length,
    },
  ];

  const testimonials = [
    {
      name: "Pooja Sharma",
      location: "Mumbai",
      comment:
        "The anniversary calendar hoop was the star of our wedding anniversary! The red circle on our date and the delicate French knots are pure magic. Thank you Kansara Creation!",
      rating: 5,
      item: "Personalized Anniversary Calendar Hoop",
    },
    {
      name: "Ananya Iyer",
      location: "Bangalore",
      comment:
        "The linen embroidered hair bows are so soft and gentle on my hair! The daisy stitching is so fine and neat. Ordered another pair for my sister.",
      rating: 5,
      item: "Daisy Meadow Linen Hair Bows",
    },
    {
      name: "Rohan Patel",
      location: "Ahmedabad",
      comment:
        "Incredible craftsmanship! The dip-dyed dreamcatcher hangs gracefully in our living room. You can immediately feel the warmth and artisan touch.",
      rating: 5,
      item: "Bohemian Dip-Dyed Dreamcatcher",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-32">
        {/* Background Gradients */}
        <div className="ambient-glow glow-purple top-10 left-1/2 -translate-x-1/2 -z-10 opacity-30" />
        <div className="ambient-glow glow-pink top-40 right-10 -z-10 opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-glass border border-brand-violet/30 shadow-glow backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-brand-pink animate-pulse" />
                <span className="text-xs font-medium text-pink-300 tracking-wide uppercase">
                  Bespoke Handcrafted Embroidery
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-content-primary leading-[1.15]">
                Where Every Thread <br className="hidden sm:inline" />
                Celebrates <span className="text-gradient">Your Story</span>
              </h1>

              {/* Subtitle */}
              <p className="text-content-secondary text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Individually handcrafted embroidery hoop wall hangings, botanical hair bows, and bohemian dreamcatchers. Customized with anniversary calendars, couple names, and heartfelt details.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-pink"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-medium text-content-primary bg-surface/80 hover:bg-surface-hover border border-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 text-brand-amber" />
                  <span>Request Custom Piece</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-violet/15 flex items-center justify-center text-brand-violet flex-shrink-0">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-content-primary">100% Handmade</h4>
                    <p className="text-[10px] text-content-muted">Hand-stitched</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center text-pink-400 flex-shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-content-primary">Free Shipping</h4>
                    <p className="text-[10px] text-content-muted">Across India</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-content-primary">COD Available</h4>
                    <p className="text-[10px] text-content-muted">Pay at doorstep</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3D Object with Mouse Parallax */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <HoopHero3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE */}
      <section className="py-20 bg-background-secondary/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">
              Curated Collections
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-content-primary mt-2">
              Handcrafted for Every Occasion
            </h2>
            <p className="text-content-secondary text-sm mt-3">
              From wedding vows to personal heirlooms, discover our signature artisan categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden glass-card border border-white/10 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-secondary">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
                <div className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-medium text-content-primary group-hover:text-pink-300 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-content-muted bg-surface/80 px-2.5 py-1 rounded-full border border-white/5">
                      {cat.count} items
                    </span>
                  </div>
                  <p className="text-content-secondary text-xs mt-2 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-medium text-pink-300 group-hover:translate-x-1 transition-transform">
                    <span>Browse Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-violet">
              Artisan Spotlight
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-content-primary mt-2">
              Featured Creations
            </h2>
            <p className="text-content-secondary text-sm mt-2">
              Our most cherished hand-embroidered keepsakes and accessories.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-pink-300 hover:text-white transition-colors"
          >
            <span>View All Products ({allProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {formattedFeatured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. OUR CRAFTSMANSHIP & STORY */}
      <section className="py-20 bg-surface-secondary/40 border-y border-white/5 relative overflow-hidden">
        <div className="ambient-glow glow-amber top-1/2 left-0 -translate-y-1/2 opacity-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 glass-card">
              <Image
                src="/images/products/couple-name-hoop.jpg"
                alt="Artisan hand-embroidery process"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-surface/80 backdrop-blur-md border border-white/10">
                <p className="font-display italic text-sm text-content-primary">
                  "Every knot is sewn by hand, infusing each piece with intention and celebration."
                </p>
                <span className="text-[11px] text-pink-300 mt-1 block">
                  — Kansara Creation Artisans, Ahmedabad
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">
                The Handmade Promise
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-content-primary leading-tight">
                Crafted by Hand, <br />
                Treasured for a Lifetime
              </h2>
              <p className="text-content-secondary text-sm leading-relaxed">
                At Kansara Creation, we believe mass manufacturing can never replace the soul of handmade art. Based in Ahmedabad, Gujarat, we specialize in intricate French knot floral embroidery, personalized couple calendar hoops, and bohemian macrame.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-violet/20 border border-brand-violet/30 flex items-center justify-center text-purple-300 flex-shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-content-primary">Bespoke Personalization</h4>
                    <p className="text-xs text-content-secondary mt-0.5">
                      Customize wedding dates, couple names, birth details, or special color palettes to match your home decor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink/20 border border-brand-pink/30 flex items-center justify-center text-pink-300 flex-shrink-0">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-content-primary">Heirloom Quality Materials</h4>
                    <p className="text-xs text-content-secondary mt-0.5">
                      Natural unbleached linen, pure cotton floss, polished bamboo hoops, and raw crystal accents built to last decades.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-amber/20 border border-brand-amber/30 flex items-center justify-center text-amber-300 flex-shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-content-primary">Ready-to-Gift Packaging</h4>
                    <p className="text-xs text-content-secondary mt-0.5">
                      Each order is carefully wrapped in aesthetic tissue, tied with twine, and accompanied by a handwritten artisan note.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INSTAGRAM COMMUNITY SPOTLIGHT */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-pink-500/20 text-pink-300 text-xs font-medium mb-3">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Join Our Creative Community</span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-content-primary">
            Follow <span className="text-gradient">@kansara_creation</span>
          </h2>
          <p className="text-content-secondary text-sm mt-2">
            Watch work-in-progress reels, behind-the-scenes embroidery stitches, and newly finished custom orders.
          </p>
          <div className="mt-4">
            <a
              href="https://www.instagram.com/kansara_creation/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-glow-pink hover:opacity-90 transition-opacity"
            >
              <span>Follow on Instagram</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: "/images/products/calendar-hoop.jpg", caption: "Anniversary Date Hoop" },
            { img: "/images/products/hair-bows-linen.jpg", caption: "Botanical Linen Bows" },
            { img: "/images/products/boho-dreamcatcher.jpg", caption: "Rose Quartz Dreamcatcher" },
            { img: "/images/products/couple-name-hoop.jpg", caption: "Couple Monogram Embroidery" },
          ].map((item, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/kansara_creation/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-surface-secondary block"
            >
              <Image
                src={item.img}
                alt={item.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <InstagramIcon className="w-7 h-7 text-pink-400 mb-2" />
                <span className="text-xs font-medium text-white">{item.caption}</span>
                <span className="text-[10px] text-content-muted mt-1">View on Instagram</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 bg-background-secondary/60 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-amber">
              Customer Love
            </span>
            <h2 className="font-display text-3xl font-semibold text-content-primary mt-2">
              Words From Our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-content-secondary text-xs sm:text-sm leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <h4 className="text-sm font-semibold text-content-primary">{t.name}</h4>
                  <div className="flex items-center justify-between text-xs text-content-muted mt-0.5">
                    <span>{t.location}</span>
                    <span className="text-pink-300 text-[11px] font-medium">{t.item}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
