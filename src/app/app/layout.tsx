import type { Metadata } from 'next'
 
import AppLayout from '@/components/layout/AppLayout'
import { getServerUser } from '@/lib/auth/serverAuth'
import { redirect } from 'next/navigation'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Task Management Web App',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

    const user = await getServerUser()
  
  if (!user) {
    redirect('/login?from=/app')
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
            <ThemeProvider  attribute="class" defaultTheme="dark" enableSystem> <AppLayout> {children}</AppLayout></ThemeProvider>
      </body>
    </html>
  )
}
