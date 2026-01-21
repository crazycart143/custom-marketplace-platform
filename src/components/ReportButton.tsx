"use client";

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import ReportModal from './ReportModal';

export default function ReportButton({ listingId }: { listingId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="py-4 border-2 border-slate-100 text-slate-600 rounded-[20px] font-bold hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 w-full"
      >
        <ShieldCheck className="w-5 h-5" />
        <span>Report</span>
      </button>
      
      <ReportModal 
        listingId={listingId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
