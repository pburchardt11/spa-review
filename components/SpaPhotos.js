'use client';
// components/SpaPhotos.js
// Fetches real photos from Google Places API
// Shows gradient fallback while loading, then fades in real photos

import { useState, useEffect } from 'react';

export default function SpaPhotos({ name, city, country, fallbackUrl, height = 400 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const params = new URLSearchParams({ name, city, country: country || '' });
        const res = await fetch(`/api/spa-photo?${params}`);
        const json = await res.json();
        if (json.photos && json.photos.length > 0) {
          setData(json);
        }
      } catch (e) {
        console.error('Failed to load spa photos:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [name, city, country]);

  const photos = data?.photos || [];
  const currentUrl = photos.length > 0 ? photos[activeIndex]?.url : fallbackUrl;
  const hasMultiple = photos.length > 1;

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', background: '#111', borderRadius: 'inherit' }}>
      {/* Gradient fallback — always visible until image loads */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, #1a2a1a 0%, #2d3a2d 30%, #1a3040 60%, #2a2520 100%)',
        opacity: imgLoaded ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }}>
        {loading && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            fontFamily: "'Outfit', sans-serif", fontSize: 11, color: '#4a4540',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 16, height: 16, border: '2px solid #4a4540', borderTopColor: '#c4a87c',
              borderRadius: '50%', animation: 'spin 1s linear infinite',
            }} />
            Loading photos...
          </div>
        )}
      </div>

      {/* Real photo */}
      {currentUrl && (
        <img
          key={currentUrl}
          src={currentUrl}
          alt={`${name} — real photo from Google`}
          loading="eager"
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            // If Google photo fails, fall back to picsum
            if (currentUrl !== fallbackUrl) {
              setData(null);
              setImgLoaded(false);
            }
          }}
          style={{
            position: 'absolute', inset: 0, zIndex: 2,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
            filter: 'brightness(0.82) contrast(1.02)',
          }}
        />
      )}

      {/* Photo navigation dots */}
      {hasMultiple && (
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', gap: 6,
        }}>
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIndex(i); setImgLoaded(false); }}
              style={{
                width: i === activeIndex ? 20 : 8, height: 8,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: i === activeIndex ? '#c4a87c' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      )}

      {/* Arrow navigation */}
      {hasMultiple && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIndex((activeIndex - 1 + photos.length) % photos.length); setImgLoaded(false); }}
            style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              zIndex: 10, width: 32, height: 32, borderRadius: '50%',
              border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff',
              fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', opacity: 0.7, transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIndex((activeIndex + 1) % photos.length); setImgLoaded(false); }}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              zIndex: 10, width: 32, height: 32, borderRadius: '50%',
              border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff',
              fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', opacity: 0.7, transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
          >
            ›
          </button>
        </>
      )}

      {/* Google attribution badge */}
      {photos.length > 0 && imgLoaded && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 10,
          fontFamily: "'Outfit', sans-serif", fontSize: 8, color: '#fff',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          padding: '3px 7px', borderRadius: 3,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="10" height="10" viewBox="0 0 48 48">
            <path d="M44 24c0-1.3-.1-2.6-.4-3.8H24v7.6h11.3c-.5 2.6-2 4.9-4.2 6.4v5.3h6.8C42 35.7 44 30.3 44 24z" fill="#4285F4"/>
            <path d="M24 44c5.7 0 10.4-1.9 13.9-5.1l-6.8-5.3c-1.9 1.3-4.3 2-7.1 2-5.5 0-10.1-3.7-11.8-8.6H5.2v5.5C8.7 39.8 15.8 44 24 44z" fill="#34A853"/>
            <path d="M12.2 27c-.4-1.3-.7-2.6-.7-4s.3-2.7.7-4v-5.5H5.2C3.8 16.1 3 19.9 3 24s.8 7.9 2.2 11l7-5z" fill="#FBBC04"/>
            <path d="M24 10c3.1 0 5.9 1.1 8.1 3.2l6-6.1C34.3 3.8 29.7 2 24 2 15.8 2 8.7 6.2 5.2 13l7 5.5C13.9 13.7 18.5 10 24 10z" fill="#EA4335"/>
          </svg>
          Google Photos
        </div>
      )}

      {/* Spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
