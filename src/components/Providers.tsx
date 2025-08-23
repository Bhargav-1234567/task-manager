'use client'

import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/lib/store'
import { ThemeProvider } from 'next-themes'
 import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
       <ReduxProvider store={store}>
         <ThemeProvider  attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
      </ReduxProvider>
   )
}
