"use client";

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MoreVertical, Edit, Trash2, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MyListingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    async function getListings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('listings')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setListings(data);
      }
      setLoading(false);
    }
    getListings();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">My Listings</h1>
            <p className="text-slate-500 mt-2 text-left">Manage and track your active marketplace items.</p>
          </div>
          <Link 
            href="/sell"
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" />
            <span>Create New</span>
          </Link>
        </div>

        {listings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
              <Package className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No listings found</h2>
            <p className="text-slate-500 max-w-md mx-auto mt-2">
              You haven't listed any items for sale yet. Start your selling journey today!
            </p>
            <Link 
              href="/sell" 
              className="mt-8 inline-block px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              List Your First Item
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  {listing.images && listing.images[0] ? (
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{listing.category}</span>
                    <span className="font-extrabold text-slate-900">${listing.price}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1 mb-6 text-left">{listing.title}</h3>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <Link 
                      href={`/listings/${listing.id}`}
                      className="text-sm font-bold text-slate-400 hover:text-slate-900 flex items-center space-x-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
