import type { Metadata } from 'next'
import Providers from '@/components/Providers' 
import './globals.css'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Task Management Web App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
           <Providers>       
{children}</Providers>
      </body>
    </html>
  )
}
