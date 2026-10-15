"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "Wall Hangings",
    eventDate: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase tracking-widest font-semibold text-pink-400">
          Get in Touch
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-content-primary mt-2">
          Let's Create Something <span className="text-gradient">Special</span>
        </h1>
        <p className="text-content-secondary text-sm mt-3">
          Have a specific anniversary date, bridal theme, or custom dreamcatcher design in mind? Reach out to our artisans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-display text-lg font-semibold text-content-primary">
              Studio & Workshop Details
            </h3>

            <div className="space-y-4 text-xs text-content-secondary">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/15 flex items-center justify-center text-pink-400 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-content-primary">Artisan Studio Address</h4>
                  <p className="mt-0.5">123, Craft Street, Ahmedabad, Gujarat 380001, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-content-primary">Phone & WhatsApp Support</h4>
                  <a href="tel:+9132176543210" className="hover:text-pink-300 transition-colors mt-0.5 block">
                    +91 98765 43210
                  </a>
                  <p className="text-[11px] text-content-muted">Mon - Sat, 10:00 AM - 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-content-primary">Email Inquiries</h4>
                  <a href="mailto:hello@kansaracreation.com" className="hover:text-pink-300 transition-colors mt-0.5 block">
                    hello@kansaracreation.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center text-pink-300 flex-shrink-0">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-content-primary">Official Instagram Handle</h4>
                  <a
                    href="https://www.instagram.com/kansara_creation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-300 transition-colors mt-0.5 block"
                  >
                    @kansara_creation
                  </a>
                  <p className="text-[11px] text-content-muted">Direct Message us for quick design preview</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-pink-300">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Turnaround Time</span>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              Standard orders are hand-stitched in 3-5 business days. Express wedding orders can be prioritized upon request.
            </p>
          </div>
        </div>

        {/* Custom Order Request Form */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-content-primary">
                  Inquiry Received!
                </h3>
                <p className="text-xs text-content-secondary max-w-md mx-auto">
                  Thank you, {formData.name}! Our head artisan will review your design request and get back to you via WhatsApp at +91 {formData.phone} within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-medium mt-4"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-content-primary mb-2">
                  Request a Custom Commission
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="E.g., Pooja Sharma"
                      className="w-full p-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full p-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="pooja@example.com"
                      className="w-full p-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-content-secondary mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500 cursor-pointer"
                    >
                      <option value="Wall Hangings">Anniversary / Couple Hoop Art</option>
                      <option value="Hair Bows">Embroidered Hair Bows & Clips</option>
                      <option value="Dreamcatchers">Boho Macrame Dreamcatcher</option>
                      <option value="Bulk/Gift">Corporate / Wedding Return Favors</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Event Date or Needed By (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Customization Details & Vision *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your design, names to be stitched, preferred color palette, or any reference from our Instagram..."
                    className="w-full p-3 rounded-xl bg-surface border border-white/10 text-xs text-content-primary placeholder-content-muted focus:outline-none focus:border-pink-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-glow"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Commission Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
