// lib/schema.js
// JSON-LD structured data generators for rich search results

import { getOfferings, getSpaPhotoUrl } from './spa-db';

/**
 * Generate LocalBusiness / HealthAndBeautyBusiness schema for a spa
 * This enables rich results in Google: star ratings, reviews, address, etc.
 */
export function spaSchema(spa) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: spa.name,
    description: `${spa.type} in ${spa.city}, ${spa.country}. Rated ${spa.rating}/5 from ${spa.reviews.toLocaleString()} reviews.`,
    image: getSpaPhotoUrl(spa.name, spa.city, 1200, 630),
    address: {
      '@type': 'PostalAddress',
      addressLocality: spa.city,
      addressCountry: spa.country,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: spa.rating.toString(),
      bestRating: '5',
      worstRating: '1',
      reviewCount: spa.reviews.toString(),
    },
    priceRange: '$$-$$$$',
    url: `https://spa-review.com/spa/${spa.slug}`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Spa Services',
      itemListElement: getOfferings(spa.type).map((service, i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
        position: i + 1,
      })),
    },
  };
}

/**
 * Generate ItemList schema for city/country pages
 * This enables carousel rich results in Google
 */
export function spaListSchema(spas, title, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    url,
    numberOfItems: spas.length,
    itemListElement: spas.slice(0, 50).map((spa, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'HealthAndBeautyBusiness',
        name: spa.name,
        image: getSpaPhotoUrl(spa.name, spa.city, 600, 400),
        address: {
          '@type': 'PostalAddress',
          addressLocality: spa.city,
          addressCountry: spa.country,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: spa.rating.toString(),
          bestRating: '5',
          reviewCount: spa.reviews.toString(),
        },
        url: `https://spa-review.com/spa/${spa.slug}`,
      },
    })),
  };
}

/**
 * BreadcrumbList schema for navigation
 */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `https://spa-review.com${item.url}` : undefined,
    })),
  };
}

/**
 * Organization schema for the site
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Spa-Review',
    url: 'https://spa-review.com',
    logo: 'https://spa-review.com/logo.png',
    description: 'The definitive guide to the world\'s best spas and wellness retreats. 50,000+ spas across 113 countries.',
    sameAs: [
      'https://twitter.com/spa-review',
      'https://instagram.com/spa-review',
      'https://facebook.com/spa-review',
    ],
  };
}

/**
 * WebSite schema with SearchAction for Google Sitelinks Search Box
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Spa-Review',
    url: 'https://spa-review.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://spa-review.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Article schema for blog posts
 */
export function articleSchema({ title, description, slug, publishedDate, modifiedDate, author }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://spa-review.com/blog/${slug}`,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Organization',
      name: author || 'Spa-Review Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spa-Review',
      url: 'https://spa-review.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://spa-review.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://spa-review.com/blog/${slug}`,
    },
  };
}

/**
 * FAQPage schema for FAQ sections
 */
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Helper: Render JSON-LD script tag
 */
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
