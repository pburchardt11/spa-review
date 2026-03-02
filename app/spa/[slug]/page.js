// app/spa/[slug]/page.js
// Individual spa detail page — fully server-rendered for SEO

import { notFound } from 'next/navigation';
import {
  getSpaBySlug, getAllSlugs, getOfferings, getSpaPhotoUrl,
  getSpaMetaTitle, getSpaMetaDescription, toSlug,
} from '../../../lib/spa-db';
import { JsonLd } from '../../../lib/schema';
import { spaSchema, breadcrumbSchema, faqSchema } from '../../../lib/schema';
import { getSpaDescription } from '../../../lib/content';
import SpaPhotos from '../../../components/SpaPhotos';
import SpaGoogleData from '../../../components/SpaGoogleData';

// ─── Static Generation ───
// Only pre-render a few key pages at build time
// All other pages render on first visit (fast, cached automatically)
export const dynamicParams = true;

export async function generateStaticParams() {
  // Pre-render only the Global Top 50 spa slugs
  // All 50,000 other pages generate on-demand (still fully SEO-friendly)
  return [];
}

// ─── Dynamic Metadata ───
export async function generateMetadata({ params }) {
  const spa = getSpaBySlug(params.slug);
  if (!spa) return { title: 'Spa Not Found' };

  return {
    title: getSpaMetaTitle(spa),
    description: getSpaMetaDescription(spa),
    openGraph: {
      title: spa.name,
      description: getSpaMetaDescription(spa),
      url: `https://spa-review.com/spa/${spa.slug}`,
      type: 'website',
      images: [
        {
          url: getSpaPhotoUrl(spa.name, spa.city, 1200, 630),
          width: 1200,
          height: 630,
          alt: spa.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: spa.name,
      description: getSpaMetaDescription(spa),
      images: [getSpaPhotoUrl(spa.name, spa.city, 1200, 630)],
    },
    alternates: {
      canonical: `https://spa-review.com/spa/${spa.slug}`,
    },
  };
}

// ─── Page Component ───
export default function SpaPage({ params }) {
  const spa = getSpaBySlug(params.slug);
  if (!spa) notFound();

  const offerings = getOfferings(spa.type);
  const description = getSpaDescription({ ...spa, offerings });
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(spa.name + ' ' + spa.city)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(spa.name + ', ' + spa.city + ', ' + spa.country)}`;
  const bookUrl = `https://www.google.com/search?q=${encodeURIComponent(spa.name + ' ' + spa.city + ' book appointment')}`;
  const ourRating = Math.min(5, Math.round((spa.rating * 1.05 + 0.2) * 10) / 10);

  // FAQ data
  const faqs = [
    {
      question: `What treatments does ${spa.name} offer?`,
      answer: `${spa.name} offers a range of ${spa.type.toLowerCase()} services including ${offerings.slice(0, 6).join(', ')}, and more.`,
    },
    {
      question: `What is the rating of ${spa.name}?`,
      answer: `${spa.name} has a Google rating of ${spa.rating}/5 based on ${spa.reviews.toLocaleString()} reviews. Our editorial rating is ${ourRating}/5.`,
    },
    {
      question: `Where is ${spa.name} located?`,
      answer: `${spa.name} is located in ${spa.city}, ${spa.country}. You can find directions and the exact location on Google Maps.`,
    },
    {
      question: `How do I book ${spa.name}?`,
      answer: `You can book ${spa.name} by searching for their official website or contacting them directly. We recommend booking 1-2 weeks in advance for popular time slots.`,
    },
  ];

  return (
    <>
      {/* Structured Data */}
      <JsonLd data={spaSchema(spa)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: spa.country, url: `/country/${toSlug(spa.country)}` },
        { name: spa.city, url: `/city/${toSlug(spa.city)}` },
        { name: spa.name },
      ])} />
      <JsonLd data={faqSchema(faqs)} />

      <article>
        {/* Breadcrumbs (visible + semantic) */}
        <nav aria-label="Breadcrumb" style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12,
          color: '#6a6560',
          padding: '16px 24px',
          maxWidth: 960,
          margin: '0 auto',
        }}>
          <a href="/" style={{ color: '#c4a87c', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <a href={`/country/${toSlug(spa.country)}`} style={{ color: '#c4a87c', textDecoration: 'none' }}>{spa.country}</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <a href={`/city/${toSlug(spa.city)}`} style={{ color: '#c4a87c', textDecoration: 'none' }}>{spa.city}</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{spa.name}</span>
        </nav>

        {/* Hero */}
        <header style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
            <SpaPhotos
              name={spa.name}
              city={spa.city}
              country={spa.country}
              fallbackUrl={getSpaPhotoUrl(spa.name, spa.city, 1200, 500)}
              height={400}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '60px 32px 24px',
              background: 'linear-gradient(transparent, rgba(8,8,8,0.95))',
            }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 1, textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: 4,
                background: `${spa.typeColor}25`, color: spa.typeColor,
                border: `1px solid ${spa.typeColor}40`,
              }}>
                {spa.typeIcon} {spa.type}
              </span>
              <h1 style={{
                fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 500,
                color: '#f5f0e8', lineHeight: 1.1, marginTop: 12,
                fontFamily: "'Cormorant Garamond', serif",
              }}>
                {spa.name}
              </h1>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 14,
                color: '#8a8278', marginTop: 6,
              }}>
                📍 {spa.city}, {spa.country}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
          {/* Description (unique content for SEO) */}
          <section>
            <p style={{
              fontSize: 18, lineHeight: 1.8, color: '#b0a898',
              fontFamily: "'Cormorant Garamond', serif",
              maxWidth: 720,
            }}>
              {description}
            </p>
          </section>

          {/* Ratings Grid */}
          <section style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16, marginTop: 32,
          }}>
            <div style={{
              padding: 20, borderRadius: 12,
              background: 'rgba(196,168,124,0.04)',
              border: '1px solid rgba(196,168,124,0.08)',
            }}>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c',
                marginBottom: 8, marginTop: 0,
              }}>
                Spa-Review Rating
              </h3>
              <div style={{ fontSize: 36, fontWeight: 300, color: '#f5f0e8' }}>
                {ourRating}<span style={{ fontSize: 14, color: '#6a6560' }}>/5.0</span>
              </div>
            </div>
            <div style={{
              padding: 20, borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 1, textTransform: 'uppercase', color: '#6a6560',
                marginBottom: 8, marginTop: 0,
              }}>
                Google Rating
              </h3>
              <div style={{ fontSize: 36, fontWeight: 300, color: '#f5f0e8' }}>
                {spa.rating}<span style={{ fontSize: 14, color: '#6a6560' }}>/5.0</span>
              </div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#6a6560', margin: 0 }}>
                Based on {spa.reviews.toLocaleString()} reviews
              </p>
            </div>
          </section>

          {/* Offerings */}
          <section style={{ marginTop: 36 }}>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c',
              marginBottom: 16,
            }}>
              Treatments & Services
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {offerings.map((o, i) => (
                <span key={i} style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 12,
                  padding: '6px 14px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#b0a898',
                }}>
                  {o}
                </span>
              ))}
            </div>
          </section>

          {/* Map */}
          <section style={{ marginTop: 36 }}>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c',
              marginBottom: 16,
            }}>
              Location
            </h2>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <iframe
                title={`Map - ${spa.name}`}
                width="100%"
                height="300"
                style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) brightness(0.7) contrast(1.1)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(spa.name + ', ' + spa.city + ', ' + spa.country)}&output=embed`}
              />
            </div>
          </section>

          {/* CTA Buttons */}
          <section style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <a
              href={bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, minWidth: 160, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, padding: '14px 24px',
                borderRadius: 8, background: '#c4a87c', color: '#080808',
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                textDecoration: 'none', transition: 'background 0.2s',
              }}
            >
              📅 Book Now
            </a>
            <a
              href={googleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, minWidth: 160, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, padding: '14px 24px',
                borderRadius: 8, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', color: '#e8e4de',
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              🔍 View on Google
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, minWidth: 160, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, padding: '14px 24px',
                borderRadius: 8, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', color: '#e8e4de',
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              📍 Directions
            </a>
          </section>

          {/* Real Google Data: Reviews, Contact, Website */}
          <SpaGoogleData name={spa.name} city={spa.city} country={spa.country} />

          {/* FAQ Section (SEO gold) */}
          <section style={{ marginTop: 48 }}>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c',
              marginBottom: 20,
            }}>
              Frequently Asked Questions
            </h2>
            {faqs.map((faq, i) => (
              <details key={i} style={{
                marginBottom: 12, borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)',
                background: 'rgba(255,255,255,0.015)',
              }}>
                <summary style={{
                  padding: '14px 18px', cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif", fontSize: 14,
                  fontWeight: 500, color: '#e8e4de',
                  listStyle: 'none',
                }}>
                  {faq.question}
                </summary>
                <p style={{
                  padding: '0 18px 14px', margin: 0,
                  fontFamily: "'Outfit', sans-serif", fontSize: 13,
                  color: '#8a8278', lineHeight: 1.7,
                }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </section>

          {/* Internal Links (SEO) */}
          <nav style={{ marginTop: 40, padding: '20px 0', borderTop: '1px solid rgba(196,168,124,0.06)' }}>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase', color: '#4a4540',
              marginBottom: 12, marginTop: 0,
            }}>
              Explore More
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={`/city/${toSlug(spa.city)}`} style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 12,
                color: '#c4a87c', textDecoration: 'none',
                padding: '6px 12px', borderRadius: 6,
                border: '1px solid rgba(196,168,124,0.15)',
              }}>
                More spas in {spa.city} →
              </a>
              <a href={`/country/${toSlug(spa.country)}`} style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 12,
                color: '#c4a87c', textDecoration: 'none',
                padding: '6px 12px', borderRadius: 6,
                border: '1px solid rgba(196,168,124,0.15)',
              }}>
                All spas in {spa.country} →
              </a>
              <a href="/" style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 12,
                color: '#c4a87c', textDecoration: 'none',
                padding: '6px 12px', borderRadius: 6,
                border: '1px solid rgba(196,168,124,0.15)',
              }}>
                Global Top 50 →
              </a>
            </div>
          </nav>
        </div>
      </article>
    </>
  );
}
