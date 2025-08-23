'use client'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils' // optional helper for classNames
import { Home, Clock, FileText, LayoutGrid, Briefcase, Map, Calendar, Folder } from 'lucide-react'
import Link from 'next/link'

const items = [
  { name: 'Dashboard', icon: Home,link:'/dashboard' },
  { name: 'Time Tracking', icon: Clock },
  { name: 'Documents', icon: FileText },
  { name: 'Tasks', icon: LayoutGrid ,link:"tasks"},
  { name: 'Lead pipeline', icon: Briefcase },
  { name: 'Invoices', icon: FileText },
  { name: 'Map', icon: Map },
  { name: 'Schedule', icon: Calendar },
  { name: 'Projects', icon: Folder },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 border-r bg-white dark:bg-gray-900 dark:bg-gray-900 flex flex-col">
      <div className="h-14 flex items-center px-4 font-bold text-lg">
        <span className="text-brand-500">Taskrapy</span>
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
