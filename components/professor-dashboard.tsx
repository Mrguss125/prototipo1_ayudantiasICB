"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Users, Clock, BookOpen, UserCheck } from "lucide-react"
import { UserManager, type ProfessorUser } from "@/lib/user-manager"

interface ProfessorDashboardProps {
  professor: ProfessorUser
}

export function ProfessorDashboard({ professor }: ProfessorDashboardProps) {
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

  const formatSchedule = (days: string[], timeBlocks: string[]) => {
    return days.map((day, index) => `${day} ${timeBlocks[index]}`).join(", ")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={professor.photo || "/placeholder.svg"} alt={professor.name} />
                <AvatarFallback>{getInitials(professor.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Panel de Profesor</h1>
                <p className="text-muted-foreground">Bienvenido, {professor.name}</p>
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
        {/* Professor Info */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Información del Profesor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{professor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RUT</p>
                  <p className="font-medium">{professor.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Departamento</p>
                  <p className="font-medium">{professor.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Overview */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Mis Cursos</h2>
            <Badge variant="secondary">{professor.courses.length} cursos</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {professor.courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription>ID: {course.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Schedule */}
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Horario</p>
                      <p className="text-sm font-medium">
                        {formatSchedule(course.schedule.days, course.schedule.timeBlocks)}
                      </p>
                    </div>
                  </div>

                  {/* Current TA */}
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ayudante Actual</p>
                      {course.currentTA ? (
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{course.currentTA.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {course.currentTA.rut}
                          </Badge>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Sin ayudante asignado</p>
                      )}
                    </div>
                  </div>

                  {/* Applicants */}
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Postulantes</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{course.applicants} estudiantes</p>
                        {course.applicants > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {course.applicants > 5 ? "Alta demanda" : "Demanda normal"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Badge variant={course.currentTA ? "default" : "destructive"}>
                        {course.currentTA ? "Con Ayudante" : "Necesita Ayudante"}
                      </Badge>
                      {course.applicants > 0 && (
                        <Button variant="outline" size="sm">
                          Ver Postulantes
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{professor.courses.length}</p>
                  <p className="text-sm text-muted-foreground">Cursos Totales</p>
                </div>
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{professor.courses.filter((c) => c.currentTA).length}</p>
                  <p className="text-sm text-muted-foreground">Con Ayudante</p>
                </div>
                <UserCheck className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {professor.courses.reduce((sum, course) => sum + course.applicants, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Postulantes Totales</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
