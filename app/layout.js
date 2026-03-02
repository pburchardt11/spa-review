// app/layout.js
import './globals.css';
import { JsonLd } from '../lib/schema';
import { organizationSchema, websiteSchema } from '../lib/schema';

export const metadata = {
  metadataBase: new URL('https://spa-review.com'),
  title: {
    default: 'Spa-Review — The World\'s Definitive Spa Guide | 50,000+ Spas',
    template: '%s | Spa-Review',
  },
  description: 'Discover the 50 best spas in the world plus 50,000+ spas across 113 countries. Expert ratings, Google reviews, treatment details & direct booking. Your definitive guide to global wellness.',
  keywords: ['best spas', 'spa guide', 'wellness retreats', 'luxury spa', 'spa reviews', 'spa booking', 'day spa', 'medical spa', 'resort spa', 'wellness travel'],
  authors: [{ name: 'Spa-Review Editorial' }],
  creator: 'Spa-Review',
  publisher: 'Spa-Review',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://spa-review.com',
    siteName: 'Spa-Review',
    title: 'Spa-Review — The World\'s Definitive Spa Guide',
    description: 'Discover the 50 best spas in the world plus 50,000+ spas across 113 countries. Expert ratings, reviews & direct booking.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Spa-Review - The World\'s Best Spas & Wellness Retreats',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@spa-review',
    creator: '@spa-review',
    title: 'Spa-Review — The World\'s Definitive Spa Guide',
    description: 'Discover 50,000+ spas across 113 countries. Expert ratings, reviews & booking.',
    images: ['/og-image.jpg'],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Alternate languages (for future i18n)
  alternates: {
    canonical: 'https://spa-review.com',
    languages: {
      'en-US': 'https://spa-review.com',
      // 'fr-FR': 'https://spa-review.com/fr',
      // 'de-DE': 'https://spa-review.com/de',
    },
  },

  // Verification
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // bing: 'YOUR_BING_VERIFICATION_CODE',
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://picsum.photos" />
        
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Site-wide structured data */}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        
        {/* Google Analytics (replace with your ID) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        background: '#080808',
        color: '#e8e4de',
        margin: 0,
        padding: 0,
      }}>
        {children}
      </body>
    </html>
  );
}
