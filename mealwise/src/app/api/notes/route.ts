import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.AWS_NOTES_URL;

export async function POST(request: NextRequest) {
    console.log("Sending to AWS API Gateway");
    try {
        const body = await request.json();
        console.log(request);
        const awsPostEvent = {
            httpMethod: "POST",
            body: JSON.stringify({
                resource: "/notesdb",
                username: body.username,
                noteid: body.noteid,
                title: body.title,
                content: body.content,
                updatedAt: body.updatedAt,
                createdAt: body.createdAt
            })
        };
        const response = await fetch(`${API_BASE}/notesdb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(awsPostEvent),
        });
        const data = await response.text();
        console.log(data);
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
    console.error('Signup API error:', error);
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

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        
        const awsEvent = {
            httpMethod: "PATCH",
            body: JSON.stringify({
                resource: "/notesdb",
                username: body.username,
                noteid: body.noteid,
                title: body.title,
                content: body.content,
                updatedAt: body.updatedAt
            })
        };
        const response = await fetch(`${API_BASE}/notesdb`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(awsEvent),
        });
        const data = await response.text();
        console.log(data);
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
    console.error('Signup API error:', error);
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

export async function GET(request: NextRequest) {
  try {
    // Extract query params from request
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    console.log(username);
    if (!username) {
      return new NextResponse(
        JSON.stringify({ message: "username is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call your Lambda/API Gateway with query params
    const response = await fetch(`${API_BASE}/notesdb?username=${username}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Notes API error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();

        const awsDeleteEvent = {
            httpMethod: "DELETE",
            body: JSON.stringify({
                resource: "/notesdb",
                username: body.username,
                noteid: body.noteid
            })
        };

        const response = await fetch(`${API_BASE}/notesdb`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(awsDeleteEvent),
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
                'Access-Control-Allow-Methods': 'POST, PATCH, GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error) {
        console.error('Delete API error:', error);
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
