import type { Metadata } from 'next'
 
import AppLayout from '@/components/layout/AppLayout'
import { getServerUser } from '@/lib/auth/serverAuth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Task Management Web App',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
           <Suspense fallback={<div>Loading...</div>}> {children} </Suspense> 
      </body>
    </html>
  )
}
