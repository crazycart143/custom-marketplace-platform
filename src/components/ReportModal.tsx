"use client";

import React, { useState } from 'react';
import { X, Flag, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ReportModal({ listingId, isOpen, onClose }: any) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to report a listing");
        return;
      }

      const { error } = await supabase
        .from('reports')
        .insert({
          listing_id: listingId,
          reporter_id: user.id,
          reason: reason,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Listing reported. Thank you for keeping our marketplace safe!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = [
    "Prohibited item",
    "Misleading information",
    "Scam or fraud",
    "Offensive content",
    "Duplicate listing",
    "Other"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 text-left">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                    <Flag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">Report Listing</h2>
                    <p className="text-slate-500 text-sm font-medium">Why are you reporting this?</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3">
                  {reasons.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                        reason === r 
                          ? 'border-red-600 bg-red-50 text-red-600' 
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      <span>{r}</span>
                      {reason === r && <AlertTriangle className="w-4 h-4" />}
                    </button>
                  ))}
                </div>

                {reason === "Other" && (
                  <textarea
                    required
                    rows={3}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 font-medium text-slate-900 focus:border-red-600 focus:bg-white transition-all outline-none resize-none"
                    placeholder="Please specify..."
                  />
                )}

                <div className="flex flex-col space-y-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !reason}
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <span>Submit Report</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
