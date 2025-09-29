// Application management utilities and mock database

export interface StudentInfo {
  name: string
  photo: string
  rut: string
  currentApplications: number
  appliedCourses: string[]
}

export interface ApplicationRecord {
  id: string
  studentRut: string
  assistantshipId: number
  courseName: string
  applicationDate: Date
  status: "pending" | "approved" | "rejected"
}

// Mock student database
export const studentDatabase: Record<string, StudentInfo> = {
  "12345678-9": {
    name: "María González",
    photo: "/female-student-profile.png",
    rut: "12345678-9",
    currentApplications: 0,
    appliedCourses: [],
  },
  "98765432-1": {
    name: "Carlos Rodríguez",
    photo: "/placeholder.svg?key=student3",
    rut: "98765432-1",
    currentApplications: 2,
    appliedCourses: ["Procesamiento de Señales Biológicas", "Bioinstrumentación"],
  },
  "11111111-1": {
    name: "Ana Fernández",
    photo: "/placeholder.svg?key=student4",
    rut: "11111111-1",
    currentApplications: 1,
    appliedCourses: ["Biomateriales"],
  },
}

// Mock applications database
export const applicationsDatabase: ApplicationRecord[] = [
  {
    id: "app-002",
    studentRut: "98765432-1",
    assistantshipId: 2,
    courseName: "Procesamiento de Señales Biológicas",
    applicationDate: new Date("2024-01-10"),
    status: "approved",
  },
  {
    id: "app-003",
    studentRut: "98765432-1",
    assistantshipId: 12,
    courseName: "Bioinstrumentación",
    applicationDate: new Date("2024-01-12"),
    status: "pending",
  },
  {
    id: "app-004",
    studentRut: "11111111-1",
    assistantshipId: 3,
    courseName: "Biomateriales",
    applicationDate: new Date("2024-01-14"),
    status: "pending",
  },
]

export class ApplicationManager {
  static validateStudent(rut: string): StudentInfo | null {
    return studentDatabase[rut] || null
  }

  static canApplyToAssistantship(
    studentRut: string,
    assistantshipId: number,
  ): {
    canApply: boolean
    reason?: string
  } {
    const student = this.validateStudent(studentRut)

    if (!student) {
      return { canApply: false, reason: "Estudiante no encontrado" }
    }

    // Check if student has reached the limit of 2 applications
    if (student.currentApplications >= 2) {
      return {
        canApply: false,
        reason: "Solo se puede postular a dos cursos. Ya has alcanzado el límite máximo de postulaciones.",
      }
    }

    // Check if student has already applied to this specific assistantship
    const hasAppliedToThis = applicationsDatabase.some(
      (app) => app.studentRut === studentRut && app.assistantshipId === assistantshipId,
    )

    if (hasAppliedToThis) {
      return {
        canApply: false,
        reason: "Ya has postulado a esta ayudantía anteriormente.",
      }
    }

    return { canApply: true }
  }

  static submitApplication(
    studentRut: string,
    assistantshipId: number,
    courseName: string,
  ): {
    success: boolean
    message: string
    applicationId?: string
  } {
    const validationResult = this.canApplyToAssistantship(studentRut, assistantshipId)

    if (!validationResult.canApply) {
      return {
        success: false,
        message: validationResult.reason || "No se puede procesar la postulación",
      }
    }

    // Create new application record
    const newApplication: ApplicationRecord = {
      id: `app-${Date.now()}`,
      studentRut,
      assistantshipId,
      courseName,
      applicationDate: new Date(),
      status: "pending",
    }

    // Add to applications database
    applicationsDatabase.push(newApplication)

    // Update student's application count
    const student = studentDatabase[studentRut]
    if (student) {
      student.currentApplications += 1
      student.appliedCourses.push(courseName)
    }

    return {
      success: true,
      message: "Postulación enviada exitosamente",
      applicationId: newApplication.id,
    }
  }

  static getStudentApplications(studentRut: string): ApplicationRecord[] {
    return applicationsDatabase.filter((app) => app.studentRut === studentRut)
  }

  static getApplicationStats(): {
    totalApplications: number
    pendingApplications: number
    approvedApplications: number
    rejectedApplications: number
  } {
    return {
      totalApplications: applicationsDatabase.length,
      pendingApplications: applicationsDatabase.filter((app) => app.status === "pending").length,
      approvedApplications: applicationsDatabase.filter((app) => app.status === "approved").length,
      rejectedApplications: applicationsDatabase.filter((app) => app.status === "rejected").length,
    }
  }
}
