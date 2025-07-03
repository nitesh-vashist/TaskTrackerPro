"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface TaskFormProps {
  onSubmit: (
    title: string,
    description: string,
    priority: "low" | "medium" | "high",
    dueDate?: string,
    tags?: string[],
  ) => void
  onCancel: () => void
  initialTitle?: string
  initialDescription?: string
  initialPriority?: "low" | "medium" | "high"
  initialDueDate?: string
  initialTags?: string[]
  isEditing?: boolean
}

export default function TaskForm({
  onSubmit,
  onCancel,
  initialTitle = "",
  initialDescription = "",
  initialPriority = "medium",
  initialDueDate = "",
  initialTags = [],
  isEditing = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [priority, setPriority] = useState<"low" | "medium" | "high">(initialPriority)
  const [dueDate, setDueDate] = useState(initialDueDate)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [newTag, setNewTag] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setError("")
    onSubmit(title.trim(), description.trim(), priority, dueDate || undefined, tags)
    if (!isEditing) {
      setTitle("")
      setDescription("")
      setPriority("medium")
      setDueDate("")
      setTags([])
      setNewTag("")
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`transition-all duration-300 ${error ? "border-red-500 shake" : ""}`}
        />
        {error && <p className="text-sm text-red-500 animate-fade-in">{error}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            className={`w-full px-3 py-2 border border-input bg-background rounded-md transition-all duration-300 ${getPriorityColor(priority)}`}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="transition-all duration-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            className="transition-all duration-300"
          />
          <Button
            type="button"
            onClick={addTag}
            size="icon"
            variant="outline"
            className="transition-all duration-300 bg-transparent"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1 transition-all duration-300 hover:scale-105"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-500 transition-colors duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="transition-all duration-300 hover:scale-105">
          {isEditing ? "Update Task" : "Add Task"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="transition-all duration-300 bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
