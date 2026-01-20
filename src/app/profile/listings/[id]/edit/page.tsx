import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import EditListingForm from "@/components/EditListingForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !listing) {
    return notFound();
  }

  // Ensure only the owner can edit
  if (listing.owner_id !== user.id) {
    redirect("/profile/listings");
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto mb-10 text-left">
          <Link 
            href="/profile/listings" 
            className="inline-flex items-center space-x-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to My Listings</span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edit <span className="text-indigo-600">Listing</span></h1>
          <p className="text-slate-500 font-medium mt-2">Adjust your item details and gallery for better visibility.</p>
        </div>

        <EditListingForm listing={listing} />
      </div>
    </div>
  );
}
