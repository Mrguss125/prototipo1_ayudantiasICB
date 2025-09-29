"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Calendar, AlertCircle } from "lucide-react"

interface AssistantshipListingsProps {
  studentRut?: string
  canApply?: boolean
  appliedCourses?: string[]
}

const assistantshipOffers = [
  {
    id: 1,
    courseName: "Introducción a la Ingeniería Biomédica",
    professor: "Dr. María González",
    schedule: {
      days: ["Lunes", "Miércoles"],
      blocks: ["Bloque 1 (8:15 - 9:35)", "Bloque 3 (11:25 - 12:45)"],
    },
    requirements: "Primer año de carrera",
    available: true,
  },
  {
    id: 2,
    courseName: "Procesamiento de Señales Biológicas",
    professor: "Dr. Carlos Rodríguez",
    schedule: {
      days: ["Martes", "Jueves"],
      blocks: ["Bloque 2 (9:50 - 11:10)", "Bloque 4 (13:30 - 14:50)"],
    },
    requirements: "Matemáticas III aprobado",
    available: true,
  },
  {
    id: 3,
    courseName: "Biomateriales",
    professor: "Dra. Patricia Silva",
    schedule: {
      days: ["Lunes", "Viernes"],
      blocks: ["Bloque 3 (11:25 - 12:45)", "Bloque 5 (15:05 - 16:25)"],
    },
    requirements: "Química General aprobada",
    available: true,
  },
  {
    id: 4,
    courseName: "Sistemas Electrónicos Interdisciplinaria",
    professor: "Dr. Luis Fernández",
    schedule: {
      days: ["Miércoles", "Viernes"],
      blocks: ["Bloque 2 (9:50 - 11:10)", "Bloque 6 (16:40 - 18:00)"],
    },
    requirements: "Electrónica Básica aprobada",
    available: true,
  },
  {
    id: 5,
    courseName: "Control de Sistemas",
    professor: "Dr. Roberto Morales",
    schedule: {
      days: ["Martes", "Jueves"],
      blocks: ["Bloque 1 (8:15 - 9:35)", "Bloque 5 (15:05 - 16:25)"],
    },
    requirements: "Matemáticas IV aprobado",
    available: true,
  },
  {
    id: 6,
    courseName: "Electromedicina",
    professor: "Dra. Carmen López",
    schedule: {
      days: ["Lunes", "Miércoles"],
      blocks: ["Bloque 4 (13:30 - 14:50)", "Bloque 6 (16:40 - 18:00)"],
    },
    requirements: "Sistemas Electrónicos aprobado",
    available: true,
  },
  {
    id: 7,
    courseName: "Biomecánica",
    professor: "Dr. Andrés Herrera",
    schedule: {
      days: ["Martes", "Viernes"],
      blocks: ["Bloque 3 (11:25 - 12:45)", "Bloque 4 (13:30 - 14:50)"],
    },
    requirements: "Física II aprobada",
    available: true,
  },
  {
    id: 8,
    courseName: "Sistemas Digitales y Microcontroladores",
    professor: "Dr. Miguel Torres",
    schedule: {
      days: ["Lunes", "Jueves"],
      blocks: ["Bloque 2 (9:50 - 11:10)", "Bloque 5 (15:05 - 16:25)"],
    },
    requirements: "Programación I aprobada",
    available: true,
  },
  {
    id: 9,
    courseName: "Mediciones Fisiológicas y Bioseguridad",
    professor: "Dra. Elena Vargas",
    schedule: {
      days: ["Miércoles", "Viernes"],
      blocks: ["Bloque 1 (8:15 - 9:35)", "Bloque 4 (13:30 - 14:50)"],
    },
    requirements: "Fisiología Humana aprobada",
    available: true,
  },
  {
    id: 10,
    courseName: "Evaluación de Proyectos",
    professor: "Dr. Francisco Ruiz",
    schedule: {
      days: ["Martes", "Jueves"],
      blocks: ["Bloque 6 (16:40 - 18:00)", "Bloque 3 (11:25 - 12:45)"],
    },
    requirements: "Economía de la Ingeniería aprobada",
    available: true,
  },
  {
    id: 11,
    courseName: "Ingeniería Clínica",
    professor: "Dra. Sofía Mendoza",
    schedule: {
      days: ["Lunes", "Miércoles"],
      blocks: ["Bloque 5 (15:05 - 16:25)", "Bloque 2 (9:50 - 11:10)"],
    },
    requirements: "Electromedicina aprobada",
    available: true,
  },
  {
    id: 12,
    courseName: "Bioinstrumentación",
    professor: "Dr. Javier Castro",
    schedule: {
      days: ["Martes", "Viernes"],
      blocks: ["Bloque 1 (8:15 - 9:35)", "Bloque 6 (16:40 - 18:00)"],
    },
    requirements: "Instrumentación Electrónica aprobada",
    available: true,
  },
  {
    id: 13,
    courseName: "Informática en Salud",
    professor: "Dra. Claudia Ramírez",
    schedule: {
      days: ["Miércoles", "Jueves"],
      blocks: ["Bloque 3 (11:25 - 12:45)", "Bloque 5 (15:05 - 16:25)"],
    },
    requirements: "Base de Datos aprobada",
    available: true,
  },
  {
    id: 14,
    courseName: "Bioinformática",
    professor: "Dr. Pablo Sánchez",
    schedule: {
      days: ["Lunes", "Viernes"],
      blocks: ["Bloque 6 (16:40 - 18:00)", "Bloque 1 (8:15 - 9:35)"],
    },
    requirements: "Programación II aprobada",
    available: true,
  },
  {
    id: 15,
    courseName: "Análisis de Sistema de Salud",
    professor: "Dra. Isabel Flores",
    schedule: {
      days: ["Martes", "Jueves"],
      blocks: ["Bloque 2 (9:50 - 11:10)", "Bloque 6 (16:40 - 18:00)"],
    },
    requirements: "Estadística aplicada",
    available: true,
  },
  {
    id: 16,
    courseName: "Gestión de Operaciones en Salud",
    professor: "Dr. Rodrigo Peña",
    schedule: {
      days: ["Miércoles", "Viernes"],
      blocks: ["Bloque 4 (13:30 - 14:50)", "Bloque 3 (11:25 - 12:45)"],
    },
    requirements: "Gestión de Proyectos aprobada",
    available: true,
  },
  {
    id: 17,
    courseName: "Desarrollos e Innovación en Ingeniería Biomédica",
    professor: "Dr. Alejandro Vega",
    schedule: {
      days: ["Lunes", "Jueves"],
      blocks: ["Bloque 1 (8:15 - 9:35)", "Bloque 4 (13:30 - 14:50)"],
    },
    requirements: "Tesis I en desarrollo",
    available: false,
  },
]

