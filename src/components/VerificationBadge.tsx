"use client";

import React from 'react';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export default function VerificationBadge({ isVerified, showText = true }: { isVerified: boolean, showText?: boolean }) {
  if (!isVerified) return null;

  return (
    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50">
      <ShieldCheck className="w-3 h-3" />
      {showText && <span className="text-[10px] font-black uppercase tracking-widest">Verified Student</span>}
    </div>
  );
}
