// lib/spa-db.js
// Central spa database with SEO-friendly helpers
// In production, this would be backed by a real database (Postgres, etc.)
// For now, we import the compact DB and expand it on-demand

import { DB } from './spa-data'; // The 50K compact data

// ─── Type Mappings ───
export const TYPE_MAP = {
  D: 'Day Spa', H: 'Hotel Spa', R: 'Resort Spa', W: 'Wellness Retreat',
  S: 'Destination Spa', M: 'Medical Spa', C: 'Wellness Clinic', T: 'Thermal Spa',
};

export const TYPE_COLORS = {
  'Day Spa': '#ec4899', 'Hotel Spa': '#ca8a04', 'Resort Spa': '#2563eb',
  'Wellness Retreat': '#16a34a', 'Destination Spa': '#7e22ce',
  'Medical Spa': '#dc2626', 'Wellness Clinic': '#0891b2', 'Thermal Spa': '#ea580c',
};

export const TYPE_ICONS = {
  'Day Spa': '💆', 'Hotel Spa': '✨', 'Resort Spa': '🏖️',
  'Wellness Retreat': '🌿', 'Destination Spa': '🧘', 'Medical Spa': '🏥',
  'Wellness Clinic': '🔬', 'Thermal Spa': '♨️',
};

// ─── Slug Utilities ───
export function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function spaSlug(name, city) {
  // Don't add city again if name already ends with it
  const nameSlug = toSlug(name);
  const citySlug = toSlug(city);
  if (nameSlug.endsWith(citySlug)) {
    return nameSlug;
  }
  return toSlug(`${name}-${city}`);
}

// ─── Photo URL (deterministic) ───
export function spaHash(name, location) {
  let h = 0;
  const s = name + location;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getSpaPhotoUrl(name, location, w = 600, h = 400) {
  return `https://picsum.photos/seed/${spaHash(name, location)}/${w}/${h}`;
}

// ─── Expand compact entry to full spa object ───
function expandSpa(entry, city, country, rank = 0) {
  const [name, ratingX10, reviewsDiv10, typeChar] = entry;
  const fullName = name.includes(city) ? name : (name.match(/^[A-Z]/) ? `${name} ${city}` : `${city} ${name}`);
  const type = TYPE_MAP[typeChar] || 'Day Spa';
  return {
    name: fullName,
    slug: spaSlug(fullName, city),
    city,
    country,
    rating: ratingX10 / 10,
    reviews: reviewsDiv10 * 10,
    type,
    typeColor: TYPE_COLORS[type] || '#c4a87c',
    typeIcon: TYPE_ICONS[type] || '💎',
    rank,
    photo: getSpaPhotoUrl(fullName, city),
  };
}

// ─── Query Functions ───

export function getAllCountries() {
  return Object.keys(DB).sort();
}

export function getCitiesForCountry(country) {
  return DB[country] ? Object.keys(DB[country]).sort() : [];
}

export function getTotalSpas() {
  let t = 0;
  for (const c of Object.keys(DB))
    for (const ct of Object.keys(DB[c]))
      t += DB[c][ct].length;
  return t;
}

export function getCountryStats() {
  const stats = [];
  for (const country of Object.keys(DB)) {
    let total = 0;
    const cities = Object.keys(DB[country]);
    for (const city of cities) total += DB[country][city].length;
    stats.push({ country, slug: toSlug(country), cities: cities.length, spas: total });
  }
  return stats.sort((a, b) => b.spas - a.spas);
}

export function getCityStats(country) {
  if (!DB[country]) return [];
  const stats = [];
  for (const city of Object.keys(DB[country])) {
    stats.push({
      city,
      country,
      slug: toSlug(city),
      spas: DB[country][city].length,
    });
  }
  return stats.sort((a, b) => b.spas - a.spas);
}

export function getSpasForCountry(country, limit = 50) {
  if (!DB[country]) return [];
  const all = [];
  for (const city of Object.keys(DB[country])) {
    for (const entry of DB[country][city]) {
      all.push(expandSpa(entry, city, country));
    }
  }
  return all
    .sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews))
    .slice(0, limit)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function getSpasForCity(country, city, limit = 50) {
  if (!DB[country]?.[city]) return [];
  return DB[country][city]
    .map((entry, i) => expandSpa(entry, city, country))
    .sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews))
    .slice(0, limit)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

