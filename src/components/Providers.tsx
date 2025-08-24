'use client'

import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/lib/store'
  import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
       <ReduxProvider store={store}>
        
      {children}
     
      </ReduxProvider>
   )
}
