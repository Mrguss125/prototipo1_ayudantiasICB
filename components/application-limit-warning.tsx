"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react"

interface ApplicationRecord {
  id: string
  studentRut: string
  assistantshipId: number
  courseName: string
  applicationDate: Date
  status: "pending" | "approved" | "rejected"
}

interface ApplicationLimitWarningProps {
  currentApplications: number
  maxApplications?: number
  appliedCourses: string[]
  studentApplications?: ApplicationRecord[]
}

export function ApplicationLimitWarning({
  currentApplications,
  maxApplications = 2,
  appliedCourses,
  studentApplications = [],
}: ApplicationLimitWarningProps) {
  const remainingApplications = maxApplications - currentApplications
  const isAtLimit = currentApplications >= maxApplications

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "rejected":
        return <X className="h-3 w-3 text-red-500" />
      case "pending":
      default:
        return <Clock className="h-3 w-3 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  return (
    <div className="space-y-4">
      {/* Application Limit Status */}
      <Card className={`${isAtLimit ? "border-red-200 dark:border-red-800" : "border-blue-200 dark:border-blue-800"}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isAtLimit ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-blue-500" />
            )}
            Estado de Postulaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Postulaciones actuales:</span>
            <Badge variant={isAtLimit ? "destructive" : "secondary"} className="font-medium">
              {currentApplications}/{maxApplications}
            </Badge>
          </div>

          {!isAtLimit && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Postulaciones restantes:</span>
              <Badge variant="outline" className="font-medium text-green-600 border-green-200">
                {remainingApplications}
              </Badge>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span>{Math.round((currentApplications / maxApplications) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${isAtLimit ? "bg-red-500" : "bg-blue-500"}`}
                style={{ width: `${Math.min((currentApplications / maxApplications) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Applications List */}
      {studentApplications.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Mis Postulaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{application.courseName}</h4>
                  <p className="text-xs text-muted-foreground">
                    Postulado el {application.applicationDate.toLocaleDateString("es-CL")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(application.status)}
                  <Badge variant="outline" className={`text-xs ${getStatusColor(application.status)}`}>
                    {application.status === "pending"
                      ? "Pendiente"
                      : application.status === "approved"
                        ? "Aprobada"
                        : "Rechazada"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Warning Messages */}
      {isAtLimit && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Límite alcanzado:</strong> Solo se puede postular a dos cursos. Ya has alcanzado el límite máximo de
            postulaciones permitidas.
          </AlertDescription>
        </Alert>
      )}

      {currentApplications === maxApplications - 1 && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <strong>Última oportunidad:</strong> Te queda solo 1 postulación disponible. Elige cuidadosamente tu próxima
            ayudantía.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
