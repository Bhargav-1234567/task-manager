// pages/index.tsx (or app/page.tsx if you're in App Router)

import KanbanBoard from '@/components/tasks/KanbanBoard';
import TasksHeader from '@/components/tasks/TasksHeader';
import TaskListView from '@/components/tasks/TaskListView';
import { Container } from '@/types';
import { cookies } from 'next/headers';

const API_BASE = process.env.API_BASE_URL;

async function fetchBoard(): Promise<Container[]> {
  const cookieStore = cookies(); // no need for await, cookies() is sync
  const authToken = cookieStore.get('token')?.value;

  const res = await fetch(`${API_BASE}/tasks/board`, {
    headers: {
      'Cookie': `token=${authToken}`,
    },
    credentials: 'include',
    cache: 'no-store', // disable caching for fresh data
  });

  if (!res.ok) {
    throw new Error('Failed to fetch board');
  }

  const data: Container[] = await res.json();
  return data;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { view?: string };
}) {
  const boardData = await fetchBoard();
  const view = searchParams?.view || 'board'; // default to board
const task = boardData?.reduce((acc,item)=>[...acc,...item.tasks],[]);
    return (
    <div>
      <TasksHeader />

      {view === 'list' ? (
        <TaskListView apiTasks={task} />
      ) : (
        <KanbanBoard containersFromApi={boardData} />
      )}
    </div>
  );
}
