import { NextResponse } from "next/server"
import { demoUser } from "@/lib/users"
import { signToken } from "@/lib/auth"
import { serialize } from "cookie"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (
    email?.trim().toLowerCase() === demoUser.email.toLowerCase() &&
    password === demoUser.password
  ) {
    const token = await signToken({ id: demoUser.id, email: demoUser.email })

    const res = NextResponse.json({ ok: true })
    res.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60, // 1h
      })
    )
    return res
  }

  return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 })
}
