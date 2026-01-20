"use client";

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Settings, 
  Package, 
  MessageSquare, 
  LogOut, 
  Camera,
  LayoutDashboard
} from 'lucide-react';

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) setProfile(data);
      }
      setLoading(false);
    }
    getProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 overflow-hidden border-2 border-white shadow-md">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-10 h-10" />
                    )}
                  </div>
                  <button className="absolute bottom-2 right-0 p-2 bg-indigo-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-slate-900 text-left">{profile?.full_name || 'New User'}</h2>
                <p className="text-sm text-slate-500 text-left">@{profile?.username || 'username'}</p>
                <div className="mt-4 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider block w-fit">
                  {profile?.role || 'Buyer'}
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', href: '/profile' },
                  { icon: Package, label: 'My Listings', href: '/profile/listings' },
                  { icon: MessageSquare, label: 'Messages', href: '/profile/messages' },
                  { icon: Settings, label: 'Settings', href: '/profile/settings' },
                ].map((item) => (
                  <Link 
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all font-medium"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
            >
              <h1 className="text-2xl font-bold text-slate-900 mb-6 text-left">Account Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Listings</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">0</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Sales</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">$0.00</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Messages</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">0</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 text-left">Recent Activity</h2>
                <Link href="/profile/activity" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>
              
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900">No activity yet</h3>
                <p className="text-slate-500 max-w-xs mt-2">When you create listings or message sellers, your activity will appear here.</p>
                <Link 
                  href="/sell" 
                  className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Create Your First Listing
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