// ─── Global Top 50 (curated, not in DB) ───
const G50 = [
  { name:"Lefay Resort & Spa Lago di Garda", city:"Gargnano", country:"Italy", rating:4.7, reviews:3842, type:"Resort Spa", tag:"Alpine air meets Italian soul on Lake Garda", aw:["Sunday Times #1 2025","Condé Nast"] },
  { name:"Chiva-Som", city:"Hua Hin", country:"Thailand", rating:4.7, reviews:634, type:"Destination Spa", tag:"30 years of transformative healing", aw:["Sunday Times Top 50 2025"] },
  { name:"RAKxa Integrative Wellness", city:"Bangkok", country:"Thailand", rating:4.8, reviews:412, type:"Medical Spa", tag:"Thai wisdom meets cutting-edge diagnostics", aw:["Sunday Times Best Medi-Spa 2025"] },
  { name:"Palace Merano", city:"Merano", country:"Italy", rating:4.7, reviews:1287, type:"Medical Spa", tag:"Three decades of detox mastery", aw:["Sunday Times 2025"] },
  { name:"Palazzo Fiuggi", city:"Fiuggi", country:"Italy", rating:4.7, reviews:689, type:"Medical Spa", tag:"Renaissance grandeur meets metabolic medicine", aw:["Sunday Times Best Nutrition"] },
  { name:"SHA Wellness Clinic", city:"Alicante", country:"Spain", rating:4.3, reviews:1134, type:"Wellness Clinic", tag:"Science-driven longevity", aw:["World Spa Awards 2025"] },
  { name:"Park Igls", city:"Innsbruck", country:"Austria", rating:4.8, reviews:523, type:"Medical Spa", tag:"Mayr medicine in the Alps", aw:["Sunday Times Top 50"] },
  { name:"Euphoria Retreat", city:"Mystras", country:"Greece", rating:4.7, reviews:358, type:"Wellness Retreat", tag:"Greek healing in the Peloponnese", aw:["Sunday Times Top 50","Condé Nast Top 5"] },
  { name:"Kamalaya Koh Samui", city:"Koh Samui", country:"Thailand", rating:4.8, reviews:1234, type:"Wellness Retreat", tag:"Soul sanctuary around a monk's cave", aw:["Condé Nast Awards"] },
  { name:"Chenot Palace Weggis", city:"Weggis", country:"Switzerland", rating:4.5, reviews:347, type:"Medical Spa", tag:"Swiss precision on Lake Lucerne", aw:["Sunday Times Top 50"] },
  { name:"Clinique La Prairie", city:"Montreux", country:"Switzerland", rating:4.5, reviews:287, type:"Medical Spa", tag:"Birthplace of longevity science since 1931" },
  { name:"Mandarin Oriental Spa Marrakech", city:"Marrakech", country:"Morocco", rating:4.6, reviews:2156, type:"Hotel Spa", tag:"Moroccan tradition meets Oriental wellness" },
  { name:"Lanserhof Tegernsee", city:"Tegernsee", country:"Germany", rating:4.5, reviews:612, type:"Medical Spa", tag:"Clinical precision meets Alpine serenity" },
  { name:"COMO Shambhala Estate", city:"Ubud", country:"Indonesia", rating:4.7, reviews:1567, type:"Wellness Retreat", tag:"Bali's original back-to-nature retreat" },
  { name:"Six Senses Ibiza", city:"Ibiza", country:"Spain", rating:4.5, reviews:891, type:"Resort Spa", tag:"Longevity science on the north shore" },
  { name:"Ananda in the Himalayas", city:"Rishikesh", country:"India", rating:4.6, reviews:1847, type:"Destination Spa", tag:"Ayurvedic healing at the Ganges" },
  { name:"Royal Mansour Spa", city:"Marrakech", country:"Morocco", rating:4.8, reviews:1523, type:"Hotel Spa", tag:"The world's finest hammam" },
  { name:"Mii amo", city:"Sedona", country:"United States", rating:4.7, reviews:198, type:"Destination Spa", tag:"Desert spirituality amid red rocks" },
  { name:"Bürgenstock Alpine Spa", city:"Bürgenstock", country:"Switzerland", rating:4.5, reviews:2634, type:"Resort Spa", tag:"10,000 sqm above Lake Lucerne" },
  { name:"Ritz-Carlton Spa Fari Islands", city:"North Malé Atoll", country:"Maldives", rating:4.7, reviews:892, type:"Resort Spa", tag:"Overwater indulgence on the Indian Ocean" },
  { name:"Lily of the Valley", city:"Saint-Tropez", country:"France", rating:4.4, reviews:1023, type:"Resort Spa", tag:"French glamour near Saint-Tropez" },
  { name:"Zulal Wellness Resort", city:"Doha", country:"Qatar", rating:4.6, reviews:478, type:"Wellness Retreat", tag:"World's first Arabic Medicine resort" },
  { name:"Banyan Tree Spa AlUla", city:"AlUla", country:"Saudi Arabia", rating:4.6, reviews:423, type:"Resort Spa", tag:"Desert heritage meets modern wellness" },
  { name:"Engel Ayurpura", city:"Dolomites", country:"Italy", rating:4.7, reviews:312, type:"Wellness Retreat", tag:"Ayurveda in the UNESCO Dolomites" },
  { name:"Golden Door", city:"San Diego", country:"United States", rating:4.9, reviews:156, type:"Destination Spa", tag:"Six decades of 40-guest excellence" },
  { name:"Schloss Elmau", city:"Munich", country:"Germany", rating:4.6, reviews:2341, type:"Resort Spa", tag:"Six spas in a Bavarian castle" },
  { name:"Brenners Park-Hotel & Spa", city:"Baden-Baden", country:"Germany", rating:4.6, reviews:1876, type:"Hotel Spa", tag:"Grand tradition in thermal town" },
  { name:"JOALI BEING", city:"Baa Atoll", country:"Maldives", rating:4.6, reviews:189, type:"Wellness Retreat", tag:"An entire island for wellbeing" },
  { name:"Guerlain Spa One&Only Aesthesis", city:"Athens", country:"Greece", rating:4.7, reviews:567, type:"Resort Spa", tag:"Parisian beauty on the Athens Riviera" },
  { name:"Ayurveda Resort Mandira", city:"Graz", country:"Austria", rating:4.8, reviews:198, type:"Wellness Retreat", tag:"European Ayurveda in Styrian hills" },
  { name:"SHA Mexico", city:"Cancun", country:"Mexico", rating:4.6, reviews:234, type:"Wellness Clinic", tag:"The SHA Method meets the Caribbean" },
  { name:"Aqua Dome Tirol Therme", city:"Längenfeld", country:"Austria", rating:4.5, reviews:8923, type:"Thermal Spa", tag:"Futuristic thermal bowls in Tyrol" },
  { name:"Forte Village Resort", city:"Sardinia", country:"Italy", rating:4.4, reviews:4521, type:"Resort Spa", tag:"Thalassotherapy on Sardinia's coast" },
  { name:"Lanserhof Lans", city:"Innsbruck", country:"Austria", rating:4.5, reviews:456, type:"Medical Spa", tag:"The original Lanserhof since 2006" },
  { name:"One&Only Kéa Island", city:"Crete", country:"Greece", rating:4.7, reviews:178, type:"Resort Spa", tag:"Aegean jewel with wellness innovation" },
  { name:"Rancho La Puerta", city:"Cabo San Lucas", country:"Mexico", rating:4.8, reviews:287, type:"Destination Spa", tag:"Since 1940 — farm-to-table spa" },
  { name:"Mount Med Resort", city:"Innsbruck", country:"Austria", rating:4.8, reviews:123, type:"Medical Spa", tag:"Biohacking and Alpine healing" },
  { name:"Morpheus Spa City of Dreams", city:"Macau", country:"China", rating:4.4, reviews:3421, type:"Hotel Spa", tag:"Zaha Hadid meets wellness" },
  { name:"Tschuggen Grand Bergoase", city:"St. Moritz", country:"Switzerland", rating:4.5, reviews:723, type:"Hotel Spa", tag:"Mario Botta's mountain masterpiece" },
  { name:"Garrya Mù Cang Chải", city:"Hanoi", country:"Vietnam", rating:4.7, reviews:89, type:"Wellness Retreat", tag:"Wellness amid terraced rice paddies" },
  { name:"Aro Hā Wellness Retreat", city:"Queenstown", country:"New Zealand", rating:4.9, reviews:112, type:"Wellness Retreat", tag:"Off-grid mindfulness in Southern Alps" },
  { name:"Shreyas Retreat", city:"Bangalore", country:"India", rating:4.7, reviews:345, type:"Wellness Retreat", tag:"Silent yoga and organic living" },
  { name:"Sunstone Spa", city:"Palm Springs", country:"United States", rating:4.6, reviews:1234, type:"Resort Spa", tag:"Desert healing waters" },
  { name:"Delaire Graff Spa", city:"Cape Town", country:"South Africa", rating:4.7, reviews:789, type:"Resort Spa", tag:"Wellness amid the Cape Winelands" },
  { name:"Daios Cove", city:"Crete", country:"Greece", rating:4.5, reviews:2134, type:"Resort Spa", tag:"Holistic healing on a private beach" },
  { name:"Llao Llao Resort Spa", city:"Bariloche", country:"Argentina", rating:4.5, reviews:4567, type:"Resort Spa", tag:"Patagonian grandeur on Lake Nahuel Huapi" },
  { name:"Lime Wood Hotel & Spa", city:"New Forest", country:"United Kingdom", rating:4.6, reviews:1876, type:"Hotel Spa", tag:"England's finest in the New Forest" },
  { name:"Six Senses Douro Valley", city:"Porto", country:"Portugal", rating:4.6, reviews:2345, type:"Resort Spa", tag:"Vineyard wellness in the Douro" },
  { name:"ADLER Spa Resort Sicilia", city:"Sicily", country:"Italy", rating:4.6, reviews:1567, type:"Resort Spa", tag:"Sicilian warmth meets Tyrolean wellness" },
  { name:"St. Regis Spa The Palm", city:"Dubai", country:"UAE", rating:4.5, reviews:5678, type:"Hotel Spa", tag:"Ultra-luxe on Palm Jumeirah" },
];

