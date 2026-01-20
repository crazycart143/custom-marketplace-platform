# MarketPro | Custom Marketplace Platform

MarketPro is a high-performance, premium marketplace platform built with **Next.js 15**, **Supabase**, and **Tailwind CSS**. It is designed for scalability and exceptional user experience.

## ✨ Core Features (Phase 1)

- **Full-Stack Authentication**: Secure login/signup via Supabase Auth with SSR support.
- **Premium User Dashboard**: Manage listings, view activity, and track performance.
- **Dynamic Marketplace**: Browse listings with real-time search and category filtering.
- **Multi-Step Listing Flow**: Professional seller interface with real-time image previews and direct Supabase Storage uploads.
- **Responsive & Accessible**: Mobile-first design with a focus on web accessibility and SEO optimization.
- **State-of-the-art UI**: Built with Framer Motion animations and a custom design system.

## 🚀 Tech Stack

- **Frontend/Backend**: [Next.js (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Configuration

1. **Clone the repository.**
2. **Environment Variables**: Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. **Database Setup**: Execute the `supabase_schema.sql` found in the root directory in your Supabase SQL Editor.
4. **Storage Setup**: Create a public bucket in Supabase Storage named `listings`.
5. **Install Dependencies**: `npm install`.
6. **Run Dev Server**: `npm run dev`.

## 📦 Database Schema

The database includes specialized tables for:

- `profiles`: Extended user data.
- `listings`: Marketplace items with image support.
- `conversations`: Private chat rooms (Ready for Phase 2).
- `messages`: Real-time chat integration (Ready for Phase 2).

---

Built with confidence using **Next.js** and **Supabase**.
