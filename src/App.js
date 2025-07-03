"use client"

import { useState, useEffect } from "react"
import Login from "./components/Login"
import TaskDashboard from "./components/TaskDashboard"
import { ThemeProvider } from "./components/ThemeProvider"

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("taskTracker_user")
    if (savedUser) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (username) => {
    localStorage.setItem("taskTracker_user", username)
    setUser(username)
  }

  const handleLogout = () => {
    localStorage.removeItem("taskTracker_user")
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        {!user ? <Login onLogin={handleLogin} /> : <TaskDashboard user={user} onLogout={handleLogout} />}
      </div>
    </ThemeProvider>
  )
}

export default App
