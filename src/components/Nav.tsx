'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
 
export default function Nav() {
 
  return (
    <header className="flex items-center justify-between border-b p-3">
      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="font-semibold">Dashboard</Link>
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
       
          <Link href="/login" className="rounded-md border px-3 py-1 text-sm">Login</Link>
       
      </div>
    </header>
  )
}
