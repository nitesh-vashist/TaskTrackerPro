"use client"

import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"
import { Label } from "./ui/Label"
import { CheckSquare, Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Username is required")
      return
    }
    setError("")
    onLogin(username.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="transition-all duration-300 bg-transparent"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      <Card className="w-full max-w-md transform transition-all duration-500 hover:scale-105 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full transition-colors duration-300">
              <CheckSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Task Tracker Pro
          </CardTitle>
          <CardDescription>Enter your username to access your enhanced task manager</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`transition-all duration-300 ${error ? "border-red-500 shake" : ""}`}
              />
              {error && <p className="text-sm text-red-500 animate-fade-in">{error}</p>}
            </div>
            <Button type="submit" className="w-full transition-all duration-300 hover:scale-105">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
