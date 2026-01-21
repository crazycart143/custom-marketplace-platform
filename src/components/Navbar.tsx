"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  MessageSquare, 
  User, 
  Menu, 
  X,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data);
    };

    const initAuth = async () => {
      console.log('[Navbar] Initializing auth...');
      // Use getUser() instead of getSession() - it properly reads cookies
      const { data: { user }, error } = await supabase.auth.getUser();
      
      console.log('[Navbar] User from getUser():', user?.email || 'None', 'Error:', error?.message || 'None');
      
      if (user && !error) {
        setUser(user);
        await fetchProfile(user.id);
      }
    };

    // Initialize auth immediately
    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = [
    { name: "Browse", href: "/browse" },
    { name: "Sell", href: "/sell" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 mt-4 mx-4 rounded-2xl shadow-lg border border-white/20"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
            <ShoppingBag className="text-white w-6 h-6" />
          </div>
          <span className={`text-2xl font-black tracking-tight ${isScrolled ? "text-black" : "text-black"}`}>
            Studentify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold hover:text-brand transition-colors ${
                pathname === link.href ? "text-brand" : "text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 text-slate-600 hover:text-brand transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {user ? (
            <>
              <Link href="/messages" className="p-2 text-slate-600 hover:text-brand transition-colors relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full border-2 border-white" />
              </Link>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <Link
                href="/profile"
                className="flex items-center space-x-3 pl-2 group"
              >
                <div className="text-right">
                  <p className="text-sm font-bold text-black group-hover:text-brand transition-colors">
                    {profile?.full_name || "Student User"}
                  </p>
                  <p className="text-xs text-slate-500">Dashboard</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-brand/20 p-0.5 group-hover:border-brand transition-all">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                </div>
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <Link
                href="/auth"
                className="flex items-center space-x-2 bg-brand/10 text-brand px-5 py-2.5 rounded-xl font-bold hover:bg-brand hover:text-white transition-all shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 bg-white mt-4 p-6 rounded-3xl shadow-2xl border border-slate-100 md:hidden overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold text-slate-600 hover:text-brand px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-2xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <p className="font-bold text-black">{profile?.full_name || "Dashboard"}</p>
                      <p className="text-sm text-slate-500">View Profile</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-500 font-bold px-4 py-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="bg-brand text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-brand/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
