import { createClient } from "@/lib/supabase-server";
import ListingCard from "@/components/ListingCard";
import { Search, Filter, SlidersHorizontal, PackageSearch } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Browse Marketplace | MarketPro",
  description: "Explore thousands of premium listings. Search and filter to find exactly what you need.",
};

const CATEGORIES = [
  "All Categories", "Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", 
  "Collectibles", "Books & Media", "Automotive", "Other"
];

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : "";
  const category = typeof params.category === 'string' ? params.category : "All Categories";
  
  const supabase = await createClient();

  let listingsQuery = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active');

  if (query) {
    listingsQuery = listingsQuery.ilike('title', `%${query}%`);
  }

  if (category && category !== "All Categories") {
    listingsQuery = listingsQuery.eq('category', category);
  }

  const { data: listings } = await listingsQuery.order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="max-w-xl text-left">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 text-left">
              Explore the <span className="text-indigo-600">Market</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Discover unique items from trusted sellers curated for you.
            </p>
          </div>

          {/* Search Bar */}
          <form className="relative w-full lg:max-w-md group" action="/browse">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm flex items-center">
              <Search className="ml-4 text-slate-400 w-5 h-5" />
              <input 
                name="q"
                type="text" 
                defaultValue={query}
                placeholder="Search listings..." 
                className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 font-medium"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                Search
              </button>
            </div>
            {category !== "All Categories" && <input type="hidden" name="category" value={category} />}
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-10 text-left">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Categories</h2>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/browse?${query ? `q=${query}&` : ''}category=${cat}`}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                      category === cat
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                        : "bg-white text-slate-500 border-slate-100 hover:border-indigo-100 hover:text-indigo-600"
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center space-x-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              </div>
              <p className="text-sm text-slate-400 italic">Advanced filters coming soon...</p>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {!listings || listings.length === 0 ? (
              <div className="bg-slate-50 rounded-[40px] px-8 py-24 text-center border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm">
                  <PackageSearch className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 underline decoration-indigo-200">No results found</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                  We couldn't find any listings matching your search criteria. Try a different keyword or category.
                </p>
                <Link href="/browse" className="mt-8 inline-block font-bold text-indigo-600 hover:text-indigo-700">
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
