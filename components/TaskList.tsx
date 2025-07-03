"use client"

import TaskItem from "./TaskItem"
import type { Task } from "./TaskDashboard"

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: number) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
