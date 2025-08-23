import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import ThemeToggle from '@/components/ThemeToggle'
import Nav from '@/components/Nav'
import AppLayout from '@/components/layout/AppLayout'

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Task Management Web App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
           <Providers> <AppLayout> {children}</AppLayout></Providers>
      </body>
    </html>
  )
}
