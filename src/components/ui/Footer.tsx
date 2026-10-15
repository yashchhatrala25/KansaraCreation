"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Mail, Phone, MapPin, Sparkles } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

export default function Footer() {
  const pathname = usePathname();

  // Don't render customer footer on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative border-t border-white/10 bg-background-secondary pt-16 pb-12 overflow-hidden">
      {/* Background ambient glow */}
      <div className="ambient-glow glow-purple bottom-0 left-1/4 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-violet via-brand-pink to-brand-amber p-[2px]">
                <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                </div>
              </div>
              <span className="font-display font-semibold text-lg text-content-primary">
                Kansara <span className="text-gradient">Creation</span>
              </span>
            </Link>
            <p className="text-content-secondary text-xs leading-relaxed">
              Every thread tells a story. We handcraft personalized anniversary calendar hoops, heirloom embroidery wall hangings, aesthetic hair bows, and macrame dreamcatchers tailored for your cherished moments.
            </p>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/kansara_creation/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-pink-500/30 text-pink-300 hover:border-pink-400 hover:text-white transition-all shadow-sm"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>@kansara_creation</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-display text-sm font-semibold text-content-primary tracking-wide uppercase mb-4">
              Handmade Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-content-secondary">
              <li>
                <Link href="/products?category=Wall+Hangings" className="hover:text-pink-300 transition-colors">
                  Embroidery Calendar Hoops
                </Link>
              </li>
              <li>
                <Link href="/products?category=Wall+Hangings" className="hover:text-pink-300 transition-colors">
                  Couple Name Floral Hoops
                </Link>
              </li>
              <li>
                <Link href="/products?category=Hair+Bows" className="hover:text-pink-300 transition-colors">
                  Embroidered Linen Hair Bows
                </Link>
              </li>
              <li>
                <Link href="/products?category=Hair+Bows" className="hover:text-pink-300 transition-colors">
                  Velvet Ribbon Hair Clips
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dreamcatchers" className="hover:text-pink-300 transition-colors">
                  Boho Macrame Dreamcatchers
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dreamcatchers" className="hover:text-pink-300 transition-colors">
                  Crescent Moon Wall Hangings
                </Link>
              </li>
            </ul>
          </div>

          {/* Helpful Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-content-primary tracking-wide uppercase mb-4">
              Explore & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-content-secondary">
              <li>
                <Link href="/gallery" className="hover:text-pink-300 transition-colors">
                  Artisan Gallery & Showcase
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-pink-300 transition-colors">
                  Our Handmade Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-300 transition-colors">
                  Custom Orders & Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-pink-300 transition-colors">
                  Shopping Bag
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display text-sm font-semibold text-content-primary tracking-wide uppercase mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-xs text-content-secondary">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                <span>123, Craft Street, Ahmedabad, Gujarat 380001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <a href="tel:+9132176543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-violet flex-shrink-0" />
                <a href="mailto:hello@kansaracreation.com" className="hover:text-white transition-colors">
                  hello@kansaracreation.com
                </a>
              </li>
              <li className="pt-2 text-[11px] text-content-muted">
                Accepting custom orders for weddings, birthdays, and baby showers via Instagram DM and WhatsApp.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-content-muted gap-4">
          <p>© {new Date().getFullYear()} Kansara Creation. All rights reserved. Crafted with care in Gujarat, India.</p>
          <div className="flex items-center gap-1 text-content-secondary">
            <span>Handmade with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5 animate-pulse" />
            <span>for your special moments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
