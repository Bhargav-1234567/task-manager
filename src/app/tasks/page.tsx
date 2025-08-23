import Kanban from '@/components/tasks/Kanban';
import { Container, ITask } from '@/types';

 

export default function Home() {
  const kanbanData:Container[]  = [
    {
      id: 'container-1',
      title: 'To Do',
      tasks: [
        { id: 'task-1', title: 'Design Homepage' },
        { id: 'task-2', title: 'Create Database Schema' },
        { id: 'task-3', title: 'Setup Testing Framework' },
      ],
    },
    {
      id: 'container-2',
      title: 'In Progress',
      tasks: [
        { id: 'task-4', title: 'Implement Authentication' },
        { id: 'task-5', title: 'Create API Endpoints' },
      ],
    },
    {
      id: 'container-3',
      title: 'Review',
      tasks: [
        { id: 'task-6', title: 'Code Review API Endpoints' },
      ],
    },
    {
      id: 'container-4',
      title: 'Done',
      tasks: [
        { id: 'task-7', title: 'Setup Development Environment' },
      ],
    },
    {
      id: 'container-5',
      title: 'Blocked',
      tasks: [
        { id: 'task-8', title: 'Setup Test Cases' },
      ],
    },
  ]
  return (
    <div >
     <Kanban initialData={kanbanData}/>
    </div>
  );
}