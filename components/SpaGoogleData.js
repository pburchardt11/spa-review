'use client';
// components/SpaGoogleData.js
// Displays real Google data: reviews, website link, phone, open/closed status

import { useState, useEffect } from 'react';

export default function SpaGoogleData({ name, city, country }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({ name, city, country: country || '' });
        const res = await fetch(`/api/spa-photo?${params}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Failed to load Google data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name, city, country]);

  if (loading) return null;
  if (!data || (!data.website && !data.reviews?.length && !data.address)) return null;

  return (
    <div style={{ marginTop: 32 }}>
      {/* Real contact info from Google */}
      {(data.website || data.phone || data.address) && (
        <section style={{ marginBottom: 28 }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c',
            marginBottom: 12,
          }}>
            Contact & Details
          </h2>
          <div style={{
            padding: 16, borderRadius: 10,
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {data.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 14, marginTop: 1 }}>📍</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#b0a898' }}>
                  {data.address}
                </span>
              </div>
            )}
            {data.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>📞</span>
                <a href={`tel:${data.phone}`} style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#c4a87c', textDecoration: 'none',
                }}>
                  {data.phone}
                </a>
              </div>
            )}
            {data.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>🌐</span>
                <a href={data.website} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#c4a87c', textDecoration: 'none',
                }}>
                  Official Website ↗
                </a>
              </div>
            )}
            {data.openNow !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{data.openNow ? '🟢' : '🔴'}</span>
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 13,
                  color: data.openNow ? '#16a34a' : '#dc2626',
                }}>
                  {data.openNow ? 'Currently Open' : 'Currently Closed'}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Real Google Reviews */}
      {data.reviews && data.reviews.length > 0 && (
        <section>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: 1, textTransform: 'uppercase', color: '#c4a87c',
            marginBottom: 12,
          }}>
            Google Reviews
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.reviews.map((review, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {review.profilePhoto && (
                    <img
                      src={review.profilePhoto}
                      alt={review.author}
                      width={28} height={28}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <div style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#e8e4de',
                    }}>
                      {review.author}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[1, 2, 3, 4, 5].map(x => (
                          <svg key={x} width="10" height="10" viewBox="0 0 24 24">
                            <path
                              d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z"
                              fill={x <= review.rating ? '#FBBC04' : '#3a3530'}
                            />
                          </svg>
                        ))}
                      </div>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: '#6a6560' }}>
                        {review.time}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#8a8278',
                  lineHeight: 1.6, margin: 0,
                }}>
                  {review.text}
                </p>
              </div>
            ))}
          </div>

          {/* Link to all Google reviews */}
          {data.googleUrl && (
            <a href={data.googleUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', marginTop: 12,
              fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#c4a87c',
              textDecoration: 'none', padding: '6px 12px', borderRadius: 6,
              border: '1px solid rgba(196,168,124,0.15)',
            }}>
              See all reviews on Google →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
