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
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string

    // Validar formato de teléfono (básico)
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (phone && !phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número de teléfono válido (ej: +1234567890)",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        })
        // Limpiar formulario
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

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
          title: "Bienvenido",
          description: "Has iniciado sesión correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="w-full max-w-md px-4">
        {/* LOGO OFICIAL DEL MUNDIAL DE CLUBES FIFA 2025 */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/ad/2025_FIFA_Club_World_Cup.svg"
              alt="FIFA Club World Cup 2025"
              className="w-full h-full object-contain drop-shadow-lg"
              onError={(e) => {
                // Fallback si no carga el logo oficial
                e.currentTarget.src = "/placeholder.svg?height=128&width=128&text=FIFA+2025"
              }}
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-yellow-600 drop-shadow-sm">FIFA Club World Cup</h1>
            <p className="text-lg font-semibold text-amber-700">USA 2025</p>
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
                    <Label htmlFor="register-name">Nombre Completo</Label>
                    <Input id="register-name" name="name" type="text" placeholder="Tu nombre completo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
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
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input id="register-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Registrarse"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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
