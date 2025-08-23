// lib/auth/tokens.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface TokenPayload {
  id: string
  email: string
  iat?: number
  exp?: number
}

export const signToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}

export const verifyToken = (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded as TokenPayload)
      }
    })
  })
}