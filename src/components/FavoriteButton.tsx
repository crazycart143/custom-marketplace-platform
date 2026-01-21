"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  listingId: string;
  initialIsFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({ listingId, initialIsFavorited = false, className = "" }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkFavorite() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('listing_id', listingId)
        .eq('user_id', user.id)
        .single();

      if (data) setIsFavorited(true);
    }
    checkFavorite();
  }, [listingId, supabase]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }

    setIsLoading(true);

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', user.id);

      if (!error) {
        setIsFavorited(false);
        toast.success("Removed from favorites");
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ listing_id: listingId, user_id: user.id });

      if (!error) {
        setIsFavorited(true);
        toast.success("Added to favorites");
      }
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-3 rounded-2xl transition-all ${
        isFavorited 
          ? 'bg-red-50 text-red-500 scale-110' 
          : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 hover:bg-white'
      } ${className}`}
    >
      <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
    </button>
  );
}
