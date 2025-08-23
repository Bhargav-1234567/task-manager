"use client"
import { useLogoutMutation } from "@/lib/api/authApi"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const [logout, { isLoading }] = useLogoutMutation()
  const router = useRouter()

  async function handleLogout() {
    try {
      await logout('a').unwrap()
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
      // Even if API call fails, clear client-side state and redirect
      router.push("/login")
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  )
}