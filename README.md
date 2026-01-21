# Studentify - The Students Marketplace

A premium, custom-built marketplace platform designed specifically for students to buy and sell campus essentials with confidence.

## Core Features (Phase 1)

- **Full-Stack Authentication**: Secure login/signup via Supabase Auth with SSR support.
- **Premium User Dashboard**: Manage listings, view activity, and track performance.
- **Dynamic Marketplace**: Browse listings with real-time search and category filtering.
- **Multi-Step Listing Flow**: Professional seller interface with real-time image previews and direct Supabase Storage uploads.
- **Responsive & Accessible**: Mobile-first design with a focus on web accessibility and SEO optimization.
- **State-of-the-art UI**: Built with Framer Motion animations and a custom design system.

## Phase 2 Features

- **Real-Time Messaging**: Integrated instant chat via Supabase Realtime with a dedicated messaging inbox.
- **Trust & Safety**: 5-star rating system and detailed seller reviews with average rating badges.
- **Advanced Discovery**: Powerful price range filtering and multiple sorting options (Newest, Price asc/desc).
- **Pro Management**: Functional "Mark as Sold", relisting, and deletion logic for sellers.
- **Personalized Profiles**: Custom avatar uploads via Supabase Storage and editable profile settings.
- **Rich Editing**: Multi-step listing edit system with support for gallery management and image updates.
- **Premium UX**: Integrated `sonner` notifications, skeleton loading states, and real-time account statistics.
- **Modern Tech**: Optimized with Tailwind v4 syntax and strictly enforced TypeScript/Linting standards.

## Phase 3 Features

### **Tier 1 - Essential Marketplace Features**

- **Payment Integration**: Secure escrow payments via Stripe with buyer protection and seller payouts.
  - _Tools_: Stripe API, Supabase Edge Functions for webhooks
- **Offers & Negotiation**: Make/receive price offers with counter-offer system and expiration timers.
  - _Tools_: Supabase Database + Realtime (no external APIs)
- **Enhanced Notifications**: Email notifications for messages, offers, and important events with customizable preferences.
  - _Tools_: Resend (3,000 emails/month free) or SendGrid

### **Tier 2 - Trust & Discovery**

- **Verification & Trust**: Student email verification (.edu domains), verified seller badges, and report/flag system.
  - _Tools_: Supabase Auth email verification, Supabase Storage for ID uploads
- **Social Features**: Follow/unfollow sellers, wishlist/favorites system, and share listings to social media.
  - _Tools_: Supabase Realtime, Open Graph meta tags (no external APIs)
- **Advanced Search**: Full-text search with autocomplete, saved searches, alerts, and "similar items" recommendations.
  - _Tools_: Supabase Full-Text Search or Algolia (optional)

### **Tier 3 - Premium Enhancements**

- **Analytics & Insights**: Seller dashboard with views, favorites, conversion metrics, and price suggestions.
  - _Tools_: Supabase Analytics, Vercel Analytics, custom SQL queries
- **Advanced Media**: Video uploads, image editing/cropping, and bulk upload capabilities.
  - _Tools_: Supabase Storage + client-side compression, react-image-crop

## Phase 4: Student Freelance & Services Hub

Empowering students to turn their skills into tuition and professional experience.

### Core Freelance Features

- **Service Listings**: A specialized category for academic and professional services such as tutoring, technical support, and creative design.
- **Service-Specific UI**: Dedicated layouts for services featuring hourly rates, project-based pricing, and revision terms.
- **Student Portfolios**: Enhanced profile sections highlighting previous work, skillsets, and platform-verified projects.

### Student-First Transparency

- **Academic Credentials**: Integrated display of the student's major, university, and current year of study on all service listings.
- **Skill Endorsements**: A system for buyers to vouch for specific academic and technical competencies.
- **Career Growth Tracking**: Tools to help students document their freelance work for use in real-world resumes and internships.

### Professional Service Tools

- **Milestone-Based Payments**: Secure escrow integration allowing for staged payouts as project goals are met.
- **Availability Management**: A booking system that allows students to coordinate service availability with their academic schedules.
- **Service Agreements**: Simplified contract templates to ensure clear expectations between student freelancers and buyers.

## Tech Stack

- **Frontend/Backend**: [Next.js (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---