function g50ToSpa(entry) {
  return {
    name: entry.name,
    slug: toSlug(`${entry.name}-${entry.city}`),
    city: entry.city,
    country: entry.country,
    rating: entry.rating,
    reviews: entry.reviews,
    type: entry.type,
    typeColor: TYPE_COLORS[entry.type] || '#c4a87c',
    typeIcon: TYPE_ICONS[entry.type] || '💎',
    rank: 0,
    photo: getSpaPhotoUrl(entry.name, entry.city),
    tag: entry.tag || null,
    aw: entry.aw || null,
  };
}

export function getSpaBySlug(slug) {
  // Check Global Top 50 first
  for (const entry of G50) {
    const spa = g50ToSpa(entry);
    if (spa.slug === slug) return spa;
  }
  // Then check the 50K database
  for (const country of Object.keys(DB)) {
    for (const city of Object.keys(DB[country])) {
      for (const entry of DB[country][city]) {
        const spa = expandSpa(entry, city, country);
        if (spa.slug === slug) return spa;
      }
    }
  }
  return null;
}

export function getAllSlugs() {
  const slugs = [];
  for (const country of Object.keys(DB)) {
    for (const city of Object.keys(DB[country])) {
      for (const entry of DB[country][city]) {
        const spa = expandSpa(entry, city, country);
        slugs.push(spa.slug);
      }
    }
  }
  return slugs;
}

