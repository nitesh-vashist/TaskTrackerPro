import type { Task } from "@/components/TaskDashboard"

const TASKS_KEY = "taskTracker_tasks"

export const loadTasks = (): Task[] => {
  if (typeof window === "undefined") return []

  try {
    const saved = localStorage.getItem(TASKS_KEY)
    if (!saved) return []

    const tasks = JSON.parse(saved)
    // Ensure backward compatibility with old task format
    return tasks.map((task: any) => ({
      ...task,
      priority: task.priority || "medium",
      tags: task.tags || [],
      dueDate: task.dueDate || undefined,
    }))
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error)
  }
}
