"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FilterType } from "./TaskDashboard"
import { AlertTriangle, CheckCircle, Clock, List } from "lucide-react"

interface TaskFilterProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  taskCounts: {
    all: number
    completed: number
    pending: number
    overdue: number
  }
}

export default function TaskFilter({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) {
  const filters: { key: FilterType; label: string; count: number; icon: React.ReactNode; color?: string }[] = [
    { key: "all", label: "All Tasks", count: taskCounts.all, icon: <List className="h-4 w-4" /> },
    { key: "pending", label: "Pending", count: taskCounts.pending, icon: <Clock className="h-4 w-4" /> },
    { key: "completed", label: "Completed", count: taskCounts.completed, icon: <CheckCircle className="h-4 w-4" /> },
    {
      key: "overdue",
      label: "Overdue",
      count: taskCounts.overdue,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "destructive",
    },
  ]

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={currentFilter === filter.key ? "default" : "outline"}
              onClick={() => onFilterChange(filter.key)}
              className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
                filter.color === "destructive" && currentFilter === filter.key ? "bg-red-600 hover:bg-red-700" : ""
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
              <Badge
                variant={currentFilter === filter.key ? "secondary" : "outline"}
                className={`ml-1 transition-all duration-300 ${
                  filter.key === "overdue" && filter.count > 0
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse"
                    : ""
                }`}
              >
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
