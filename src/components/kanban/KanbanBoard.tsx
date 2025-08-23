'use client'
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import KanbanColumn from './KanbanColumn'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { moveTaskToColumn, reorderTaskWithinColumn } from '@/lib/boardSlice'
import { useState } from 'react'

export default function KanbanBoard() {
  const dispatch = useDispatch()
  const board = useSelector((s: RootState) => s.board)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const findColumnOfTask = (taskId: string) => {
    return board.columns.find((c) => c.taskIds.includes(taskId))?.id || null
  }

  function onDragStart(event: any) {
    setActiveTaskId(event.active?.id ?? null)
  }

  function onDragOver(event: DragOverEvent) {
    // optional: live reordering while hovering other columns (kept simple)
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTaskId(null)
    if (!active?.id || !over?.id) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const fromColumnId = findColumnOfTask(activeId)
    const toColumnId = findColumnOfTask(overId)

    if (!fromColumnId || !toColumnId) return

    // same column: reorder
    if (fromColumnId === toColumnId) {
      const col = board.columns.find((c) => c.id === fromColumnId)!
      const oldIndex = col.taskIds.indexOf(activeId)
      const newIndex = col.taskIds.indexOf(overId)
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return
      const newOrder = arrayMove(col.taskIds, oldIndex, newIndex)
      // dispatch(reorderTaskWithinColumn({ columnId: col.id, fromIndex: oldIndex, toIndex: newIndex }))
      return
    }

    // different column: move
    const targetCol = board.columns.find((c) => c.id === toColumnId)!
    const insertIndex = targetCol.taskIds.indexOf(overId)
    // dispatch(moveTaskToColumn({ taskId: activeId, fromColumnId, toColumnId, toIndex: insertIndex < 0 ? 0 : insertIndex }))
  }

  const getTitle = (taskId: string) => board.tasks[taskId]?.title ?? 'Untitled'

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-2">
        {board.columns.map((col) => (
          <div key={col.id} className="rounded-lg border bg-neutral-50 dark:bg-gray-900 dark:bg-gray-900 p-3">
            <KanbanColumn id={col.id} title={col.title} taskIds={col.taskIds} getTitle={getTitle} />
          </div>
        ))}
      </div>
    </DndContext>
  )
}
