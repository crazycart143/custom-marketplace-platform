"use client";

import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';

interface FollowButtonProps {
  followingId: string;
  initialIsFollowing?: boolean;
}

export default function FollowButton({ followingId, initialIsFollowing = false }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkFollow() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id === followingId) return;

      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .single();

      if (data) setIsFollowing(true);
    }
    checkFollow();
  }, [followingId, supabase]);

  const toggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to follow sellers");
      return;
    }

    if (user.id === followingId) {
      toast.error("You cannot follow yourself");
      return;
    }

    setIsLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', followingId);

      if (!error) {
        setIsFollowing(false);
        toast.success("Unfollowed seller");
      }
    } else {
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: followingId });

      if (!error) {
        setIsFollowing(true);
        toast.success("Following seller");
      }
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={isLoading}
      className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center space-x-2 ${
        isFollowing 
          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
          : 'bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/10'
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}
