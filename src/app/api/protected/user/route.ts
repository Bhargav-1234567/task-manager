// app/api/protected/user/route.ts
import { authenticatedFetch } from "@/lib/api-client"
import { NextRequest, NextResponse } from "next/server"
 
export async function GET(request: NextRequest) {
  try {
    const response = await authenticatedFetch(
      '/api/user',
      {
        method: 'GET',
      },
      request.headers.get('cookie') || ''
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch user' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}