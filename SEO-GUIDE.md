# Spa-Review.com — SEO Implementation Guide

## Overview

This document covers the complete SEO strategy and technical implementation for Spa-Review.com, a directory of 50,000+ spas across 113 countries.

---

## Architecture: Why Next.js?

The existing React SPA (single `.jsx` artifact) renders entirely client-side. Search engines see an empty `<div>` before JavaScript loads. This is the #1 SEO blocker.

**Next.js App Router** solves this by server-rendering every page as static HTML at build time. Google receives complete, crawlable content on the first request — no JavaScript required.

### Page Structure

```
spa-review.com/                          → Global Top 50 (homepage)
spa-review.com/country/thailand          → Country page with city grid + top spas
spa-review.com/city/bangkok              → City page with spa listings + editorial + FAQ
spa-review.com/spa/chiva-som-hua-hin     → Individual spa detail page
spa-review.com/blog/spa-etiquette-guide  → Blog post (content marketing)
spa-review.com/sitemap.xml               → Auto-generated XML sitemap
spa-review.com/robots.txt                → Crawler directives
```

**Total indexable pages: ~51,000+**
- 1 homepage
- 113 country pages
- 564 city pages
- 50,000 spa pages
- Blog posts (growing)

---

## Technical SEO — What's Implemented

### 1. Server-Side Rendering (SSR)

Every page is pre-rendered at build time via `generateStaticParams()`. This means:
- Google sees complete HTML content immediately
- No JavaScript required for content indexing
- Fastest possible Time to First Byte (TTFB)

**File:** Each `page.js` file exports `generateStaticParams()` for static generation.

### 2. Dynamic Meta Tags

Every page has unique `<title>` and `<meta description>` tags generated from the spa data:

```
Spa page:    "Chiva-Som | Reviews, Treatments & Booking | Spa-Review"
City page:   "Best Spas in Bangkok, Thailand (2026) — Top-Rated & Reviewed | Spa-Review"
Country page: "Best Spas in Thailand (2026) — Complete Guide | Spa-Review"
```

**File:** `lib/spa-db.js` — `getSpaMetaTitle()`, `getCityMetaTitle()`, etc.

### 3. Structured Data (Schema.org JSON-LD)

Every page includes rich structured data for Google's enhanced search results:

| Page Type | Schema Types |
|-----------|-------------|
| Homepage  | `Organization`, `WebSite` (with SearchAction for sitelinks) |
| Spa page  | `HealthAndBeautyBusiness`, `BreadcrumbList`, `FAQPage` |
| City page | `ItemList`, `BreadcrumbList`, `FAQPage` |
| Country page | `ItemList`, `BreadcrumbList` |
| Blog post | `Article`, `BreadcrumbList` |

**Key benefits:**
- Star ratings visible in search results (from `AggregateRating`)
- FAQ dropdowns in search results (from `FAQPage`)
- Carousel results for city/country pages (from `ItemList`)
- Site search box in Google (from `WebSite.SearchAction`)

**File:** `lib/schema.js` — All schema generators and the `<JsonLd>` component.

### 4. XML Sitemap

Auto-generated at build time with all 50,000+ URLs:

```
Priority 1.0: Homepage
Priority 0.9: Country pages (113)
Priority 0.8: City pages (564)
Priority 0.7: Blog posts
Priority 0.6: Individual spa pages (50,000)
```

**File:** `app/sitemap.js`

**Action required:** Submit to Google Search Console at `https://search.google.com/search-console` → Sitemaps → Add `https://spa-review.com/sitemap.xml`

### 5. robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

User-agent: GPTBot
Disallow: /

Sitemap: https://spa-review.com/sitemap.xml
```

**File:** `app/robots.js`

### 6. Canonical URLs

Every page declares its canonical URL via `alternates.canonical` in metadata. This prevents duplicate content issues from URL parameters, trailing slashes, etc.

### 7. Open Graph & Twitter Cards

Every page includes full Open Graph and Twitter Card meta tags for social sharing:
- Custom titles and descriptions per page
- Dynamic OG images (spa photos via picsum.photos)
- Proper `og:type` (`website`, `place`, `article`)

### 8. Performance Headers

Set via `next.config.js`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: origin-when-cross-origin`
- Sitemap caching: 24-hour cache

### 9. Internal Linking

Every page includes contextual internal links:
- **Breadcrumbs** (visible + Schema.org): Home → Country → City → Spa
- **Related content links** at page bottom
- **City grid** on country pages links to all city pages
- **"More spas in..."** links on spa detail pages

This creates a deep, crawlable link architecture that distributes PageRank across all 50,000+ pages.

---

## Content Strategy — What to Write

### Priority 1: City Guide Pages (High-Intent Keywords)

Target keywords like "best spas Bangkok", "best spa London", "top spas Bali"

These are the highest-value pages because they match buyer intent. Each city page needs:

- **Editorial intro** (200-400 words) — currently template-generated, should be manually written for top 30 cities
- **"Best for" sections** — Best for couples, best medical spa, best budget, best luxury
- **Neighborhood breakdowns** — "Spas in Mayfair", "Spas in Ubud"
- **Seasonal advice** — Best time to visit, booking tips
- **FAQ section** — Already implemented with schema markup

**Already implemented for:** Bangkok, Tokyo, Bali, London, Paris, New York, Dubai (custom intros in `lib/content.js`)

**Action:** Write custom intros for top 30 cities by search volume.

### Priority 2: Blog Posts (Long-Tail Keywords)

Blog posts target informational queries that build topical authority:

