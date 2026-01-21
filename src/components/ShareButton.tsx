"use client";

import React from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareButton({ title, url }: { title: string, url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this listing on Studentify: ${title}`,
          url: url || window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url || window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="py-4 border-2 border-slate-100 text-slate-600 rounded-[20px] font-bold hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 w-full"
    >
      <Share2 className="w-5 h-5" />
      <span>Share</span>
    </button>
  );
}
