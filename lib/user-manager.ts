// User management utilities and database for professors and students

export interface BaseUser {
  rut: string
  name: string
  photo: string
  type: "student" | "professor"
}

export interface StudentUser extends BaseUser {
  type: "student"
  currentApplications: number
  appliedCourses: string[]
}

export interface ProfessorUser extends BaseUser {
  type: "professor"
  department: string
  courses: CourseInfo[]
}

export interface CourseInfo {
  id: number
  name: string
  schedule: {
    days: string[]
    timeBlocks: string[]
  }
  currentTA?: {
    name: string
    rut: string
  }
  applicants: number
}

// Mock user database combining students and professors
export const userDatabase: Record<string, StudentUser | ProfessorUser> = {
  // Students
  "12345678-9": {
    rut: "12345678-9",
    name: "María González",
    photo: "/female-student-profile.png",
    type: "student",
    currentApplications: 0,
    appliedCourses: [],
  },
  "98765432-1": {
    rut: "98765432-1",
    name: "Carlos Rodríguez",
    photo: "/placeholder.svg?key=student3",
    type: "student",
    currentApplications: 2,
    appliedCourses: ["Procesamiento de Señales Biológicas", "Bioinstrumentación"],
  },

  // Professors
  "11111111-1": {
    rut: "11111111-1",
    name: "Dr. Ana Fernández",
    photo: "/placeholder.svg?key=prof1",
    type: "professor",
    department: "Ingeniería Biomédica",
    courses: [
      {
        id: 1,
        name: "Introducción a la Ingeniería Biomédica",
        schedule: {
          days: ["Lunes", "Miércoles"],
          timeBlocks: ["8:00-9:30", "8:00-9:30"],
        },
        currentTA: {
          name: "Pedro Martínez",
          rut: "33333333-3",
        },
        applicants: 5,
      },
      {
        id: 4,
        name: "Sistemas Electrónicos Interdisciplinaria",
        schedule: {
          days: ["Martes", "Jueves"],
          timeBlocks: ["10:00-11:30", "10:00-11:30"],
        },
        applicants: 3,
      },
    ],
  },
  "22222222-2": {
    rut: "22222222-2",
    name: "Dr. Roberto Silva",
    photo: "/placeholder.svg?key=prof2",
    type: "professor",
    department: "Ingeniería Biomédica",
    courses: [
      {
        id: 2,
        name: "Procesamiento de Señales Biológicas",
        schedule: {
          days: ["Lunes", "Viernes"],
          timeBlocks: ["14:00-15:30", "14:00-15:30"],
        },
        currentTA: {
          name: "Carlos Rodríguez",
          rut: "98765432-1",
        },
        applicants: 8,
      },
      {
        id: 12,
        name: "Bioinstrumentación",
        schedule: {
          days: ["Miércoles"],
          timeBlocks: ["16:00-17:30"],
        },
        applicants: 6,
      },
    ],
  },
}

export class UserManager {
  static validateUser(rut: string): StudentUser | ProfessorUser | null {
    return userDatabase[rut] || null
  }

  static isStudent(user: BaseUser): user is StudentUser {
    return user.type === "student"
  }

  static isProfessor(user: BaseUser): user is ProfessorUser {
    return user.type === "professor"
  }

  static getCurrentUser(): StudentUser | ProfessorUser | null {
    if (typeof window === "undefined") return null

    const userData = localStorage.getItem("currentUser")
    if (!userData) return null

    try {
      return JSON.parse(userData)
    } catch {
      return null
    }
  }

  static logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  }
}
