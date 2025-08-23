'use client'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard'

export default function KanbanColumn({
  id,
  title,
  taskIds,
  getTitle,
}: {
  id: string
  title: string
  taskIds: string[]
  getTitle: (taskId: string) => string
}) {
  return (
    <div className="w-80 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
        <span className="rounded bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs">
          {taskIds.length}
        </span>
      </div>

      <div className="space-y-2">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {taskIds.map((tid) => (
            <KanbanCard key={tid} id={tid} title={getTitle(tid)} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