| Article | Target Keyword | Est. Monthly Search Volume |
|---------|---------------|---------------------------|
| Spa Etiquette Guide | "spa etiquette" | 5,400 |
| Medical Spa vs Day Spa | "medical spa vs day spa" | 3,600 |
| Best Thermal Spas Europe | "thermal spas europe" | 2,900 |
| What Is a Wellness Retreat | "wellness retreat" | 8,100 |
| Best Couples Spa Retreats | "couples spa retreat" | 4,400 |
| Spa Tipping Guide | "how much to tip at spa" | 6,600 |

**Already created:** `spa-etiquette-guide`, `medical-spa-vs-day-spa`

**Content calendar:** Publish 2-3 articles per week. Use `lib/content.js` → `generateBlogIdeas()` for a full list.

### Priority 3: Country Guide Pages

Similar to city pages but broader. Target "best spas in [country]" keywords. Custom editorial intros already exist for 7 countries in `lib/content.js`.

---

## Link Building Strategy

### Embeddable Badges

Create embeddable badges that spas can put on their websites:

```html
<!-- "Ranked on Spa-Review.com" badge -->
<a href="https://spa-review.com/spa/chiva-som-hua-hin">
  <img src="https://spa-review.com/badges/ranked.svg" alt="Ranked on Spa-Review" />
</a>
```

Each badge = a backlink. Reach out to top-ranked spas and offer badges.

### Annual Awards Program

Create a "Spa-Review Awards 2026" program:
- Nominate spas in categories (Best Medical Spa, Best Thermal Spa, etc.)
- Spas promote their nominations (= backlinks + social shares)
- Creates annual content refresh cycle
- Press coverage potential

### Industry Outreach

- Guest posts on travel and wellness publications
- Get listed on "best travel resources" roundup pages
- Partner with spa booking platforms for reciprocal links
- PR outreach when launching or updating the list

---

## Google Search Console Setup

1. **Verify ownership** at `https://search.google.com/search-console`
2. **Submit sitemap:** `https://spa-review.com/sitemap.xml`
3. **Request indexing** for key pages (homepage, top 20 city pages)
4. **Monitor:**
   - Coverage report (indexed vs. excluded pages)
   - Core Web Vitals
   - Search performance (clicks, impressions, CTR, position)
   - Rich results status (FAQ, star ratings, etc.)

---

## Google Analytics Setup

1. Create GA4 property at `https://analytics.google.com`
2. Set `NEXT_PUBLIC_GA_ID` environment variable
3. Key events to track:
   - `book_click` — "Book Now" button clicks
   - `spa_view` — Spa detail page views
   - `search_filter` — Search/filter usage
   - `external_link` — Google Maps / Google Search clicks

---

## Deployment Recommendations

### Vercel (Recommended)

```bash
npm install
npm run build
# Deploy via Vercel CLI or GitHub integration
```

Vercel provides:
- Automatic ISR (Incremental Static Regeneration)
- Edge CDN for global performance
- Automatic HTTPS
- Preview deployments

### Self-Hosted

```bash
npm run build
npm start
```

Place behind Cloudflare or similar CDN for caching and performance.

---

## File Structure

```
spa-review/
├── app/
│   ├── layout.js          # Root layout with global SEO, fonts, analytics
│   ├── page.js            # Homepage (Global Top 50)
│   ├── sitemap.js         # Auto-generated XML sitemap
│   ├── robots.js          # robots.txt
│   ├── spa/[slug]/page.js # Individual spa pages (50,000)
│   ├── country/[slug]/page.js  # Country pages (113)
│   ├── city/[slug]/page.js     # City pages (564)
│   └── blog/[slug]/page.js     # Blog posts
├── lib/
│   ├── spa-db.js          # Database queries, slugs, meta generators
│   ├── spa-data.js        # Compact 50K spa database (from artifact)
│   ├── schema.js          # JSON-LD structured data generators
│   └── content.js         # Editorial content, FAQs, blog ideas
├── public/
│   ├── og-image.jpg       # Default social sharing image
│   ├── favicon.ico        # Favicon
│   └── badges/            # Embeddable ranking badges
├── scripts/
│   └── generate-content.mjs  # Batch content generation script
├── next.config.js         # SEO headers, redirects, image config
├── tailwind.config.js     # Custom theme
└── package.json
```

---

## Migration Checklist

- [ ] Export spa data from React artifact to `lib/spa-data.js`
- [ ] Install dependencies: `npm install`
- [ ] Build and test locally: `npm run build && npm start`
- [ ] Register domain: `spa-review.com`
- [ ] Deploy to Vercel (connect GitHub repo)
- [ ] Set up Google Search Console
- [ ] Submit sitemap
- [ ] Set up Google Analytics (GA4)
- [ ] Write custom editorial intros for top 30 cities
- [ ] Create OG image template
- [ ] Design embeddable badges
- [ ] Publish first 5 blog posts
- [ ] Begin link building outreach
- [ ] Monitor Search Console weekly for indexing issues
- [ ] Set up rank tracking for target keywords

---

## Expected Timeline

| Week | Milestone |
|------|-----------|
| 1 | Deploy Next.js site, submit sitemap, set up Search Console |
| 2-3 | Write editorial content for top 30 cities |
| 4-6 | Publish 10+ blog posts targeting long-tail keywords |
| 6-8 | Begin seeing pages indexed in Google |
| 8-12 | Start link building, badge outreach |
| 12-16 | First organic traffic from long-tail keywords |
| 16-24 | Ramp up content, target higher-competition keywords |
| 24+ | Sustained organic growth, authority building |

SEO is a compounding investment. The 50,000-page architecture gives you an enormous advantage — most competitors have 100-500 pages. Consistent content creation and link building will activate that advantage over 6-12 months.
