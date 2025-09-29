"use client"

import { useSearchParams } from "next/navigation"
import { ApplicationForm } from "@/components/application-form"
import { ProtectedRoute } from "@/components/protected-route"

interface ApplyPageProps {
  params: {
    id: string
  }
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const assistantshipId = Number.parseInt(params.id)
  const searchParams = useSearchParams()
  const studentRut = searchParams.get("rut") || ""

  return (
    <ProtectedRoute allowedUserTypes={["student"]}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Postulación a Ayudantía</h1>
                <p className="text-muted-foreground mt-1">Complete el formulario para postular</p>
              </div>
              <a href="/student-dashboard" className="text-sm text-primary hover:text-primary/80 transition-colors">
                ← Volver al panel
              </a>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <ApplicationForm assistantshipId={assistantshipId} studentRut={studentRut} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
