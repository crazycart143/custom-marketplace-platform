"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { MapPin, ShieldCheck, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SafeZone {
  id: string;
  name: string;
  university: string;
  description: string;
}

export default function SafeZoneSelector({ 
  university, 
  selectedId, 
  onChangeAction 
}: { 
  university?: string; 
  selectedId: string | null; 
  onChangeAction: (id: string | null) => void 
}) {
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSafeZones() {
      try {
        let query = supabase.from('safe_zones').select('*');
        
        if (university) {
          query = query.ilike('university', `%${university}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        setSafeZones(data || []);
      } catch (err) {
        console.error("Error fetching safe zones:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSafeZones();
  }, [university, supabase]);

  if (loading) return <div className="flex items-center space-x-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> <span className="text-xs font-bold uppercase tracking-widest">Loading Safe Zones...</span></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-brand">
        <ShieldCheck className="w-5 h-5" />
        <h3 className="text-sm font-black text-black uppercase tracking-wider">Campus Safe-Zones</h3>
      </div>
      
      <p className="text-xs text-slate-500 font-medium leading-relaxed">
        Choose a pre-verified, secure campus location for your physical hand-off. 
        These areas are typically well-lit and monitored.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {safeZones.length > 0 ? (
          safeZones.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => onChangeAction(selectedId === zone.id ? null : zone.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedId === zone.id 
                  ? "bg-brand/10 border-brand shadow-sm" 
                  : "bg-white border-slate-100 hover:border-brand/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold text-sm ${selectedId === zone.id ? 'text-brand' : 'text-black'}`}>
                  {zone.name}
                </span>
                <MapPin className={`w-3.5 h-3.5 ${selectedId === zone.id ? 'text-brand' : 'text-slate-300'}`} />
              </div>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{zone.description}</p>
            </button>
          ))
        ) : (
          <div className="col-span-2 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
            <Info className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No Safe-Zones found for {university || 'this campus'}</p>
          </div>
        )}
      </div>

      <label className="flex items-center space-x-3 cursor-pointer group pt-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={!selectedId}
            onChange={() => onChangeAction(null)}
            className="peer w-5 h-5 opacity-0 absolute"
          />
          <div className="w-5 h-5 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-black peer-checked:border-black transition-all flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
          I'll coordinate a custom location (standard risk)
        </span>
      </label>
    </div>
  );
}
