import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <div className="flex h-screen  bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100">
      <Sidebar />
      <div className="w-[calc(100%-15rem)] flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}
