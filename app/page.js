// app/page.js
// Homepage — Global Top 50 + country/city browsing

import { getAllCountries, getCitiesForCountry, getCountryStats, getTotalSpas, toSlug, getSpaPhotoUrl } from '../lib/spa-db';

const G50 = [
  { rank:1, name:"Lefay Resort & Spa Lago di Garda", city:"Gargnano", country:"Italy", rating:4.7, reviews:3842, type:"Resort Spa", tag:"Alpine air meets Italian soul on Lake Garda", aw:["Sunday Times #1 2025","Condé Nast"] },
  { rank:2, name:"Chiva-Som", city:"Hua Hin", country:"Thailand", rating:4.7, reviews:634, type:"Destination Spa", tag:"30 years of transformative healing", aw:["Sunday Times Top 50 2025"] },
  { rank:3, name:"RAKxa Integrative Wellness", city:"Bangkok", country:"Thailand", rating:4.8, reviews:412, type:"Medical Spa", tag:"Thai wisdom meets cutting-edge diagnostics", aw:["Sunday Times Best Medi-Spa 2025"] },
  { rank:4, name:"Palace Merano", city:"Merano", country:"Italy", rating:4.7, reviews:1287, type:"Medical Spa", tag:"Three decades of detox mastery", aw:["Sunday Times 2025"] },
  { rank:5, name:"Palazzo Fiuggi", city:"Fiuggi", country:"Italy", rating:4.7, reviews:689, type:"Medical Spa", tag:"Renaissance grandeur meets metabolic medicine", aw:["Sunday Times Best Nutrition"] },
  { rank:6, name:"SHA Wellness Clinic", city:"Alicante", country:"Spain", rating:4.3, reviews:1134, type:"Wellness Clinic", tag:"Science-driven longevity", aw:["World Spa Awards 2025"] },
  { rank:7, name:"Park Igls", city:"Innsbruck", country:"Austria", rating:4.8, reviews:523, type:"Medical Spa", tag:"Mayr medicine in the Alps", aw:["Sunday Times Top 50"] },
  { rank:8, name:"Euphoria Retreat", city:"Mystras", country:"Greece", rating:4.7, reviews:358, type:"Wellness Retreat", tag:"Greek healing in the Peloponnese", aw:["Sunday Times Top 50","Condé Nast Top 5"] },
  { rank:9, name:"Kamalaya Koh Samui", city:"Koh Samui", country:"Thailand", rating:4.8, reviews:1234, type:"Wellness Retreat", tag:"Soul sanctuary around a monk's cave", aw:["Condé Nast Awards"] },
  { rank:10, name:"Chenot Palace Weggis", city:"Weggis", country:"Switzerland", rating:4.5, reviews:347, type:"Medical Spa", tag:"Swiss precision on Lake Lucerne", aw:["Sunday Times Top 50"] },
  { rank:11, name:"Clinique La Prairie", city:"Montreux", country:"Switzerland", rating:4.5, reviews:287, type:"Medical Spa", tag:"Birthplace of longevity science since 1931" },
  { rank:12, name:"Mandarin Oriental Spa Marrakech", city:"Marrakech", country:"Morocco", rating:4.6, reviews:2156, type:"Hotel Spa", tag:"Moroccan tradition meets Oriental wellness" },
  { rank:13, name:"Lanserhof Tegernsee", city:"Tegernsee", country:"Germany", rating:4.5, reviews:612, type:"Medical Spa", tag:"Clinical precision meets Alpine serenity" },
  { rank:14, name:"COMO Shambhala Estate", city:"Ubud", country:"Indonesia", rating:4.7, reviews:1567, type:"Wellness Retreat", tag:"Bali's original back-to-nature retreat" },
  { rank:15, name:"Six Senses Ibiza", city:"Ibiza", country:"Spain", rating:4.5, reviews:891, type:"Resort Spa", tag:"Longevity science on the north shore" },
  { rank:16, name:"Ananda in the Himalayas", city:"Rishikesh", country:"India", rating:4.6, reviews:1847, type:"Destination Spa", tag:"Ayurvedic healing at the Ganges" },
  { rank:17, name:"Royal Mansour Spa", city:"Marrakech", country:"Morocco", rating:4.8, reviews:1523, type:"Hotel Spa", tag:"The world's finest hammam" },
  { rank:18, name:"Mii amo", city:"Sedona", country:"United States", rating:4.7, reviews:198, type:"Destination Spa", tag:"Desert spirituality amid red rocks" },
  { rank:19, name:"Bürgenstock Alpine Spa", city:"Bürgenstock", country:"Switzerland", rating:4.5, reviews:2634, type:"Resort Spa", tag:"10,000 sqm above Lake Lucerne" },
  { rank:20, name:"Ritz-Carlton Spa Fari Islands", city:"North Malé Atoll", country:"Maldives", rating:4.7, reviews:892, type:"Resort Spa", tag:"Overwater indulgence on the Indian Ocean" },
  { rank:21, name:"Lily of the Valley", city:"Saint-Tropez", country:"France", rating:4.4, reviews:1023, type:"Resort Spa", tag:"French glamour near Saint-Tropez" },
  { rank:22, name:"Zulal Wellness Resort", city:"Doha", country:"Qatar", rating:4.6, reviews:478, type:"Wellness Retreat", tag:"World's first Arabic Medicine resort" },
  { rank:23, name:"Banyan Tree Spa AlUla", city:"AlUla", country:"Saudi Arabia", rating:4.6, reviews:423, type:"Resort Spa", tag:"Desert heritage meets modern wellness" },
  { rank:24, name:"Engel Ayurpura", city:"Dolomites", country:"Italy", rating:4.7, reviews:312, type:"Wellness Retreat", tag:"Ayurveda in the UNESCO Dolomites" },
  { rank:25, name:"Golden Door", city:"San Diego", country:"United States", rating:4.9, reviews:156, type:"Destination Spa", tag:"Six decades of 40-guest excellence" },
  { rank:26, name:"Schloss Elmau", city:"Munich", country:"Germany", rating:4.6, reviews:2341, type:"Resort Spa", tag:"Six spas in a Bavarian castle" },
  { rank:27, name:"Brenners Park-Hotel & Spa", city:"Baden-Baden", country:"Germany", rating:4.6, reviews:1876, type:"Hotel Spa", tag:"Grand tradition in thermal town" },
  { rank:28, name:"JOALI BEING", city:"Baa Atoll", country:"Maldives", rating:4.6, reviews:189, type:"Wellness Retreat", tag:"An entire island for wellbeing" },
  { rank:29, name:"Guerlain Spa One&Only Aesthesis", city:"Athens", country:"Greece", rating:4.7, reviews:567, type:"Resort Spa", tag:"Parisian beauty on the Athens Riviera" },
  { rank:30, name:"Ayurveda Resort Mandira", city:"Graz", country:"Austria", rating:4.8, reviews:198, type:"Wellness Retreat", tag:"European Ayurveda in Styrian hills" },
  { rank:31, name:"SHA Mexico", city:"Cancun", country:"Mexico", rating:4.6, reviews:234, type:"Wellness Clinic", tag:"The SHA Method meets the Caribbean" },
  { rank:32, name:"Aqua Dome Tirol Therme", city:"Längenfeld", country:"Austria", rating:4.5, reviews:8923, type:"Thermal Spa", tag:"Futuristic thermal bowls in Tyrol" },
  { rank:33, name:"Forte Village Resort", city:"Sardinia", country:"Italy", rating:4.4, reviews:4521, type:"Resort Spa", tag:"Thalassotherapy on Sardinia's coast" },
  { rank:34, name:"Lanserhof Lans", city:"Innsbruck", country:"Austria", rating:4.5, reviews:456, type:"Medical Spa", tag:"The original Lanserhof since 2006" },
  { rank:35, name:"One&Only Kéa Island", city:"Crete", country:"Greece", rating:4.7, reviews:178, type:"Resort Spa", tag:"Aegean jewel with wellness innovation" },
  { rank:36, name:"Rancho La Puerta", city:"Cabo San Lucas", country:"Mexico", rating:4.8, reviews:287, type:"Destination Spa", tag:"Since 1940 — farm-to-table spa" },
  { rank:37, name:"Mount Med Resort", city:"Innsbruck", country:"Austria", rating:4.8, reviews:123, type:"Medical Spa", tag:"Biohacking and Alpine healing" },
  { rank:38, name:"Morpheus Spa City of Dreams", city:"Macau", country:"China", rating:4.4, reviews:3421, type:"Hotel Spa", tag:"Zaha Hadid meets wellness" },
  { rank:39, name:"Tschuggen Grand Bergoase", city:"St. Moritz", country:"Switzerland", rating:4.5, reviews:723, type:"Hotel Spa", tag:"Mario Botta's mountain masterpiece" },
  { rank:40, name:"Garrya Mù Cang Chải", city:"Hanoi", country:"Vietnam", rating:4.7, reviews:89, type:"Wellness Retreat", tag:"Wellness amid terraced rice paddies" },
  { rank:41, name:"Aro Hā Wellness Retreat", city:"Queenstown", country:"New Zealand", rating:4.9, reviews:112, type:"Wellness Retreat", tag:"Off-grid mindfulness in Southern Alps" },
  { rank:42, name:"Shreyas Retreat", city:"Bangalore", country:"India", rating:4.7, reviews:345, type:"Wellness Retreat", tag:"Silent yoga and organic living" },
  { rank:43, name:"Sunstone Spa", city:"Palm Springs", country:"United States", rating:4.6, reviews:1234, type:"Resort Spa", tag:"Desert healing waters" },
  { rank:44, name:"Delaire Graff Spa", city:"Cape Town", country:"South Africa", rating:4.7, reviews:789, type:"Resort Spa", tag:"Wellness amid the Cape Winelands" },
  { rank:45, name:"Daios Cove", city:"Crete", country:"Greece", rating:4.5, reviews:2134, type:"Resort Spa", tag:"Holistic healing on a private beach" },
  { rank:46, name:"Llao Llao Resort Spa", city:"Bariloche", country:"Argentina", rating:4.5, reviews:4567, type:"Resort Spa", tag:"Patagonian grandeur on Lake Nahuel Huapi" },
  { rank:47, name:"Lime Wood Hotel & Spa", city:"New Forest", country:"United Kingdom", rating:4.6, reviews:1876, type:"Hotel Spa", tag:"England's finest in the New Forest" },
  { rank:48, name:"Six Senses Douro Valley", city:"Porto", country:"Portugal", rating:4.6, reviews:2345, type:"Resort Spa", tag:"Vineyard wellness in the Douro" },
  { rank:49, name:"ADLER Spa Resort Sicilia", city:"Sicily", country:"Italy", rating:4.6, reviews:1567, type:"Resort Spa", tag:"Sicilian warmth meets Tyrolean wellness" },
  { rank:50, name:"St. Regis Spa The Palm", city:"Dubai", country:"UAE", rating:4.5, reviews:5678, type:"Hotel Spa", tag:"Ultra-luxe on Palm Jumeirah" },
];

