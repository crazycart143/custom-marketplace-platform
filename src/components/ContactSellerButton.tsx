"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ContactSellerButtonProps {
  listingId: string;
  sellerId: string;
}

export default function ContactSellerButton({ listingId, sellerId }: ContactSellerButtonProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleContact = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to contact the seller.");
        router.push("/auth");
        return;
      }

      if (user.id === sellerId) {
        toast.error("You cannot contact yourself about your own listing.");
        return;
      }

      // 1. Check if conversation already exists
      const { data: existingConvo, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .single();

      if (existingConvo) {
        router.push(`/messages/${existingConvo.id}`);
        return;
      }

      // 2. Create new conversation
      const { data: newConvo, error: insertError } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          buyer_id: user.id,
          seller_id: sellerId
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success("Conversation started!");
      router.push(`/messages/${newConvo.id}`);
    } catch (error: any) {
      console.error("Error starting conversation:", error.message);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleContact}
      disabled={loading}
      className="w-full py-5 bg-brand text-white rounded-[24px] font-black text-lg hover:bg-brand-dark transition-all shadow-xl shadow-brand/10 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MessageCircle className={`w-6 h-6 ${loading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
      <span>{loading ? 'Starting Chat...' : 'Contact Seller'}</span>
    </button>
  );
}
