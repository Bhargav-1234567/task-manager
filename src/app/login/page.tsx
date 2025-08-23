"use client"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("Passw0rd!")
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
   const res = await fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})
    if (res.ok) {
      window.location.href = "/dashboard"
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="border p-6 rounded w-80 space-y-3">
        <h1 className="text-xl font-bold">Login</h1>
        {error && <p className="text-red-600">{error}</p>}
        <input
          className="w-full border px-2 py-1"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border px-2 py-1"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-1 rounded">Login</button>
      </form>
    </main>
  )
}
