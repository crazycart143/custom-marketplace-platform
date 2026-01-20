"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Star, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    full_name: string;
    avatar_url: string;
  };
}

export default function ReviewSection({ sellerId, listingId }: { sellerId: string, listingId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:profiles!reviewer_id (full_name, avatar_url)
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (data) setReviews(data as any);
      setLoading(false);
    }
    fetchReviews();
  }, [sellerId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to leave a review.");
        return;
      }

      if (user.id === sellerId) {
        toast.error("You cannot review yourself.");
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: user.id,
          seller_id: sellerId,
          listing_id: listingId,
          rating,
          comment
        })
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:profiles!reviewer_id (full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setReviews(prev => [data as any, ...prev]);
      setShowForm(false);
      setComment("");
      toast.success("Review submitted!");
    } catch (error: any) {
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-12 pt-12 border-t border-slate-100 text-left">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            Seller Reviews
            {averageRating && (
              <span className="ml-4 px-3 py-1 bg-amber-50 text-amber-600 text-sm font-black rounded-full flex items-center">
                <Star className="w-3 h-3 fill-amber-600 mr-1" />
                {averageRating}
              </span>
            )}
          </h3>
          <p className="text-slate-500 font-medium">{reviews.length} total reviews for this seller</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
          >
            Leave a Review
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="mb-12 bg-slate-50 p-8 rounded-[32px] border border-slate-100"
          >
            <div className="mb-6">
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`p-2 rounded-xl transition-all ${rating >= s ? 'text-amber-500 scale-110' : 'text-slate-300'}`}
                  >
                    <Star className={`w-8 h-8 ${rating >= s ? 'fill-amber-500' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="How was your experience with this seller?"
                className="w-full px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium min-h-[120px]"
              />
            </div>
            <div className="flex space-x-4">
              <button 
                type="submit"
                disabled={submitting}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Post Review'}
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-4 bg-white text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-[32px]" />)
        ) : reviews.length === 0 ? (
          <div className="bg-slate-50 p-12 rounded-[32px] text-center border border-dashed border-slate-200">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-bold">No reviews for this seller yet.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden">
                    {review.reviewer.avatar_url ? (
                      <img src={review.reviewer.avatar_url} alt={review.reviewer.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm leading-none mb-1">{review.reviewer.full_name || 'Anonymous'}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
