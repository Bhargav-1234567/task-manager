"use client"
import { useLogoutMutation } from "@/lib/api/authApi"
import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import Button from "../ui/Button"

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
    <Button size="sm" variant="ghost" icon={<LogOutIcon /> }  disabled={isLoading}  onClick={handleLogout}>  {isLoading ? "Logging out..." : "Logout"}</Button>
    
  )
}