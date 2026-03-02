// app/city/[slug]/page.js
// City spa guide page — SSR for SEO with editorial content and FAQs

import { notFound } from 'next/navigation';
import {
  getAllCountries, getCitiesForCountry, getSpasForCity,
  getCityMetaTitle, getCityMetaDescription, toSlug, getSpaPhotoUrl,
} from '../../../lib/spa-db';
import { JsonLd } from '../../../lib/schema';
import { spaListSchema, breadcrumbSchema, faqSchema } from '../../../lib/schema';
import { getCityIntro, getCityFAQs } from '../../../lib/content';

// Build city → country lookup
function findCityCountry(slug) {
  for (const country of getAllCountries()) {
    for (const city of getCitiesForCountry(country)) {
      if (toSlug(city) === slug) return { city, country };
    }
  }
  return null;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  // Generate on-demand for all cities
  return [];
}

export async function generateMetadata({ params }) {
  const match = findCityCountry(params.slug);
  if (!match) return { title: 'City Not Found' };
  const spas = getSpasForCity(match.country, match.city);
  return {
    title: getCityMetaTitle(match.city, match.country),
    description: getCityMetaDescription(match.city, match.country, spas.length),
    alternates: { canonical: `https://spa-review.com/city/${params.slug}` },
    openGraph: {
      title: getCityMetaTitle(match.city, match.country),
      description: getCityMetaDescription(match.city, match.country, spas.length),
      url: `https://spa-review.com/city/${params.slug}`,
    },
  };
}

export default function CityPage({ params }) {
  const match = findCityCountry(params.slug);
  if (!match) notFound();

  const { city, country } = match;
  const spas = getSpasForCity(country, city, 50);
  const intro = getCityIntro(city, country, spas.length);
  const faqs = getCityFAQs(city, country, spas);

  return (
    <>
      <JsonLd data={spaListSchema(spas, `Best Spas in ${city}`, `https://spa-review.com/city/${params.slug}`)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: country, url: `/country/${toSlug(country)}` },
        { name: city },
      ])} />
      <JsonLd data={faqSchema(faqs)} />

      <article style={{ maxWidth: 1080, margin: '0 auto', padding: '24px' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#6a6560', marginBottom: 24 }}>
          <a href="/" style={{ color: '#c4a87c', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <a href={`/country/${toSlug(country)}`} style={{ color: '#c4a87c', textDecoration: 'none' }}>{country}</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{city}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#c4a87c', marginBottom: 8 }}>
            {spas.length}+ Spas · {country}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, color: '#f5f0e8', lineHeight: 1.05, margin: 0 }}>
            Best Spas in <span style={{ color: '#c4a87c', fontWeight: 600, fontStyle: 'italic' }}>{city}</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: '#8a8278', maxWidth: 720, marginTop: 16, fontFamily: "'Cormorant Garamond', serif" }}>
            {intro}
          </p>
        </header>

        {/* Spa Grid */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {spas.map(spa => (
              <a key={spa.slug} href={`/spa/${spa.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(196,168,124,0.06)', background: 'rgba(255,255,255,0.015)', transition: 'transform 0.3s' }}>
                <img src={getSpaPhotoUrl(spa.name, spa.city, 600, 400)} alt={`${spa.name} - ${spa.type} in ${city}`} width={600} height={210} loading="lazy" style={{ width: '100%', height: 180, objectFit: 'cover', filter: 'brightness(0.78) saturate(0.8)' }} />
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, color: '#c4a87c' }}>#{spa.rank}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 3, background: `${spa.typeColor}20`, color: spa.typeColor, border: `1px solid ${spa.typeColor}40` }}>{spa.type}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#f5f0e8', marginBottom: 2 }}>{spa.name}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#6a6560' }}>⭐ {spa.rating} ({spa.reviews.toLocaleString()} reviews)</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c', marginBottom: 20 }}>
            Frequently Asked Questions about Spas in {city}
          </h2>
          {faqs.map((faq, i) => (
            <details key={i} style={{ marginBottom: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}>
              <summary style={{ padding: '14px 18px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: '#e8e4de', listStyle: 'none' }}>
                {faq.question}
              </summary>
              <p style={{ padding: '0 18px 14px', margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#8a8278', lineHeight: 1.7 }}>
                {faq.answer}
              </p>
            </details>
          ))}
        </section>

        {/* Nearby Cities */}
        <nav style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(196,168,124,0.06)' }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#4a4540', marginBottom: 12 }}>
            More Cities in {country}
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {getCitiesForCountry(country).filter(c => c !== city).slice(0, 12).map(c => (
              <a key={c} href={`/city/${toSlug(c)}`} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#c4a87c', textDecoration: 'none', padding: '4px 10px', borderRadius: 4, border: '1px solid rgba(196,168,124,0.12)' }}>{c}</a>
            ))}
          </div>
        </nav>
      </article>
    </>
  );
}
