"use client";

import { Sparkles, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuggestionProps {
  category: string;
  yearOfStudy: string;
  pricingModel: 'fixed' | 'hourly';
}

export default function PricingAssistant({ category, yearOfStudy, pricingModel }: SuggestionProps) {
  const getSuggestion = () => {
    const isHourly = pricingModel === 'hourly';
    
    // Academic Year Multiplier
    const yearMultipliers: Record<string, number> = {
      "Freshman": 1.0,
      "Sophomore": 1.2,
      "Junior": 1.5,
      "Senior": 1.8,
      "Graduate": 2.2,
      "PHD": 3.0
    };
    
    const mult = yearMultipliers[yearOfStudy] || 1.0;

    // Base Rates
    const rates: Record<string, { base: number, range: string }> = {
      "Tutoring": { base: 15, range: isHourly ? "$15 - $45 /hr" : "$30 - $100 /session" },
      "Graphic Design": { base: 20, range: isHourly ? "$20 - $60 /hr" : "$50 - $250 /project" },
      "Technical Support": { base: 18, range: isHourly ? "$18 - $50 /hr" : "$40 - $150 /task" },
      "Writing & Proofreading": { base: 12, range: isHourly ? "$12 - $35 /hr" : "$20 - $100 /paper" },
      "Creative Services": { base: 25, range: isHourly ? "$25 - $80 /hr" : "$100 - $500 /project" }
    };

    const config = rates[category] || { base: 10, range: isHourly ? "$10 - $30 /hr" : "$20 - $100 /item" };
    
    const suggestedMin = Math.round(config.base * mult);
    const suggestedMax = Math.round(config.base * mult * 2.5);

    return {
      title: `${category} Assistant`,
      recommendation: `Based on your level as a ${yearOfStudy || 'Student'}, we suggest a rate between ${isHourly ? '$' + suggestedMin + '-' + suggestedMax + '/hr' : '$' + suggestedMin + '-' + suggestedMax + '/project'}.`,
      marketTip: category === 'Tutoring' ? "Exam seasons typically allow for 20% higher rates." : "Bundling revisions can help you close larger projects."
    };
  };

  const suggestion = getSuggestion();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-linear-to-br from-brand/5 to-white rounded-3xl border border-brand/10 shadow-sm"
    >
      <div className="flex items-center space-x-2 text-brand mb-2">
        <Sparkles className="w-4 h-4 fill-brand/20" />
        <span className="text-[10px] font-black uppercase tracking-wider">AI Pricing Assistant</span>
      </div>
      <p className="text-xs text-slate-700 font-bold leading-relaxed">
        {suggestion.recommendation}
      </p>
      <div className="mt-3 flex items-start space-x-2 p-2 bg-white/50 rounded-xl border border-white">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 font-medium italic">
          {suggestion.marketTip}
        </p>
      </div>
    </motion.div>
  );
}
