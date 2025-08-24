// components/KanbanColumn.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskItem from './TaskItem';
import { Container, ITask as Task } from '@/types';
import { useAppDispatch } from '@/hooks/redux';
import { updateContainerTitleWithApi } from '@/lib/kanbanThunks';
import Popover from '../ui/Popover';
import { useDeleteContainerMutation } from '@/lib/api/taskApi';
import { deleteContainer } from '@/lib/kanbanSlice';
 
interface KanbanColumnProps {
  container: Container;
  tasks: Task[];
  onAddTask: (containerId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  container, 
  tasks, 
  onAddTask
}) => {
   const dispatch = useAppDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: container.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
const [deleteContainerApi,{}]=useDeleteContainerMutation()
  const handleTitleEdit = () => {
    const newTitle = prompt('Edit column title:', container.title);
    if (newTitle && newTitle !== container.title) {
      dispatch(updateContainerTitleWithApi({ 
        containerId: container.id, 
        title: newTitle 
      }));
    }
  };

  const handleDeleteContainer=()=>{
// deleteContainerApi( container.id)
deleteContainer(container.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex flex-col h-[calc(100vh-96px-33px-40px)] overflow-auto w-[320px] flex-shrink-0 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-4 border-b-2 border-indigo-600 pb-3" {...attributes} {...listeners}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <h3 
            className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:underline"
            onClick={handleTitleEdit}
          >
            {container.title}
          </h3>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddTask(container.id);
            }}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Add task"
          >
            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
            <Popover content={  <div id="dropdown" className="z-10   bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li>
        <div  onClick={handleDeleteContainer} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</div>
      </li>
       
     
    </ul>
</div>}>
            <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </Popover>
          </button>
        </div>
      </div>
      
      <SortableContext items={tasks.map(task => task?.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col flex-1">
          {tasks.length > 0 && tasks.map((task) => (
            <TaskItem containerId={container.id} key={task?.id} task={task} />
          ))}
          
          {/* Add New Task Button */}
          <button
            onClick={() => onAddTask(container.id)}
            className="flex items-center gap-2 p-3 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>
      </SortableContext>
    </div>
  );
};

export default React.memo(KanbanColumn);