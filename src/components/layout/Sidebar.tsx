'use client'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils' // optional helper for classNames
import { Home, Clock, FileText, LayoutGrid, Briefcase, Map, Calendar, Folder } from 'lucide-react'
import Link from 'next/link'

const items = [
  { name: 'Dashboard', icon: Home,link:'/app/dashboard' },
  { name: 'Time Tracking', icon: Clock,link:"/app/timeTracking" },
  { name: 'Documents', icon: FileText,link:"/app/documents" },
  { name: 'Tasks', icon: LayoutGrid ,link:"/app/tasks"},
  { name: 'Lead pipeline', icon: Briefcase,link:"/app/leadPipeline" },
  { name: 'Invoices', icon: FileText,link:"/app/invoices" },
  { name: 'Map', icon: Map ,link:"/app/map"},
  { name: 'Schedule', icon: Calendar,link:"/app/schedule" },
  { name: 'Projects', icon: Folder,link:"/app/projects" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 border-r bg-white dark:bg-gray-900 dark:bg-gray-900 flex flex-col">
      <div className="flex items-center gap-6">
                   <div className="flex items-center gap-3  px-2 py-4">
                     <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center">
                       <span className="text-white dark:text-gray-900 font-bold text-sm">T</span>
                     </div>
                     <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                       Task<span className="font-normal">rapy</span>
                     </span>
                   </div>
                 </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname.includes(item.name.toLowerCase().split(' ')[0])
          return (
            <Link
              key={item.name}
              href={item.link||"#"}
              className={cn(
                'flex items-center gap-3  rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-500  text-black bg-neutral-200 '
                  : 'text-gray-500 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
