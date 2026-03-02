// app/blog/[slug]/page.js
// Blog post page — for content marketing SEO
// In production, content would come from a CMS (Sanity, Contentful, MDX files, etc.)

import { notFound } from 'next/navigation';
import { JsonLd } from '../../../lib/schema';
import { articleSchema, breadcrumbSchema } from '../../../lib/schema';

// Sample blog posts — in production, load from CMS or MDX
const POSTS = {
  'spa-etiquette-guide': {
    title: 'The Complete Guide to Spa Etiquette — What You Need to Know Before Your First Visit',
    description: 'From tipping to dress codes, learn everything about spa etiquette so you can relax with confidence at any spa worldwide.',
    publishedDate: '2025-12-01',
    modifiedDate: '2026-01-15',
    category: 'Education',
    readTime: '8 min read',
    content: `
      <h2>Before You Arrive</h2>
      <p>Your spa experience begins well before you step through the door. Arrive 15-20 minutes early to check in, change, and begin relaxing. Most spas provide robes, slippers, and lockers — you typically only need to bring yourself. If you're visiting a co-ed thermal spa or bathhouse, check the dress code in advance, as customs vary dramatically by culture and country.</p>
      
      <h2>During Your Treatment</h2>
      <p>Communication is key. Your therapist wants you to enjoy the experience, so speak up about pressure preferences, temperature, and any areas of concern. It's perfectly acceptable to request adjustments mid-treatment. Most importantly, don't feel pressured to make conversation — silence is not only acceptable, it's expected.</p>

      <h2>The Tipping Question</h2>
      <p>Tipping customs vary widely. In the United States, 15-20% is standard at most spas. In Europe, tipping is less common but appreciated (rounding up or 5-10% is typical). In Southeast Asia, small tips of $2-5 per treatment are welcomed. At luxury resort spas, a service charge is often included. When in doubt, ask the front desk about the house policy.</p>

      <h2>Phone Etiquette</h2>
      <p>This is non-negotiable: silence your phone and leave it in your locker. The spa is a shared sanctuary, and phone noise — including vibrations — disrupts everyone's experience. If you're waiting for an urgent call, let the front desk know and they'll find you.</p>

      <h2>Thermal Spa & Bathhouse Customs</h2>
      <p>These vary enormously by country. In Japan's onsen, nudity is required and tattoos may be restricted. In Korean jjimjilbang, the bathing areas are gender-separated and nude, while common areas require the provided uniforms. European thermal spas often have textile-free zones. Always research local customs before visiting.</p>

      <h2>After Your Treatment</h2>
      <p>Don't rush. Most spas offer relaxation rooms, herbal teas, and sometimes light snacks post-treatment. Take advantage of these — the benefits of your treatment continue as you rest. Avoid strenuous exercise, alcohol, and heavy meals for at least an hour afterward. Drink plenty of water to help your body process the treatment.</p>
    `,
  },
  'medical-spa-vs-day-spa': {
    title: 'Medical Spa vs Day Spa — Which Is Right for You?',
    description: 'Understanding the key differences between medical spas and day spas will help you choose the right experience for your wellness goals.',
    publishedDate: '2025-11-15',
    modifiedDate: '2026-01-10',
    category: 'Education',
    readTime: '6 min read',
    content: `
      <h2>What Is a Day Spa?</h2>
      <p>A day spa offers relaxation-focused treatments that you can enjoy in a single visit without an overnight stay. Think massages, facials, body wraps, manicures, and pedicures. Day spas prioritize the sensory experience — soothing music, aromatic oils, warm towels — and are ideal when you want to decompress and feel pampered.</p>

      <h2>What Is a Medical Spa?</h2>
      <p>A medical spa (or medi-spa) combines the relaxing atmosphere of a traditional spa with medical-grade treatments supervised by licensed healthcare professionals. Services may include Botox, laser treatments, chemical peels, IV therapy, cryotherapy, and body contouring. Results are typically more dramatic and longer-lasting than those from a day spa.</p>

      <h2>Key Differences</h2>
      <p><strong>Supervision:</strong> Medical spas operate under a physician's oversight. Day spas are staffed by licensed estheticians and massage therapists but don't require medical direction.</p>
      <p><strong>Treatments:</strong> Medical spas can offer procedures that penetrate deeper skin layers or involve injectables. Day spas focus on surface-level treatments and relaxation.</p>
      <p><strong>Results:</strong> Medical spa treatments often show visible results within days or weeks. Day spa benefits are primarily experiential and stress-reducing.</p>
      <p><strong>Price:</strong> Medical spa treatments generally cost $150-$500+ per session. Day spa treatments typically range from $50-$200.</p>

      <h2>Which Should You Choose?</h2>
      <p>Choose a <strong>day spa</strong> if you want to relax, de-stress, and enjoy a sensory experience. It's also the better choice for regular self-care routines, couples experiences, and gift certificates.</p>
      <p>Choose a <strong>medical spa</strong> if you have specific aesthetic goals (wrinkle reduction, skin rejuvenation, body contouring), want clinically-proven results, or are interested in preventative anti-aging treatments.</p>
      <p>Many people enjoy both — regular day spa visits for maintenance and relaxation, with periodic medical spa treatments for targeted concerns.</p>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = POSTS[params.slug];
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://spa-review.com/blog/${params.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://spa-review.com/blog/${params.slug}`,
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: ['Spa-Review Editorial'],
    },
  };
}

export default function BlogPost({ params }) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  return (
    <>
      <JsonLd data={articleSchema({ ...post, slug: params.slug })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.title },
      ])} />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px 80px' }}>
        <nav aria-label="Breadcrumb" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#6a6560', marginBottom: 24 }}>
          <a href="/" style={{ color: '#c4a87c', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <a href="/blog" style={{ color: '#c4a87c', textDecoration: 'none' }}>Blog</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{post.title.slice(0, 40)}...</span>
        </nav>

        <header>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c', padding: '3px 8px', borderRadius: 4, background: 'rgba(196,168,124,0.08)', border: '1px solid rgba(196,168,124,0.15)' }}>{post.category}</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#6a6560' }}>{post.readTime}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, color: '#f5f0e8', lineHeight: 1.15, margin: '0 0 12px' }}>
            {post.title}
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#6a6560' }}>
            Published {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {post.modifiedDate !== post.publishedDate && ` · Updated ${new Date(post.modifiedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
          </p>
          <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, #c4a87c, transparent)', margin: '24px 0' }} />
        </header>

        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            lineHeight: 1.8,
            color: '#b0a898',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Links */}
        <nav style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid rgba(196,168,124,0.06)' }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#4a4540', marginBottom: 12 }}>
            Related Reading
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(POSTS).filter(([s]) => s !== params.slug).map(([slug, p]) => (
              <a key={slug} href={`/blog/${slug}`} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#c4a87c', textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(196,168,124,0.15)' }}>
                {p.title.slice(0, 50)}...
              </a>
            ))}
            <a href="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#c4a87c', textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(196,168,124,0.15)' }}>
              Browse the Global Top 50 →
            </a>
          </div>
        </nav>
      </article>
    </>
  );
}
