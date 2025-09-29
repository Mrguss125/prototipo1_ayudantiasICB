"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RutValidator } from "@/components/rut-validator"
import { ApplicationManager, type StudentInfo } from "@/lib/application-manager"
import { User, Clock, Calendar, AlertCircle, CheckCircle } from "lucide-react"

// Mock data for assistantship details
const assistantshipData = {
  1: {
    courseName: "Biomecánica",
    professor: "Dr. María González",
    schedule: {
      days: ["Lunes", "Miércoles"],
      blocks: ["Bloque 2 (9:50 - 11:10)", "Bloque 4 (13:30 - 14:50)"],
    },
  },
  2: {
    courseName: "Señales Biomédicas",
    professor: "Dr. Carlos Rodríguez",
    schedule: {
      days: ["Martes", "Jueves"],
      blocks: ["Bloque 1 (8:15 - 9:35)", "Bloque 3 (11:25 - 12:45)"],
    },
  },
  3: {
    courseName: "Instrumentación Biomédica",
    professor: "Dra. Ana Martínez",
    schedule: {
      days: ["Lunes", "Viernes"],
      blocks: ["Bloque 5 (15:05 - 16:25)", "Bloque 2 (9:50 - 11:10)"],
    },
  },
  4: {
    courseName: "Imagenología Médica",
    professor: "Dr. Luis Fernández",
    schedule: {
      days: ["Miércoles", "Viernes"],
      blocks: ["Bloque 3 (11:25 - 12:45)", "Bloque 6 (16:40 - 18:00)"],
    },
  },
  5: {
    courseName: "Biomateriales",
    professor: "Dra. Patricia Silva",
    schedule: {
      days: ["Martes", "Jueves"],
      blocks: ["Bloque 4 (13:30 - 14:50)", "Bloque 5 (15:05 - 16:25)"],
    },
  },
}

// Weekly schedule blocks
const timeBlocks = [
  { id: 1, time: "8:15 - 9:35", name: "Bloque 1" },
  { id: 2, time: "9:50 - 11:10", name: "Bloque 2" },
  { id: 3, time: "11:25 - 12:45", name: "Bloque 3" },
  { id: 4, time: "13:30 - 14:50", name: "Bloque 4" },
  { id: 5, time: "15:05 - 16:25", name: "Bloque 5" },
  { id: 6, time: "16:40 - 18:00", name: "Bloque 6" },
  { id: 7, time: "18:15 - 19:35", name: "Bloque 7" },
  { id: 8, time: "19:50 - 21:10", name: "Bloque 8" },
]

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

interface ApplicationFormProps {
  assistantshipId: number
  studentRut?: string
}

