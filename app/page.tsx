"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "../components/auth-form"
import { MainDashboard } from "../components/main-dashboard"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (you might want to implement proper session management)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {user ? <MainDashboard user={user} onLogout={handleLogout} /> : <AuthForm onLogin={handleLogin} />}
      <Toaster />
    </>
  )
}