// ─── Offerings by Type ───
export function getOfferings(type) {
  const base = ['Relaxation Massage', 'Deep Tissue Massage', 'Aromatherapy', 'Facial Treatment', 'Body Scrub & Wrap'];
  const byType = {
    'Hotel Spa': ['Couples Suite', 'Express Treatments', 'Pool Access', 'Fitness Center', 'Sauna & Steam', 'Hair Salon'],
    'Resort Spa': ['Infinity Pool', 'Hydrotherapy Circuit', 'Beachside Massage', 'Yoga Pavilion', 'Meditation Garden', 'Outdoor Treatment Cabana'],
    'Day Spa': ['Manicure & Pedicure', 'Waxing', 'Lash & Brow', 'Hair Treatment', 'Quick Refresh Package', 'Membership Plans'],
    'Medical Spa': ['IV Therapy', 'Cryotherapy', 'Hyperbaric Chamber', 'Genetic Testing', 'Blood Analysis', 'Detox Programs', 'Anti-Aging Protocols'],
    'Wellness Retreat': ['Yoga & Meditation', 'Sound Healing', 'Breathwork', 'Nature Walks', 'Nutritional Counseling', 'Digital Detox', 'Mindfulness Sessions'],
    'Destination Spa': ['Multi-Day Programs', 'Personal Training', 'Cooking Classes', 'Life Coaching', 'Sleep Optimization', 'Weight Management'],
    'Wellness Clinic': ['Functional Medicine', 'Hormone Therapy', 'Stem Cell Therapy', 'Longevity Assessment', 'Biohacking Lab', 'DNA Analysis'],
    'Thermal Spa': ['Hot Springs Pools', 'Cold Plunge', 'Thermal Circuit', 'Mud Therapy', 'Mineral Baths', 'Finnish Sauna', 'Turkish Hammam'],
  };
  return [...base, ...(byType[type] || byType['Hotel Spa'])];
}

