// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { setAuthCookie } from "@/lib/auth/cookies"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  try {
    // Call your Node.js API
    const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    if (response.status!==200) {
      const error = await response.json()
      return NextResponse.json(
        { message: error.message || 'Authentication failed' },
        { status: response.status }
      )
    }

    const userData = await response.json()
 
    // Create response with user data
    const res = NextResponse.json(
      { 
        ok: true, 
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar
        } 
      },
      { status: 200 }
    )

    // Set cookie with the token from response
    res.headers.set('Set-Cookie', setAuthCookie(userData.token))

    return res
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}