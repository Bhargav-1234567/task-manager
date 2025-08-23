// lib/auth/cookies.ts
import { serialize, parse } from 'cookie'

export const setAuthCookie = (token: string, maxAge: number = 60 * 60) => {
  return serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  })
}

export const clearAuthCookie = () => {
  return serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
}

export const parseCookie = (cookieHeader: string) => {
  const cookies = parse(cookieHeader || '')
  return {
    token: cookies.token || null,
  }
}