/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for maximum performance
  // Remove this if using server-side features (API routes, middleware)
  // output: 'export',
  
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Trailing slash for consistent URLs
  trailingSlash: false,

  // Compress responses
  compress: true,

  // Headers for SEO and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Redirect old URLs if migrating
      { source: '/home', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
