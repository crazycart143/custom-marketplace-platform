"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AuthHandler() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const code = searchParams?.get('code');
    if (code) {
      const exchangeCode = async () => {
        console.log('[AuthHandler] Exchanging code for session...');
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error && data.session) {
          console.log('[AuthHandler] Session exchange successful! User:', data.user?.email);
          // Remove code from URL
          window.history.replaceState({}, '', '/');
          // Reload to update navbar
          setTimeout(() => window.location.reload(), 100);
        } else {
          console.error('[AuthHandler] Session exchange error:', error);
        }
      };
      exchangeCode();
    }
  }, [searchParams, supabase]);

  return null;
}
