'use client'
import ThemeToggle from '@/components/ThemeToggle'
import { Bell, Filter, Plus, Search, Settings,LogOutIcon } from 'lucide-react'
import LogoutButton from '../auth/LogoutButton'

export default function Header() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
             <div className="max-w-7xl mx-auto px-6 py-3">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                   All Tasks
                 </h1>
                  </div>
                 
                 <div className="flex items-center gap-4">
                  <LogoutButton />
                   
                  <ThemeToggle/>
                    
                  </div>
               </div>
               
               {/* Page Title */}
              
             </div>
           </div>
  )
}
