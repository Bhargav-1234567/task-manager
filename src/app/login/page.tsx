"use client"
import { useState } from "react"
import { useLoginMutation } from "@/lib/api/authApi"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("john@example.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("from") || "/app"

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    
    try {
      const result = await login({ email, password }).unwrap()
        
      if (result.ok) {
        router.push(redirectTo)
      } else {
        setError(result.message  || "Invalid credentials")
      }
    } catch (err: any) {
      setError(err.data?.message || "Login failed")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg w-80 space-y-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Login
        </h1>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Demo credentials: demo@example.com / Passw0rd!
        </div>
      </form>
    </main>
  )
}