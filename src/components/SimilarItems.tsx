import { createClient } from "@/lib/supabase-server";
import ListingCard from "./ListingCard";

export default async function SimilarItems({ category, currentListingId }: { category: string, currentListingId: string }) {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('category', category)
    .eq('status', 'active')
    .neq('id', currentListingId)
    .limit(4);

  if (!listings || listings.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-black tracking-tight text-left">
          Similar <span className="text-brand">Items</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {listings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>
    </div>
  );
}
