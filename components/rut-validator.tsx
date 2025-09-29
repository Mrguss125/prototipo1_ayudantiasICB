"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApplicationLimitWarning } from "@/components/application-limit-warning"
import { ApplicationManager, type StudentInfo } from "@/lib/application-manager"
import { CheckCircle, AlertCircle, User } from "lucide-react"

interface RutValidatorProps {
  onValidation: (isValid: boolean, studentInfo: StudentInfo | null) => void
  value: string
  onChange: (value: string) => void
}

export function RutValidator({ onValidation, value, onChange }: RutValidatorProps) {
  const [validationStatus, setValidationStatus] = useState<"idle" | "valid" | "invalid">("idle")
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)

  const validateRut = (rutValue: string) => {
    // Clean the RUT value
    const cleanRut = rutValue.trim()

    if (!cleanRut) {
      setValidationStatus("idle")
      setStudentInfo(null)
      onValidation(false, null)
      return
    }

    const student = ApplicationManager.validateStudent(cleanRut)

    if (student) {
      setValidationStatus("valid")
      setStudentInfo(student)
      onValidation(true, student)
    } else {
      setValidationStatus("invalid")
      setStudentInfo(null)
      onValidation(false, null)
    }
  }

  const handleRutChange = (newValue: string) => {
    onChange(newValue)
    validateRut(newValue)
  }

  const formatRut = (rut: string) => {
    // Simple RUT formatting for display
    return rut.replace(/(\d{1,8})(\d{1})/, "$1-$2")
  }

  const studentApplications = studentInfo ? ApplicationManager.getStudentApplications(studentInfo.rut) : []

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rut" className="text-sm font-medium">
          RUT del Postulante *
        </Label>
        <div className="relative">
          <Input
            id="rut"
            type="text"
            placeholder="Ej: 1-9, 12345678-9"
            value={value}
            onChange={(e) => handleRutChange(e.target.value)}
            className={`max-w-xs pr-10 ${
              validationStatus === "valid"
                ? "border-green-500 focus:border-green-500"
                : validationStatus === "invalid"
                  ? "border-red-500 focus:border-red-500"
                  : ""
            }`}
          />
          {validationStatus === "valid" && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {validationStatus === "invalid" && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">Ingrese su RUT para validar la información del estudiante</p>
      </div>

      {/* Validation Messages */}
      {validationStatus === "invalid" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            RUT no encontrado en el sistema. Verifique que el RUT esté correctamente ingresado.
          </AlertDescription>
        </Alert>
      )}

      {validationStatus === "valid" && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            RUT validado correctamente. Información del estudiante cargada.
          </AlertDescription>
        </Alert>
      )}

      {/* Student Information Display */}
      {studentInfo && validationStatus === "valid" && (
        <Card className="bg-muted/50 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={studentInfo.photo || "/placeholder.svg"}
                  alt={`Foto de ${studentInfo.name}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-green-200 dark:border-green-800"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-lg text-foreground">{studentInfo.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">RUT: {formatRut(studentInfo.rut)}</p>
              </div>
            </div>

            <ApplicationLimitWarning
              currentApplications={studentInfo.currentApplications}
              appliedCourses={studentInfo.appliedCourses}
              studentApplications={studentApplications}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
