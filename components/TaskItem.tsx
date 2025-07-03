"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Calendar, Clock, AlertTriangle } from "lucide-react"
import type { Task } from "./TaskDashboard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`
    } else if (diffDays === 0) {
      return "Due today"
    } else if (diffDays === 1) {
      return "Due tomorrow"
    } else {
      return `Due in ${diffDays} days`
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
      default:
        return ""
    }
  }

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()
  const isDueSoon =
    task.dueDate && !task.completed && new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        task.completed
          ? "bg-muted/50 border-muted"
          : isOverdue
            ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
            : "bg-card border-border hover:shadow-md"
      } ${task.priority === "high" ? "border-l-4 border-l-red-500" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1 transition-all duration-300"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-medium transition-all duration-300 ${
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {task.title}
              </h3>

              <div className="flex items-center gap-2">
                <Badge className={`text-xs transition-all duration-300 ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </Badge>
                {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />}
              </div>
            </div>

            {task.description && (
              <p
                className={`mt-1 text-sm transition-all duration-300 ${
                  task.completed ? "text-muted-foreground" : "text-muted-foreground"
                }`}
              >
                {task.description}
              </p>
            )}

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs transition-all duration-300 hover:scale-105">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Created: {formatDate(task.createdAt)}</span>
              </div>

              {task.dueDate && (
                <div
                  className={`flex items-center transition-all duration-300 ${
                    isOverdue ? "text-red-600 font-medium" : isDueSoon ? "text-yellow-600 font-medium" : ""
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDueDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0 transition-all duration-300 hover:scale-110"
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-300 hover:scale-110"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="transition-all duration-300">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{task.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="transition-all duration-300">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(task.id)}
                    className="bg-red-600 hover:bg-red-700 transition-all duration-300"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
