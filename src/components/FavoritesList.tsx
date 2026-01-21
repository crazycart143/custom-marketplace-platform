"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import ListingCard from './ListingCard';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchFavorites() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          listing_id,
          listing:listing_id (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
      } else {
        setFavorites(data?.map(f => f.listing) || []);
      }
      setLoading(false);
    }
    fetchFavorites();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="font-black text-slate-900">No favorites yet</h3>
        <p className="text-slate-500 text-sm mt-1 font-medium">Items you heart will appear here.</p>
        <Link href="/browse" className="mt-4 inline-block text-indigo-600 font-bold text-sm hover:underline">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {favorites.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
