"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, Plus, User, Search, Moon, Sun } from "lucide-react"
import TaskForm from "./TaskForm"
import TaskList from "./TaskList"
import TaskFilter from "./TaskFilter"
import { loadTasks, saveTasks } from "@/utils/localStorage"
import { useTheme } from "./ThemeProvider"

export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: string
  priority: "low" | "medium" | "high"
  dueDate?: string
  tags: string[]
}

export type FilterType = "all" | "completed" | "pending" | "overdue"
export type SortType = "created" | "priority" | "dueDate" | "title"

interface TaskDashboardProps {
  user: string
  onLogout: () => void
}

export default function TaskDashboard({ user, onLogout }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [sortBy, setSortBy] = useState<SortType>("created")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const savedTasks = loadTasks()
    setTasks(savedTasks)
  }, [])

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (
    title: string,
    description: string,
    priority: "low" | "medium" | "high",
    dueDate?: string,
    tags: string[] = [],
  ) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
      dueDate,
      tags,
    }
    setTasks([newTask, ...tasks])
    setShowTaskForm(false)
  }

  const updateTask = (
    id: number,
    title: string,
    description: string,
    priority: "low" | "medium" | "high",
    dueDate?: string,
    tags: string[] = [],
  ) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title, description, priority, dueDate, tags } : task)))
    setEditingTask(null)
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false
    return new Date(task.dueDate) < new Date()
  }

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      // Filter by completion status
      if (filter === "completed") return task.completed
      if (filter === "pending") return !task.completed
      if (filter === "overdue") return isOverdue(task)

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) => task.tags.includes(tag))
        if (!hasSelectedTag) return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter((t) => isOverdue(t)).length,
  }

  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags))).sort()

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-card shadow-sm border-b transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Welcome, {user}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="transition-all duration-300 bg-transparent"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center space-x-2 transition-all duration-300 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Title and Add Task Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Tasks Pro
              </h1>
              <p className="text-muted-foreground mt-1">Manage your tasks with priorities, due dates, and tags</p>
            </div>
            <Button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>

          {/* Search and Sort */}
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks, descriptions, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 transition-all duration-300"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="px-3 py-2 border border-input bg-background rounded-md transition-all duration-300"
                >
                  <option value="created">Sort by Created</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Filter by Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                      }}
                      className="transition-all duration-300 hover:scale-105"
                    >
                      #{tag}
                    </Button>
                  ))}
                  {selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTags([])}
                      className="text-muted-foreground transition-all duration-300"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task Form */}
          {showTaskForm && (
            <Card className="animate-slide-down transition-all duration-300">
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskForm onSubmit={addTask} onCancel={() => setShowTaskForm(false)} />
              </CardContent>
            </Card>
          )}

          {/* Edit Task Form */}
          {editingTask && (
            <Card className="animate-slide-down transition-all duration-300">
              <CardHeader>
                <CardTitle>Edit Task</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskForm
                  initialTitle={editingTask.title}
                  initialDescription={editingTask.description}
                  initialPriority={editingTask.priority}
                  initialDueDate={editingTask.dueDate}
                  initialTags={editingTask.tags}
                  onSubmit={(title, description, priority, dueDate, tags) =>
                    updateTask(editingTask.id, title, description, priority, dueDate, tags)
                  }
                  onCancel={() => setEditingTask(null)}
                  isEditing
                />
              </CardContent>
            </Card>
          )}

          {/* Task Filter */}
          <TaskFilter currentFilter={filter} onFilterChange={setFilter} taskCounts={taskCounts} />

          {/* Task List */}
          <TaskList
            tasks={filteredAndSortedTasks}
            onToggle={toggleTask}
            onEdit={setEditingTask}
            onDelete={deleteTask}
          />

          {/* Empty State */}
          {filteredAndSortedTasks.length === 0 && (
            <Card className="transition-all duration-300">
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground animate-fade-in">
                  {searchQuery || selectedTags.length > 0 ? (
                    <>
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      No tasks match your search criteria.
                    </>
                  ) : (
                    <>
                      {filter === "all" && "No tasks yet. Create your first task!"}
                      {filter === "completed" && "No completed tasks."}
                      {filter === "pending" && "No pending tasks."}
                      {filter === "overdue" && "No overdue tasks."}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
