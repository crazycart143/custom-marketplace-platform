"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Plus, 
  Settings, 
  Shield, 
  UserPlus, 
  ExternalLink,
  ChevronRight,
  Loader2,
  Building2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AgenciesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState("");
  const [newAgencyDesc, setNewAgencyDesc] = useState("");

  useEffect(() => {
    fetchAgencies();
  }, [supabase]);

  async function fetchAgencies() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch agencies where user is owner or member
    const { data, error } = await supabase
      .from('agencies')
      .select(`
        *,
        agency_members (
          profile_id,
          role,
          profiles:profile_id (full_name, avatar_url)
        )
      `)
      .or(`owner_id.eq.${user.id},id.in.(select agency_id from agency_members where profile_id = '${user.id}')`);

    if (data) setAgencies(data);
    setLoading(false);
  }

  const handleCreateAgency = async () => {
    if (!newAgencyName) return toast.error("Please enter an agency name");
    
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: agency, error } = await supabase
      .from('agencies')
      .insert({
        name: newAgencyName,
        description: newAgencyDesc,
        owner_id: user?.id,
        university: 'Stanford University' // In real app, fetch from profile
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      // Add owner as admin member
      await supabase.from('agency_members').insert({
        agency_id: agency.id,
        profile_id: user?.id,
        role: 'owner'
      });
      
      toast.success("Agency created successfully!");
      setShowCreateModal(false);
      fetchAgencies();
    }
    setLoading(false);
  };

  if (loading && agencies.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight uppercase">Student Agencies</h1>
            <p className="text-slate-500 font-bold mt-2">Team up with peers to conquer larger freelance projects.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-brand text-white rounded-3xl font-black text-sm flex items-center justify-center space-x-2 hover:bg-brand-dark transition-all shadow-xl shadow-brand/10"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Agency</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agencies.length > 0 ? (
            agencies.map((agency) => (
              <motion.div 
                key={agency.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:shadow-brand/5 transition-all border-b-4 border-b-brand"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-brand/10 rounded-[20px] flex items-center justify-center text-brand">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-wider">
                      {agency.university}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-black text-black text-left">{agency.name}</h2>
                  <p className="text-sm text-slate-500 font-medium mt-3 leading-relaxed text-left line-clamp-2">
                    {agency.description || "No description provided."}
                  </p>

                  <div className="mt-8 pt-8 border-t border-slate-50">
                    <div className="flex items-center space-x-2 text-slate-400 mb-4">
                      <Users className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Team Members ({agency.agency_members?.length || 0})</span>
                    </div>
                    <div className="flex -space-x-3 overflow-hidden">
                      {agency.agency_members?.map((member: any, i: number) => (
                        <div key={i} className="h-10 w-10 rounded-full ring-4 ring-white bg-slate-100 overflow-hidden transform hover:-translate-y-1 transition-transform">
                          {member.profiles.avatar_url ? (
                            <img src={member.profiles.avatar_url} alt={member.profiles.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-slate-400">
                              {member.profiles.full_name[0]}
                            </div>
                          )}
                        </div>
                      ))}
                      <button className="flex h-10 w-10 rounded-full ring-4 ring-white bg-brand/10 items-center justify-center text-brand hover:bg-brand hover:text-white transition-all">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex space-x-3">
                  <Link 
                    href={`/profile/agencies/${agency.id}`}
                    className="flex-1 px-6 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-brand transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Manage</span>
                  </Link>
                  <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-brand transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-20 bg-white rounded-[40px] border border-dashed border-slate-200 text-center">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-black uppercase">No Agencies Yet</h3>
              <p className="text-slate-500 font-bold mt-2">Start a team and offer high-end complex services together.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              
              <div className="flex items-center space-x-3 text-brand mb-8">
                <Shield className="w-8 h-8" />
                <h2 className="text-2xl font-black uppercase text-black">Form an Agency</h2>
              </div>

              <div className="space-y-6">
                <div className="text-left">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Agency Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stanford Creative Hub"
                    value={newAgencyName}
                    onChange={(e) => setNewAgencyName(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-brand focus:bg-white transition-all outline-none font-bold text-black"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="What does your team specialize in?"
                    value={newAgencyDesc}
                    onChange={(e) => setNewAgencyDesc(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-brand focus:bg-white transition-all outline-none font-bold text-black resize-none"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateAgency}
                    disabled={loading}
                    className="flex-2 px-8 py-5 bg-brand text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand/10 flex items-center justify-center space-x-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Launch Agency</span>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
