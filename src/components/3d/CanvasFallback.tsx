"use client";

import React from "react";
import Image from "next/image";

export default function CanvasFallback() {
  return (
    <div className="relative w-full h-[380px] sm:h-[480px] flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-brand-violet/30 via-brand-pink/30 to-brand-amber/20 blur-3xl" />

      {/* Decorative frame */}
      <div className="relative z-10 p-4 rounded-full border border-white/10 bg-surface-glass backdrop-blur-md shadow-2xl shadow-brand-violet/20 animate-float-slow">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-amber-800/40 shadow-inner">
          <Image
            src="/images/products/calendar-hoop.jpg"
            alt="Handcrafted Embroidery Hoop Wall Hanging"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Brass screw top simulation */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-sm shadow-md" />
      </div>
    </div>
  );
}
