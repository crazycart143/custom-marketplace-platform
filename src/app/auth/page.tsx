"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const supabase = createClient();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-[100px] opacity-40" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-indigo-100 p-8 relative z-10 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <ShoppingBag className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to MarketPro</h1>
          <p className="text-slate-500 mt-2">Sign in or create an account to continue</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4f46e5',
                  brandAccent: '#4338ca',
                },
                radii: {
                  borderRadiusButton: '12px',
                  buttonPadding: '12px 16px',
                  inputPadding: '12px 16px',
                }
              }
            }
          }}
          providers={['github', 'google']}
          redirectTo={`${origin}/auth/callback`}
        />
      </motion.div>
    </div>
  );
}
