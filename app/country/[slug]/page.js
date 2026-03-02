// app/country/[slug]/page.js
// Country spa guide page — SSR for SEO

import { notFound } from 'next/navigation';
import {
  getAllCountries, getCountryStats, getCityStats, getSpasForCountry,
  getCountryMetaTitle, getCountryMetaDescription, toSlug, getSpaPhotoUrl,
} from '../../../lib/spa-db';
import { JsonLd } from '../../../lib/schema';
import { spaListSchema, breadcrumbSchema } from '../../../lib/schema';
import { getCountryIntro } from '../../../lib/content';

export const dynamicParams = true;

export async function generateStaticParams() {
  // Generate on-demand for all countries
  return [];
}

export async function generateMetadata({ params }) {
  const countries = getAllCountries();
  const country = countries.find(c => toSlug(c) === params.slug);
  if (!country) return { title: 'Country Not Found' };
  const cities = getCityStats(country);
  const spaCount = cities.reduce((a, c) => a + c.spas, 0);
  return {
    title: getCountryMetaTitle(country),
    description: getCountryMetaDescription(country, cities.length, spaCount),
    alternates: { canonical: `https://spa-review.com/country/${params.slug}` },
    openGraph: {
      title: getCountryMetaTitle(country),
      description: getCountryMetaDescription(country, cities.length, spaCount),
      url: `https://spa-review.com/country/${params.slug}`,
    },
  };
}

export default function CountryPage({ params }) {
  const countries = getAllCountries();
  const country = countries.find(c => toSlug(c) === params.slug);
  if (!country) notFound();

  const cities = getCityStats(country);
  const topSpas = getSpasForCountry(country, 20);
  const totalSpas = cities.reduce((a, c) => a + c.spas, 0);
  const intro = getCountryIntro(country, cities.length, totalSpas);

  return (
    <>
      <JsonLd data={spaListSchema(topSpas, `Best Spas in ${country}`, `https://spa-review.com/country/${params.slug}`)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: country },
      ])} />

      <article style={{ maxWidth: 1080, margin: '0 auto', padding: '24px' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#6a6560', marginBottom: 24 }}>
          <a href="/" style={{ color: '#c4a87c', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{country}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#c4a87c', marginBottom: 8 }}>
            {totalSpas.toLocaleString()} Spas · {cities.length} Cities
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, color: '#f5f0e8', lineHeight: 1.05, margin: 0 }}>
            Best Spas in <span style={{ color: '#c4a87c', fontWeight: 600, fontStyle: 'italic' }}>{country}</span>
          </h1>
          {/* Editorial Intro */}
          <p style={{ fontSize: 18, lineHeight: 1.8, color: '#8a8278', maxWidth: 720, marginTop: 16, fontFamily: "'Cormorant Garamond', serif" }}>
            {intro}
          </p>
        </header>

        {/* City Grid */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c', marginBottom: 16 }}>
            Explore by City
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {cities.map(c => (
              <a key={c.city} href={`/city/${c.slug}`} style={{
                padding: '14px 16px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                textDecoration: 'none', display: 'block', transition: 'border-color 0.2s',
              }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: '#f5f0e8' }}>{c.city}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#6a6560', marginTop: 2 }}>{c.spas} spas</div>
              </a>
            ))}
          </div>
        </section>

        {/* Top Spas */}
        <section>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c', marginBottom: 16 }}>
            Top-Rated Spas in {country}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {topSpas.map(spa => (
              <a key={spa.slug} href={`/spa/${spa.slug}`} style={{ textDecoration: 'none', display: 'block', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(196,168,124,0.06)', background: 'rgba(255,255,255,0.015)', transition: 'transform 0.3s, border-color 0.3s' }}>
                <img src={getSpaPhotoUrl(spa.name, spa.city, 600, 400)} alt={spa.name} width={600} height={210} loading="lazy" style={{ width: '100%', height: 180, objectFit: 'cover', filter: 'brightness(0.78) saturate(0.8)' }} />
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, color: '#c4a87c', marginBottom: 4 }}>#{spa.rank}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#f5f0e8', marginBottom: 2 }}>{spa.name}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#6a6560' }}>{spa.city} · ⭐ {spa.rating} ({spa.reviews.toLocaleString()} reviews)</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Internal Links */}
        <nav style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid rgba(196,168,124,0.06)' }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#4a4540', marginBottom: 12 }}>
            More Countries
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {countries.filter(c => c !== country).slice(0, 12).map(c => (
              <a key={c} href={`/country/${toSlug(c)}`} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#c4a87c', textDecoration: 'none', padding: '4px 10px', borderRadius: 4, border: '1px solid rgba(196,168,124,0.12)' }}>{c}</a>
            ))}
          </div>
        </nav>
      </article>
    </>
  );
}
