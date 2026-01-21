"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { 
  Download, 
  Printer, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function ResumePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // 2. Fetch Projects (Experience)
      const { data: projectData } = await supabase
        .from('projects')
        .select(`
          *,
          listing:listing_id (title, category)
        `)
        .eq('freelancer_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      setExperience(projectData || []);

      // 3. Fetch Skills & Endorsements
      const { data: skillData } = await supabase
        .from('profile_skills')
        .select(`
          skill_id,
          skills (id, name)
        `)
        .eq('profile_id', user.id);

      const skillsWithEndorsements = await Promise.all((skillData || []).map(async (item: any) => {
        const { count } = await supabase
          .from('skill_endorsements')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('skill_id', item.skills.id);
        
        return {
          name: item.skills.name,
          count: count || 0
        };
      }));
      setSkills(skillsWithEndorsements);

      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 print:p-0 print:bg-white">
      <div className="container mx-auto max-w-4xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link href="/profile" className="flex items-center space-x-2 text-slate-500 font-bold hover:text-brand transition-all">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </Link>
          <div className="flex space-x-4">
            <button 
              onClick={handlePrint}
              className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-sm flex items-center space-x-2 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Resume</span>
            </button>
            <button className="px-6 py-3 bg-brand text-white rounded-2xl font-black text-sm flex items-center space-x-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand/10">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden print:border-0 print:shadow-none print:rounded-none"
        >
          {/* Resume Banner */}
          <div className="bg-brand p-12 text-white relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div className="text-left">
                <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">{profile?.full_name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80 font-bold">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5" />
                    <span>{profile?.university}</span>
                  </div>
                  <span>•</span>
                  <span>{profile?.major} ({profile?.year_of_study})</span>
                </div>
              </div>
              <div className="text-left md:text-right space-y-1">
                <div className="flex items-center md:justify-end space-x-2 text-white/80 text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  <span>studentify.io/profile/{profile?.username}</span>
                </div>
                {profile?.is_verified && (
                  <div className="flex items-center md:justify-end space-x-2 text-brand-dark bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Academic Verified Vendor</span>
                  </div>
                )}
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-20 pointer-events-none" />
          </div>

          <div className="p-12 space-y-12">
            {/* Summary */}
            <section className="text-left">
              <h2 className="text-xs font-black text-brand uppercase tracking-[3px] mb-4">Professional Profile</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-serif">
                {profile?.bio || "Student freelancer with a focus on project-based work and peer collaboration within the Studentify academic network."}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Left Column: Skills & Endorsements */}
              <div className="md:col-span-1 space-y-10">
                <section className="text-left">
                  <h2 className="text-xs font-black text-brand uppercase tracking-[3px] mb-6 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Verified Skills
                  </h2>
                  <div className="space-y-4">
                    {skills.length > 0 ? (
                      skills.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <span className="font-bold text-slate-700 capitalize text-sm">{skill.name}</span>
                          <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-slate-50 rounded-lg group-hover:bg-brand/10 transition-colors">
                            <Award className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-black text-slate-500">{skill.count}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
                    )}
                  </div>
                </section>

                <section className="text-left">
                  <h2 className="text-xs font-black text-brand uppercase tracking-[3px] mb-6 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Credentials
                  </h2>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-black leading-tight">Identity Verified</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{profile?.university} Institutional Auth</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Platform Experience */}
              <div className="md:col-span-2 space-y-10">
                <section className="text-left">
                  <h2 className="text-xs font-black text-brand uppercase tracking-[3px] mb-8 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Verified Work History
                  </h2>
                  
                  <div className="space-y-10">
                    {experience.length > 0 ? (
                      experience.map((proj, i) => (
                        <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-brand before:rounded-full after:absolute after:left-[3px] after:top-5 after:bottom-0 after:w-0.5 after:bg-slate-100 last:after:hidden">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-black text-black uppercase tracking-wide">{proj.listing?.title}</h3>
                            <span className="text-[10px] font-black text-slate-400 italic">
                              {new Date(proj.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-3">{proj.listing?.category}</p>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            {proj.description || "Successfully delivered high-quality project within specified deadlines and milestones."}
                          </p>
                          <div className="mt-4 inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified Transaction</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No completed projects found</p>
                        <p className="text-xs text-slate-400 mt-2">Projects completed on Studentify automatically appear here.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
          
          <div className="p-10 bg-slate-50 border-t border-slate-50 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[3px]">
              Platform Generated Career Document • Studentify Academic Network • ID: {profile?.id.slice(0, 8)}
            </p>
          </div>
        </motion.div>
      </div>
      
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          nav, footer, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
