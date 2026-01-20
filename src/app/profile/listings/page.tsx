"use client";

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Edit, Trash2, ExternalLink, Plus, CheckCircle2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MyListingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getListings = async () => {
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
  };

  useEffect(() => {
    getListings();
  }, [supabase]);

  const updateStatus = async (id: string, status: 'active' | 'sold' | 'hidden') => {
    const { error } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update status.");
    } else {
      toast.success(`Listing marked as ${status}!`);
      setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    }
    setActiveMenu(null);
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete listing.");
    } else {
      toast.success("Listing deleted successfully.");
      setListings(prev => prev.filter(l => l.id !== id));
    }
    setActiveMenu(null);
  };

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
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Listings</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage and track your active marketplace items.</p>
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
            className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
              <Package className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No listings found</h2>
            <p className="text-slate-500 max-w-md mx-auto mt-2 font-medium">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
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
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      listing.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : listing.status === 'sold'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === listing.id ? null : listing.id)}
                        className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-slate-600 hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      <AnimatePresence>
                        {activeMenu === listing.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20"
                          >
                            {listing.status === 'active' && (
                              <button 
                                onClick={() => updateStatus(listing.id, 'sold')}
                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center space-x-2"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Mark as Sold</span>
                              </button>
                            )}
                            {listing.status === 'sold' && (
                              <button 
                                onClick={() => updateStatus(listing.id, 'active')}
                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center space-x-2"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Relist Item</span>
                              </button>
                            )}
                            <Link 
                              href={`/profile/listings/${listing.id}/edit`}
                              className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center space-x-2"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit Details</span>
                            </Link>
                            <button 
                              onClick={() => deleteListing(listing.id)}
                              className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Listing</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="p-8 grow flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{listing.category}</span>
                    <span className="font-black text-slate-900 text-lg">${listing.price.toLocaleString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-6 text-left grow">
                    {listing.title}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Views</span>
                        <span className="font-bold text-slate-900 text-sm">0</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Chats</span>
                        <span className="font-bold text-slate-900 text-sm">0</span>
                      </div>
                    </div>
                    <Link 
                      href={`/listings/${listing.id}`}
                      className="text-sm font-black text-slate-400 hover:text-indigo-600 flex items-center space-x-1 transition-colors"
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
