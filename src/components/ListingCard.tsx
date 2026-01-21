"use client";

import { motion } from "framer-motion";
import { Package, MapPin, Clock, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  created_at: string;
  type?: 'product' | 'service';
  pricing_model?: 'fixed' | 'hourly';
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const isService = listing.type === 'service';
  
  const formattedDate = new Date(listing.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full text-left"
    >
      <Link href={`/listings/${listing.id}`} className="relative h-64 overflow-hidden block">
        {listing.images && listing.images[0] ? (
          <img 
            src={listing.images[0]} 
            alt={listing.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
            <Package className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <span className="text-white font-bold text-sm flex items-center">
            View Details <ArrowRight className="ml-2 w-4 h-4" />
          </span>
        </div>
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-brand font-bold text-xs shadow-sm">
            {listing.category}
          </div>
          {isService && (
            <div className="bg-brand px-3 py-1 rounded-full text-white font-black text-[10px] shadow-sm flex items-center gap-1 uppercase tracking-wider">
              <GraduationCap className="w-3 h-3" />
              <span>Student Service</span>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton listingId={listing.id} />
        </div>
      </Link>

      <div className="p-6 flex flex-col grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-black tracking-tight">${listing.price.toLocaleString()}</span>
            {isService && listing.pricing_model === 'hourly' && (
              <span className="text-xs font-bold text-slate-400">/hr</span>
            )}
          </div>
          <div className="flex items-center text-slate-400 text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" />
            {formattedDate}
          </div>
        </div>
        
        <Link href={`/listings/${listing.id}`}>
          <h3 className="text-lg font-bold text-black group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-4 grow">
            {listing.title}
          </h3>
        </Link>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center text-slate-500 text-xs font-medium">
            <MapPin className="w-3 h-3 mr-1" />
            <span>Remote / Global</span>
          </div>
          <button className="text-brand hover:text-brand/80 font-bold text-sm">
            Quick View
          </button>
        </div>
      </div>
    </motion.div>
  );
}