const TYPE_COLORS = {
  'Day Spa': '#ec4899', 'Hotel Spa': '#ca8a04', 'Resort Spa': '#2563eb',
  'Wellness Retreat': '#16a34a', 'Destination Spa': '#7e22ce',
  'Medical Spa': '#dc2626', 'Wellness Clinic': '#0891b2', 'Thermal Spa': '#ea580c',
};

export const metadata = {
  title: "Spa-Review — The World's Definitive Spa Guide | 50,000+ Spas Reviewed",
  description: "Discover the 50 best spas in the world plus 50,000+ spas and wellness retreats across 113 countries. Expert ratings, Google reviews, treatment details & direct booking.",
  alternates: { canonical: 'https://spa-review.com' },
};

export default function HomePage() {
  const countries = getCountryStats();
  const totalSpas = getTotalSpas();
  const totalCountries = countries.length;
  const totalCities = countries.reduce((a, c) => a + c.cities, 0);

  return (
    <main style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: '#080808', color: '#e8e4de', minHeight: '100vh' }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        position: 'relative', minHeight: '75vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 40%, rgba(180,140,80,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(60,80,120,0.06) 0%, transparent 50%), #080808',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.02,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 119px, rgba(196,168,124,0.5) 119px, rgba(196,168,124,0.5) 120px)',
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860, padding: '0 24px' }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 500,
            letterSpacing: 5, textTransform: 'uppercase', color: '#c4a87c', marginBottom: 28,
          }}>
            {totalSpas.toLocaleString()} Spas · {totalCountries} Countries · {totalCities} Cities
          </div>
          <h1 style={{
            fontSize: 'clamp(44px, 8vw, 100px)', fontWeight: 300,
            lineHeight: 0.95, letterSpacing: -2, color: '#f5f0e8', margin: 0,
          }}>
            The World{"'"}s Best<br />
            <span style={{ color: '#c4a87c', fontWeight: 600, fontStyle: 'italic' }}>Spas</span> Reviewed
          </h1>
          <div style={{
            width: 50, height: 1,
            background: 'linear-gradient(90deg, transparent, #c4a87c, transparent)',
            margin: '18px auto',
          }} />
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(12px, 1.6vw, 15px)',
            fontWeight: 300, color: '#6a6560', lineHeight: 1.7, maxWidth: 520, margin: '20px auto 0',
          }}>
            The definitive guide to {totalSpas.toLocaleString()}+ spas and wellness retreats across {totalCountries} countries.
            Expert ratings, verified Google reviews, and direct booking.
          </p>
        </div>
      </section>

      {/* ═══ GLOBAL TOP 50 ═══ */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 24, paddingBottom: 12,
          borderBottom: '1px solid rgba(196,168,124,0.06)',
        }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: '#f5f0e8', letterSpacing: -1, margin: 0 }}>
            The Definitive <span style={{ color: '#c4a87c', fontWeight: 500 }}>50</span>
          </h2>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#4a4540' }}>
            Global Top 50 Spas
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {G50.map(spa => {
            const col = TYPE_COLORS[spa.type] || '#c4a87c';
            const slug = spa.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + spa.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            return (
              <a key={spa.rank} href={`/spa/${slug}`} style={{
                textDecoration: 'none', display: 'block', borderRadius: 10, overflow: 'hidden',
                border: '1px solid rgba(196,168,124,0.06)', background: 'rgba(255,255,255,0.015)',
                transition: 'transform 0.3s, border-color 0.3s',
              }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={getSpaPhotoUrl(spa.name, spa.city, 640, 420)}
                    alt={`${spa.name} — ${spa.type} in ${spa.city}, ${spa.country}`}
                    width={640} height={210} loading={spa.rank <= 6 ? 'eager' : 'lazy'}
                    style={{ width: '100%', height: 210, objectFit: 'cover', filter: 'brightness(0.78) saturate(0.8) contrast(1.05)' }}
                  />
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 600,
                    color: spa.rank <= 10 ? '#080808' : '#fff',
                    background: spa.rank <= 10 ? 'rgba(196,168,124,0.9)' : 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(6px)', padding: '3px 8px', borderRadius: 3,
                  }}>
                    #{spa.rank}
                  </div>
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    fontFamily: "'Outfit', sans-serif", fontSize: 8, fontWeight: 600,
                    letterSpacing: 0.5, textTransform: 'uppercase',
                    padding: '3px 6px', borderRadius: 3, backdropFilter: 'blur(6px)',
                    background: `${col}20`, color: col, border: `1px solid ${col}40`,
                  }}>
                    {spa.type}
                  </div>
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ fontSize: 17, fontWeight: 500, color: '#f5f0e8', lineHeight: 1.25, marginBottom: 2 }}>
                    {spa.name}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#6a6560', fontWeight: 300, marginBottom: 6 }}>
                    {spa.city}, {spa.country}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#8a8278', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.4 }}>
                    {spa.tag}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: '#f5f0e8' }}>
                      ⭐ {spa.rating}
                    </span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: '#6a6560' }}>
                      ({spa.reviews.toLocaleString()} reviews)
                    </span>
                    {spa.aw && spa.aw.map((a, j) => (
                      <span key={j} style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: 7,
                        padding: '2px 5px', borderRadius: 3,
                        background: 'rgba(196,168,124,0.07)', border: '1px solid rgba(196,168,124,0.1)',
                        color: '#c4a87c',
                      }}>
                        🏆 {a}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ═══ BROWSE BY COUNTRY ═══ */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{
          marginBottom: 24, paddingBottom: 12,
          borderBottom: '1px solid rgba(196,168,124,0.06)',
        }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: '#f5f0e8', letterSpacing: -1, margin: 0 }}>
            Browse by <span style={{ color: '#c4a87c', fontWeight: 500 }}>Country</span>
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#6a6560', marginTop: 8 }}>
            {totalSpas.toLocaleString()} spas across {totalCountries} countries
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {countries.map(c => (
            <a key={c.country} href={`/country/${c.slug}`} style={{
              padding: '14px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
              textDecoration: 'none', display: 'block', transition: 'border-color 0.2s',
            }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: '#f5f0e8' }}>
                {c.country}
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#6a6560', marginTop: 2 }}>
                {c.spas.toLocaleString()} spas · {c.cities} cities
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT / SEO TEXT ═══ */}
      <section style={{
        maxWidth: 760, margin: '0 auto', padding: '40px 24px 60px',
        borderTop: '1px solid rgba(196,168,124,0.06)',
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 400, color: '#f5f0e8', marginBottom: 16, margin: '0 0 16px' }}>
          About Spa-Review
        </h2>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#8a8278', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>
            Spa-Review is the world{"'"}s most comprehensive spa directory, featuring {totalSpas.toLocaleString()}+ spas
            and wellness retreats across {totalCountries} countries and {totalCities} cities. We combine expert editorial
            curation with verified Google review data to help you find the perfect spa experience anywhere in the world.
          </p>
          <p style={{ marginBottom: 16 }}>
            Our Global Top 50 is curated annually based on treatment quality, facilities, guest experience, innovation,
            and critical acclaim from leading publications including the Sunday Times, Condé Nast Traveller, and the
            World Spa Awards.
          </p>
          <p>
            Whether you{"'"}re looking for a luxury resort spa, a transformative wellness retreat, a cutting-edge medical
            spa, or a relaxing day spa near you — Spa-Review helps you compare ratings, explore treatments, and book
            with confidence.
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: '28px 24px', textAlign: 'center', borderTop: '1px solid rgba(196,168,124,0.04)' }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#c4a87c', marginBottom: 4 }}>Spa-Review</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, color: '#2a2520', letterSpacing: 1 }}>
          © {new Date().getFullYear()} Spa-Review.com · {totalSpas.toLocaleString()} Spas · {totalCountries} Countries
        </div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: '#3a3530', marginTop: 8, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/blog/spa-etiquette-guide" style={{ color: '#4a4540', textDecoration: 'none' }}>Spa Etiquette Guide</a>
          <a href="/blog/medical-spa-vs-day-spa" style={{ color: '#4a4540', textDecoration: 'none' }}>Medical Spa vs Day Spa</a>
        </div>
      </footer>
    </main>
  );
}