export function ApplicationForm({ assistantshipId, studentRut = "" }: ApplicationFormProps) {
  const [rut, setRut] = useState(studentRut)
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [isValidRut, setIsValidRut] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationResult, setApplicationResult] = useState<{
    success: boolean
    message: string
    applicationId?: string
  } | null>(null)

  useEffect(() => {
    if (studentRut && studentRut !== rut) {
      setRut(studentRut)
    }
  }, [studentRut, rut])

  const assistantship = assistantshipData[assistantshipId as keyof typeof assistantshipData]

  if (!assistantship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground mb-2">Ayudantía no encontrada</h2>
        <p className="text-muted-foreground">La ayudantía solicitada no existe.</p>
      </div>
    )
  }

  const handleValidation = (isValid: boolean, student: StudentInfo | null) => {
    setIsValidRut(isValid)
    setStudentInfo(student)
    setShowError(false)
    setErrorMessage("")
  }

  const handleSubmit = () => {
    if (!isValidRut || !studentInfo) {
      setShowError(true)
      setErrorMessage("Debe ingresar un RUT válido para continuar con la postulación.")
      return
    }

    const validationResult = ApplicationManager.canApplyToAssistantship(studentInfo.rut, assistantshipId)

    if (!validationResult.canApply) {
      setShowError(true)
      setErrorMessage(validationResult.reason || "No se puede procesar la postulación")
      return
    }

    // Submit the application
    const result = ApplicationManager.submitApplication(studentInfo.rut, assistantshipId, assistantship.courseName)

    setApplicationResult(result)
    setIsSubmitted(result.success)

    if (!result.success) {
      setShowError(true)
      setErrorMessage(result.message)
    }
  }

  const getScheduleBlockInfo = (day: string, blockId: number) => {
    const dayIndex = weekDays.indexOf(day)
    if (dayIndex === -1) return null

    const isAssistantshipBlock =
      assistantship.schedule.days.includes(day) &&
      assistantship.schedule.blocks.some((block) => block.includes(`Bloque ${blockId}`))

    return {
      isAssistantshipBlock,
      blockName: `Bloque ${blockId}`,
      time: timeBlocks[blockId - 1]?.time || "",
    }
  }

  if (isSubmitted && applicationResult?.success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">¡Postulación Enviada!</h2>
              <p className="text-green-700 dark:text-green-300">
                Tu postulación a <strong>{assistantship.courseName}</strong> ha sido enviada exitosamente.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-sm mb-2">Detalles de la postulación:</h3>
                <p className="text-sm text-muted-foreground">ID: {applicationResult.applicationId}</p>
                <p className="text-sm text-muted-foreground">Fecha: {new Date().toLocaleDateString("es-CL")}</p>
                <p className="text-sm text-muted-foreground">Estado: Pendiente de revisión</p>
              </div>
              <Button onClick={() => (window.location.href = "/student-dashboard")} className="mt-4">
                Volver al panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Course Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {assistantship.courseName}
          </CardTitle>
          <p className="text-muted-foreground">{assistantship.professor}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{assistantship.schedule.days.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{assistantship.schedule.blocks.join(", ")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule Display */}
      <Card>
        <CardHeader>
          <CardTitle>Horario Semanal</CardTitle>
          <p className="text-sm text-muted-foreground">Los bloques resaltados corresponden a esta ayudantía</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-2 min-w-[600px]">
              {/* Header */}
              <div className="font-semibold text-sm text-center py-2">Horario</div>
              {weekDays.map((day) => (
                <div key={day} className="font-semibold text-sm text-center py-2">
                  {day}
                </div>
              ))}

              {/* Schedule Grid */}
              {timeBlocks.map((block) => (
                <>
                  <div
                    key={`time-${block.id}`}
                    className="text-xs text-muted-foreground py-3 px-2 border-r border-border"
                  >
                    <div className="font-medium">{block.name}</div>
                    <div>{block.time}</div>
                  </div>
                  {weekDays.map((day) => {
                    const blockInfo = getScheduleBlockInfo(day, block.id)
                    return (
                      <div
                        key={`${day}-${block.id}`}
                        className={`py-3 px-2 border border-border rounded text-center text-xs transition-colors ${
                          blockInfo?.isAssistantshipBlock
                            ? "bg-primary/20 border-primary/50 font-medium"
                            : "bg-muted/30"
                        }`}
                      >
                        {blockInfo?.isAssistantshipBlock && (
                          <Badge variant="secondary" className="text-xs">
                            Ayudantía
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Postulante</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete la información requerida para procesar su postulación
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <RutValidator value={rut} onChange={setRut} onValidation={handleValidation} />

          {/* Error Messages */}
          {showError && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleSubmit}
              disabled={!isValidRut || !studentInfo}
              className="w-full sm:w-auto"
              size="lg"
            >
              {!isValidRut ? "Validar RUT para continuar" : "Enviar Postulación"}
            </Button>
            {isValidRut && studentInfo && (
              <p className="text-xs text-muted-foreground mt-2">
                Al enviar, confirma que la información es correcta y acepta los términos de la postulación.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
