"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface AuthFormProps {
  onLogin: (user: any) => void
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setDebugInfo("Iniciando registro...")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string

    console.log("📝 Datos del formulario:", { name, email, phone: phone ? "***" : null, hasPassword: !!password })

    // Validaciones del lado del cliente
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validar formato de teléfono (básico)
    if (phone) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      const cleanPhone = phone.replace(/[\s\-()]/g, "")
      if (!phoneRegex.test(cleanPhone)) {
        toast({
          title: "Error",
          description: "Por favor ingresa un número de teléfono válido (ej: +1234567890)",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    }

    try {
      setDebugInfo("Enviando datos al servidor...")

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      })

      setDebugInfo(`Respuesta del servidor: ${response.status}`)

      const data = await response.json()
      console.log("📨 Respuesta del servidor:", data)

      if (response.ok) {
        toast({
          title: "✅ Registro exitoso",
          description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        })
        // Limpiar formulario
        ;(e.target as HTMLFormElement).reset()
        setDebugInfo("Usuario creado exitosamente")
      } else {
        console.error("❌ Error del servidor:", data)
        toast({
          title: "❌ Error",
          description: data.error || "Error desconocido",
          variant: "destructive",
        })
        setDebugInfo(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("💥 Error de red:", error)
      toast({
        title: "❌ Error",
        description: "Error de conexión. Verifica tu internet.",
        variant: "destructive",
      })
      setDebugInfo(`Error de conexión: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setDebugInfo("Iniciando sesión...")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.user)
        toast({
          title: "✅ Bienvenido",
          description: "Has iniciado sesión correctamente",
        })
        setDebugInfo("Sesión iniciada exitosamente")
      } else {
        toast({
          title: "❌ Error",
          description: data.error,
          variant: "destructive",
        })
        setDebugInfo(`Error de login: ${data.error}`)
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error de conexión",
        variant: "destructive",
      })
      setDebugInfo(`Error de conexión: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="w-full max-w-md px-4">
        {/* LOGO DEPORTIVO GENÉRICO */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 relative flex items-center justify-center bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full shadow-2xl">
            <div className="text-6xl">🏆</div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-yellow-600 drop-shadow-sm">Mundial de Clubes</h1>
            <p className="text-lg font-semibold text-amber-700">Torneo Internacional 2025</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>🗓️ 15 Jun - 13 Jul</span>
              <span>•</span>
              <span>🏟️ 12 Ciudades</span>
              <span>•</span>
              <span>⚽ 32 Equipos</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-yellow-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-yellow-600">🏆 Quiniela Oficial</CardTitle>
            <CardDescription>Registra tus pronósticos y compite con otros usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input id="login-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre Completo *</Label>
                    <Input
                      id="register-name"
                      name="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      required
                      minLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email *</Label>
                    <Input id="register-email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="flex items-center gap-2">
                      📱 WhatsApp <span className="text-xs text-gray-500">(opcional)</span>
                    </Label>
                    <Input
                      id="register-phone"
                      name="phone"
                      type="tel"
                      placeholder="+1234567890 (con código de país)"
                      className="text-sm"
                    />
                    <p className="text-xs text-gray-500">💬 Para recibir notificaciones de resultados por WhatsApp</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña *</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Registrando...
                      </div>
                    ) : (
                      "Registrarse"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Debug info en desarrollo */}
            {process.env.NODE_ENV === "development" && debugInfo && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                <strong>Debug:</strong> {debugInfo}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>🌟 Primer Mundial de Clubes con 32 equipos</p>
          <p>🏆 El torneo más prestigioso a nivel de clubes</p>
          <p className="mt-2 text-xs">📱 Registra tu WhatsApp para notificaciones instantáneas</p>
        </div>
      </div>
    </div>
  )
}
