// app/sitemap.js
// Sitemap with homepage, countries, cities, and blog posts
// Individual spa pages are discovered by Google via internal links

import {
  getAllCountries, getCitiesForCountry, toSlug,
} from '../lib/spa-db';

export default function sitemap() {
  const baseUrl = 'https://spa-review.com';
  const now = new Date().toISOString();
  
  const urls = [];

  // Homepage
  urls.push({
    url: baseUrl,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Country pages (113)
  for (const country of getAllCountries()) {
    urls.push({
      url: `${baseUrl}/country/${toSlug(country)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // City pages (564)
  for (const country of getAllCountries()) {
    for (const city of getCitiesForCountry(country)) {
      urls.push({
        url: `${baseUrl}/city/${toSlug(city)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Blog pages
  const blogSlugs = [
    'spa-etiquette-guide',
    'medical-spa-vs-day-spa',
  ];
  for (const slug of blogSlugs) {
    urls.push({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return urls;
}
