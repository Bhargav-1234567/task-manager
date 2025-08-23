import { SignJWT, jwtVerify, JWTPayload } from "jose"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "secret123")
const alg = "HS256"

export async function signToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [alg] })
    return payload
  } catch (e) {
    return null
  }
}