export function AssistantshipListings({
  studentRut,
  canApply = true,
  appliedCourses = [],
}: AssistantshipListingsProps = {}) {
  const [selectedAssistantship, setSelectedAssistantship] = useState<number | null>(null)

  const handleApply = (assistantshipId: number) => {
    if (!canApply) {
      return
    }
    setSelectedAssistantship(assistantshipId)
    // Navigate to application form
    window.location.href = `/apply/${assistantshipId}?rut=${studentRut || ""}`
  }

  const hasAppliedToCourse = (courseName: string) => {
    return appliedCourses.includes(courseName)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Ofertas de Ayudantía Disponibles</h2>
          <p className="text-muted-foreground mt-2">
            Selecciona las ayudantías que te interesen. Máximo 2 postulaciones por estudiante.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {assistantshipOffers.filter((offer) => offer.available).length} disponibles
        </Badge>
      </div>

      {!canApply && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-destructive">
              Has alcanzado el límite máximo de postulaciones (2/2)
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            No puedes postular a más ayudantías hasta que se resuelvan tus postulaciones actuales.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assistantshipOffers.map((offer) => {
          const alreadyApplied = hasAppliedToCourse(offer.courseName)
          const isDisabled = !offer.available || !canApply || alreadyApplied

          return (
            <Card
              key={offer.id}
              className={`transition-all duration-200 hover:shadow-lg ${
                isDisabled ? "opacity-60" : "hover:border-primary/50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">{offer.courseName}</CardTitle>
                  <div className="flex flex-col gap-1">
                    <Badge variant={offer.available ? "default" : "secondary"} className="ml-2">
                      {offer.available ? "Disponible" : "Cerrada"}
                    </Badge>
                    {alreadyApplied && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Ya postulaste
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{offer.professor}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{offer.schedule.days.join(", ")}</span>
                  </div>

                  <div className="space-y-1">
                    {offer.schedule.blocks.map((block, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground ml-6">
                        <Clock className="h-3 w-3" />
                        <span>{block}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    <strong>Requisitos:</strong> {offer.requirements}
                  </p>

                  <Button
                    onClick={() => handleApply(offer.id)}
                    disabled={isDisabled}
                    className="w-full"
                    variant={!isDisabled ? "default" : "secondary"}
                  >
                    {alreadyApplied
                      ? "Ya Postulaste"
                      : !offer.available
                        ? "No Disponible"
                        : !canApply
                          ? "Límite Alcanzado"
                          : "Postular a Ayudantía"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
