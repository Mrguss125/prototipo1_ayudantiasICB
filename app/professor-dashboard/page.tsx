"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserManager, type ProfessorUser } from "@/lib/user-manager"
import { ProfessorDashboard } from "@/components/professor-dashboard"

export default function ProfessorDashboardPage() {
  const [professor, setProfessor] = useState<ProfessorUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = UserManager.getCurrentUser()

    if (!user) {
      router.push("/")
      return
    }

    if (!UserManager.isProfessor(user)) {
      router.push("/student-dashboard")
      return
    }

    setProfessor(user)
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

  if (!professor) {
    return null
  }

  return <ProfessorDashboard professor={professor} />
}
