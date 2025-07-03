"use client"
import TaskItem from "./TaskItem"

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
