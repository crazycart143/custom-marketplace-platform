"use client";

import React from 'react';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export default function VerificationBadge({ isVerified, showText = true }: { isVerified: boolean, showText?: boolean }) {
  if (!isVerified) return null;

  return (
    <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm shadow-emerald-100/50">
      <ShieldCheck className="w-3.5 h-3.5 fill-emerald-100" />
      {showText && <span className="text-[10px] font-black uppercase tracking-[1.5px] leading-none">Verified Student</span>}
    </div>
  );
}
