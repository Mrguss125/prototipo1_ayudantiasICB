"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { LogOut, BookOpen, Clock, User, AlertCircle } from "lucide-react"
import { UserManager, type StudentUser } from "@/lib/user-manager"
import { AssistantshipListings } from "@/components/assistantship-listings"

interface StudentDashboardProps {
  student: StudentUser
}

export function StudentDashboard({ student }: StudentDashboardProps) {
  const router = useRouter()

  const handleLogout = () => {
    UserManager.logout()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const remainingApplications = 2 - student.currentApplications
  const progressPercentage = (student.currentApplications / 2) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.name} />
                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Panel de Estudiante</h1>
                <p className="text-muted-foreground">Bienvenido, {student.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Student Info and Application Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mi Información
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RUT</p>
                <p className="font-medium">{student.rut}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Usuario</p>
                <Badge variant="secondary">Estudiante</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Estado de Postulaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Postulaciones Realizadas</p>
                  <p className="text-sm font-medium">{student.currentApplications}/2</p>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Postulaciones Restantes</p>
                <p className="text-2xl font-bold text-primary">{remainingApplications}</p>
              </div>
              {remainingApplications === 0 && (
                <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">Has alcanzado el límite máximo</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Applied Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Mis Postulaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.appliedCourses.length > 0 ? (
                <div className="space-y-2">
                  {student.appliedCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">{course}</p>
                      <Badge variant="outline" className="text-xs">
                        Pendiente
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No has postulado a ningún curso aún</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Application Limit Warning */}
        {remainingApplications === 0 && (
          <div className="mb-8">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                  <div>
                    <h3 className="font-semibold text-destructive">Límite de Postulaciones Alcanzado</h3>
                    <p className="text-sm text-muted-foreground">
                      Has postulado al máximo de 2 cursos permitidos. No puedes postular a más ayudantías.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Available Assistantships */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Ofertas de Ayudantías Disponibles</h2>
            {remainingApplications > 0 && (
              <Badge variant="secondary">Puedes postular a {remainingApplications} más</Badge>
            )}
          </div>

          <AssistantshipListings
            studentRut={student.rut}
            canApply={remainingApplications > 0}
            appliedCourses={student.appliedCourses}
          />
        </div>
      </main>
    </div>
  )
}
