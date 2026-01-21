"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Share2, Download, ExternalLink, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface CertificateProps {
  data: {
    id: string;
    title: string;
    studentName: string;
    university: string;
    date: string;
    verificationCode: string;
    category?: string;
  };
  onClose: () => void;
}

export default function ExperienceCertificate({ data, onClose }: CertificateProps) {
  const shareUrl = `${window.location.origin}/verify/${data.verificationCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Verification link copied!");
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
      >
        {/* Certificate Border Deco */}
        <div className="absolute inset-0 border-20 border-slate-50 pointer-events-none" />
        <div className="absolute inset-8 border-2 border-slate-100 pointer-events-none" />
        
        <div className="p-16 text-center space-y-8 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center ring-8 ring-brand/10">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-black text-brand uppercase tracking-[4px]">Verified Achievement</p>
            <h1 className="text-4xl font-serif text-black italic">Certificate of Completion</h1>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">This is to certify that</p>
            <h2 className="text-3xl font-black text-black">{data.studentName}</h2>
          </div>

          <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
            has successfully completed the project <span className="font-black text-black">"{data.title}"</span> 
            {data.category && <> in the category of <span className="text-brand font-bold">{data.category}</span></>} 
            within the <span className="font-bold">{data.university}</span> academic micro-network.
          </p>

          <div className="flex items-center justify-center space-x-12 pt-8">
            <div className="text-center">
              <div className="w-32 h-px bg-slate-200 mb-2 mx-auto" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date Issued</p>
              <p className="text-xs font-bold text-black">{data.date}</p>
            </div>
            <div className="text-center relative">
               <GraduationCap className="w-8 h-8 text-brand/20 absolute -top-10 left-1/2 -translate-x-1/2 opacity-50" />
               <div className="w-32 h-px bg-slate-200 mb-2 mx-auto" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Institution</p>
              <p className="text-xs font-bold text-black">Studentify Network</p>
            </div>
          </div>

          <div className="pt-10 flex flex-col items-center space-y-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 inline-flex items-center space-x-3">
              <div className="text-left">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verification ID</p>
                <p className="text-[10px] font-mono font-bold text-black">{data.verificationCode}</p>
              </div>
              <Share2 className="w-4 h-4 text-slate-300" />
            </div>
            
            <div className="flex space-x-3 print:hidden">
              <button 
                onClick={copyLink}
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center space-x-2 hover:bg-slate-50 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Copy Verification Link</span>
              </button>
              <button 
                onClick={() => window.print()}
                className="px-6 py-3 bg-brand text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center space-x-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand/10"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Proof</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
