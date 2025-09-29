"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserManager } from "@/lib/user-manager"

export function LoginForm() {
  const [rut, setRut] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = UserManager.validateUser(rut.trim())

      if (!user) {
        setError("RUT no encontrado en el sistema")
        setIsLoading(false)
        return
      }

      // Store user session (in a real app, this would be more secure)
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Redirect based on user type
      if (user.type === "professor") {
        router.push("/professor-dashboard")
      } else {
        router.push("/student-dashboard")
      }
    } catch (err) {
      setError("Error al procesar el login")
      setIsLoading(false)
    }
  }

  const formatRut = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^0-9kK]/g, "")

    // Add hyphen before the last character if length > 1
    if (cleaned.length > 1) {
      return cleaned.slice(0, -1) + "-" + cleaned.slice(-1)
    }

    return cleaned
  }

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value)
    setRut(formatted)
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tu RUT para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="rut" className="text-sm font-medium text-foreground">
              RUT
            </label>
            <Input
              id="rut"
              type="text"
              placeholder="12345678-9"
              value={rut}
              onChange={handleRutChange}
              maxLength={12}
              className="text-center"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || rut.length < 3}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <div className="mt-6 text-xs text-muted-foreground text-center">
          <p className="mb-2">Usuarios de prueba:</p>
          <p>Estudiantes: 12345678-9, 98765432-1</p>
          <p>Profesores: 11111111-1, 22222222-2</p>
        </div>
      </CardContent>
    </Card>
  )
}
