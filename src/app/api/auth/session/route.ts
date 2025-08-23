// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server"
import { parseCookie } from "@/lib/auth/cookies"
import { verifyToken } from "@/lib/auth/tokens"

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.cookies.toString()
    const { token } = parseCookie(cookieHeader)

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Verify the token from cookie
    const decoded = await verifyToken(token)
    
    // Fetch fresh user data from your Node.js API using the token
    const response = await fetch(`${process.env.NODE_API_URL}/user/${decoded.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const userData = await response.json()

    return NextResponse.json({ 
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}