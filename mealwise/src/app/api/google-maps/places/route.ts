import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const keyword = searchParams.get('keyword') || 'store';
  const radius = searchParams.get('radius') || '50000';

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  console.log('🔑 API Route - Google Maps API Key:', apiKey ? 'Present' : 'Missing');
  console.log('🔑 API Route - API Key length:', apiKey?.length || 0);
  console.log('📍 API Route - Search params:', { latitude, longitude, keyword, radius });
  
  if (!apiKey) {
    console.error('❌ API Route - Google Maps API key not found');
    return NextResponse.json({ error: 'Google Maps API key not found' }, { status: 500 });
  }

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${keyword}&type=store&key=${apiKey}`;
    
    console.log('Making Google Maps API call:', url.replace(apiKey, 'HIDDEN_KEY'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Google Maps API error:', response.status, response.statusText);
      return NextResponse.json({ error: `Google Maps API error: ${response.status}` }, { status: response.status });
    }
    
    const data = await response.json();
    console.log('Google Maps API response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling Google Maps API:', error);
    return NextResponse.json({ error: 'Failed to fetch from Google Maps API' }, { status: 500 });
  }
}
