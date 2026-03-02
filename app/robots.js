// app/robots.js
// robots.txt generation

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://spa-review.com/sitemap.xml',
    host: 'https://spa-review.com',
  };
}
