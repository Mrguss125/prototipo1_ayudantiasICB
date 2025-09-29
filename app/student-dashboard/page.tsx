"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserManager, type StudentUser } from "@/lib/user-manager"
import { StudentDashboard } from "@/components/student-dashboard"

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<StudentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = UserManager.getCurrentUser()

    if (!user) {
      router.push("/")
      return
    }

    if (!UserManager.isStudent(user)) {
      router.push("/professor-dashboard")
      return
    }

    setStudent(user)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  return <StudentDashboard student={student} />
}
