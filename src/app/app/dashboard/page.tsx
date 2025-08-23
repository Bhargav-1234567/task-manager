 
export default function DashboardPage() {
  return (
     <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>You are authenticated 🎉</p>
      <form action="/api/logout" method="POST">
        <button className="mt-4 border px-3 py-1 rounded">Logout</button>
      </form>
    </main> 
    
  )
}
