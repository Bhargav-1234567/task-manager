import { NextResponse } from "next/server"
import { serialize } from "cookie"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.headers.set(
    "Set-Cookie",
    serialize("token", "", { httpOnly: true, path: "/", maxAge: 0 })
  )
  return res
}
