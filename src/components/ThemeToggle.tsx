// src/components/ThemeToggle.tsx
'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const isDark = resolvedTheme === 'dark'
 
  return (
 

     <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                     className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                   >
                     {isDark ? (
                       <Sun className="w-5 h-5 text-yellow-500" />
                     ) : (
                       <Moon className="w-5 h-5 text-gray-600" />
                     )}
                   </button>
  )
}
