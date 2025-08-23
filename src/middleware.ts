import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"
import { parse } from "cookie"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // allow login page and static files
  if (pathname.startsWith("/login") || pathname.startsWith("/api/login") || pathname.startsWith("/_next")) {
    return NextResponse.next()
  }

  // check cookie
  const cookies = req.headers.get("cookie") || ""
  const { token } = parse(cookies)
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}