// ─── SEO Content Generation ───

export function getSpaMetaTitle(spa) {
  return `${spa.name} | Reviews, Treatments & Booking | Spa-Review`;
}

export function getSpaMetaDescription(spa) {
  return `${spa.name} in ${spa.city}, ${spa.country} — rated ${spa.rating}/5 from ${spa.reviews.toLocaleString()} Google reviews. ${spa.type} offering ${getOfferings(spa.type).slice(0, 3).join(', ')} and more. Read reviews, compare prices & book.`;
}

export function getCityMetaTitle(city, country) {
  return `Best Spas in ${city}, ${country} (2026) — Top-Rated & Reviewed | Spa-Review`;
}

export function getCityMetaDescription(city, country, count) {
  return `Discover the ${count}+ best spas and wellness retreats in ${city}, ${country}. Compare ratings, read reviews, and book treatments at top-rated day spas, resort spas, medical spas & more.`;
}

export function getCountryMetaTitle(country) {
  return `Best Spas in ${country} (2026) — Complete Guide | Spa-Review`;
}

export function getCountryMetaDescription(country, cityCount, spaCount) {
  return `Explore ${spaCount}+ spas across ${cityCount} cities in ${country}. From luxury resort spas to wellness retreats, find the perfect spa experience. Ratings, reviews & direct booking.`;
}
