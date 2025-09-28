import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'Google Maps API key not found' }, { status: 500 });
  }

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
    
    console.log('Making Google Geocoding API call:', url.replace(apiKey, 'HIDDEN_KEY'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Google Geocoding API error:', response.status, response.statusText);
      return NextResponse.json({ error: `Google Geocoding API error: ${response.status}` }, { status: response.status });
    }
    
    const data = await response.json();
    console.log('Google Geocoding API response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling Google Geocoding API:', error);
    return NextResponse.json({ error: 'Failed to fetch from Google Geocoding API' }, { status: 500 });
  }
}
