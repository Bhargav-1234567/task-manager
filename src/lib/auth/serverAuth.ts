// lib/auth/serverAuth.ts
import { cookies } from 'next/headers'
import { verifyToken } from './tokens'
import { parseCookie } from './cookies'

export async function getServerUser() {
  try {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()
    const { token } = parseCookie(cookieHeader)
    if (!token) {
      return null
    }

    // Verify the token from cookie
    const decoded = await verifyToken(token)
    
    // Fetch user data from your Node.js API
    const response = await fetch(`${process.env.API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    })
 
    if (!response.ok) {
      return null
    }

    const userData = await response.json()
     return {
      id: userData._id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function requireServerAuth() {
  const user = await getServerUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}