# Portfolio — Next.js + Supabase + Laravel

## Stack
- **Frontend**: Next.js 14 (App Router), TailwindCSS, Framer Motion
- **Database**: Supabase (direct client for public reads)
- **Backend**: Laravel (contact form, admin auth, file uploads)
- **SEO**: Next.js Metadata API, JSON-LD structured data

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.local.example` to `.env.local` and fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://yoursite.com
LARAVEL_API_URL=https://your-laravel-api.com/api
```

### 3. Supabase Tables
Run the SQL in `supabase/schema.sql` to create required tables.

### 4. Run dev server
```bash
npm run dev
```

## Project Structure
```
src/
├── app/
│   ├── layout.jsx          # Root layout + SEO defaults
│   ├── page.jsx            # Home page
│   ├── projects/
│   │   ├── page.jsx        # Projects listing
│   │   └── [id]/page.jsx   # Project detail
│   ├── contact/page.jsx    # Contact page
│   ├── sitemap.js          # Auto-generated sitemap
│   └── robots.js           # Robots.txt
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── ProjectCard.jsx
│   └── SkeletonCard.jsx
└── lib/
    ├── supabase.js         # Supabase client
    └── metadata.js         # SEO helpers
```

## Improvements Over Original
1. ✅ Next.js App Router with Server Components (better performance)
2. ✅ Supabase direct integration (no Laravel middleman for reads)
3. ✅ Full SEO: Open Graph, Twitter Cards, JSON-LD, sitemap, robots.txt
4. ✅ Redesigned with editorial dark aesthetic
5. ✅ Animated hero with typewriter effect
6. ✅ Project filtering by tech stack
7. ✅ Loading skeleton states
8. ✅ Timeline / experience section
9. ✅ Resume download button
10. ✅ Smooth scroll reveal animations
