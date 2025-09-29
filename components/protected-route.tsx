"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserManager, type StudentUser, type ProfessorUser } from "@/lib/user-manager"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedUserTypes?: ("student" | "professor")[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  allowedUserTypes = ["student", "professor"],
  redirectTo = "/",
}: ProtectedRouteProps) {
  const [user, setUser] = useState<StudentUser | ProfessorUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = UserManager.getCurrentUser()

    if (!currentUser) {
      router.push(redirectTo)
      return
    }

    if (!allowedUserTypes.includes(currentUser.type)) {
      // Redirect to appropriate dashboard based on user type
      if (currentUser.type === "student") {
        router.push("/student-dashboard")
      } else {
        router.push("/professor-dashboard")
      }
      return
    }

    setUser(currentUser)
    setIsLoading(false)
  }, [router, allowedUserTypes, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
