// app/api/spa-photo/route.js
// API endpoint that fetches real spa photos from Google Places
// Called client-side: /api/spa-photo?name=Chiva-Som&city=Hua+Hin&country=Thailand

import { NextResponse } from 'next/server';

// In-memory cache to avoid repeated API calls (persists per serverless instance)
const cache = new Map();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const city = searchParams.get('city');
  const country = searchParams.get('country');

  if (!name || !city) {
    return NextResponse.json({ error: 'Missing name or city' }, { status: 400 });
  }

  const cacheKey = `${name}-${city}-${country}`;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    return NextResponse.json(cache.get(cacheKey));
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured', photos: [] }, { status: 200 });
  }

  try {
    // Step 1: Search for the spa on Google Places
    const query = `${name} spa ${city} ${country}`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=spa&key=${apiKey}`;
    
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      const result = { photos: [], placeId: null };
      cache.set(cacheKey, result);
      return NextResponse.json(result);
    }

    const place = searchData.results[0];
    const placeId = place.place_id;

    // Step 2: Get place details with photos
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,formatted_address,website,url,opening_hours,formatted_phone_number,rating,user_ratings_total,reviews&key=${apiKey}`;
    
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();
    const details = detailsData.result || {};

    // Step 3: Build photo URLs (up to 5 photos)
    const photos = (details.photos || []).slice(0, 5).map(photo => ({
      url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`,
      width: photo.width,
      height: photo.height,
      attribution: photo.html_attributions?.[0] || '',
    }));

    const result = {
      photos,
      placeId,
      address: details.formatted_address || null,
      website: details.website || null,
      googleUrl: details.url || null,
      phone: details.formatted_phone_number || null,
      googleRating: details.rating || null,
      googleReviews: details.user_ratings_total || null,
      openNow: details.opening_hours?.open_now ?? null,
      reviews: (details.reviews || []).slice(0, 3).map(r => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text?.slice(0, 300),
        time: r.relative_time_description,
        profilePhoto: r.profile_photo_url,
      })),
    };

    // Cache for future requests
    cache.set(cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Google Places API error:', error);
    return NextResponse.json({ error: 'Failed to fetch', photos: [] }, { status: 200 });
  }
}
