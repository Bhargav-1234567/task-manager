// pages/index.tsx
import KanbanBoard from '@/components/tasks/KanbanBoard';
import { Container } from '@/types';
import { cookies } from 'next/headers';

const API_BASE = process.env.API_BASE_URL;

async function fetchBoard(): Promise<Container[]> {
  const cookieStore =await cookies();
  const authToken = cookieStore.get('token')?.value; // or your cookie name
  
  const res = await fetch(`${API_BASE}/tasks/board`, {
    headers: {
      'Cookie': `token=${authToken}`,
    },
    credentials: 'include' // if you need to include cookies
  });

 
  const data: Container[] = await res.json();
  return data;
}
export default async function Home() {
   const boardData = await fetchBoard();
    return (
    <div>
      <KanbanBoard containersFromApi={boardData} />
    </div>
  );
}
