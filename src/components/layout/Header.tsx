'use client'
import ThemeToggle from '@/components/ThemeToggle'
import { Bell, Filter, Plus, Search, Settings } from 'lucide-react'

export default function Header() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
             <div className="max-w-7xl mx-auto px-6 py-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center">
                       <span className="text-white dark:text-gray-900 font-bold text-sm">T</span>
                     </div>
                     <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                       Task<span className="font-normal">rapy</span>
                     </span>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                   <div className="relative">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                     <input
                       type="text"
                       placeholder="Search in view..."
                       className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   </div>
                   <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                     <Filter className="w-4 h-4" />
                     Filter
                   </button>
                   <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                     <Settings className="w-4 h-4" />
                     Customize
                   </button>
                   <button className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                     <Plus className="w-4 h-4" />
                     Add
                   </button>
                  <ThemeToggle/>
                 </div>
               </div>
               
               {/* Page Title */}
               <div className="mt-6">
                 <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                   All Tasks
                 </h1>
               </div>
             </div>
           </div>
  )
}
