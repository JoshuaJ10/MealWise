import { NextRequest, NextResponse } from 'next/server';

const API_BASE = "https://5ts2r78670.execute-api.us-east-1.amazonaws.com/Food";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Format request in AWS API Gateway event format
    const awsEvent = {
      httpMethod: "POST",
      body: JSON.stringify({
        resource: "/login",
        username: body.username,
        password: body.password
      })
    };
    
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(awsEvent),
    });

    const data = await response.text();
    
    let responseData;
    try {
      responseData = JSON.parse(data);
    } catch {
      responseData = { message: data };
    }

    return new NextResponse(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Login API error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}