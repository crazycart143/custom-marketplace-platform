import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch conversation details
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select(`
      id,
      buyer:profiles!buyer_id (id, full_name, avatar_url),
      seller:profiles!seller_id (id, full_name, avatar_url),
      listing:listings (id, title, category, images)
    `)
    .eq('id', id)
    .single();

  if (error || !conversation) {
    return notFound();
  }

  // Ensure user is part of the conversation
  const buyer = conversation.buyer as any;
  const seller = conversation.seller as any;

  if (buyer.id !== user.id && seller.id !== user.id) {
    redirect("/messages");
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <Link 
          href="/messages" 
          className="inline-flex items-center space-x-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Messages</span>
        </Link>
        
        <ChatWindow 
          conversationId={conversation.id} 
          currentUser={user} 
          convoData={conversation} 
        />
      </div>
    </div>
  );
}
