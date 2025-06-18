"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { UserRanking } from "@/lib/db"

export function RankingsDashboard() {
  const [rankings, setRankings] = useState<UserRanking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRankings()
  }, [])

  const loadRankings = async () => {
    try {
      const response = await fetch("/api/rankings")
      if (response.ok) {
        const data = await response.json()
        setRankings(data)
      }
    } catch (error) {
      console.error("Error loading rankings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `${position}°`
    }
  }

  const getRankBadgeVariant = (position: number) => {
    switch (position) {
      case 1:
        return "default"
      case 2:
        return "secondary"
      case 3:
        return "outline"
      default:
        return "outline"
    }
  }

  const sendWhatsAppMessage = (phone: string, userName: string, position: number, points: number) => {
    if (!phone) return

    const message = `🏆 ¡Hola ${userName}! Estás en la posición ${position} de la Quiniela FIFA Club World Cup 2025 con ${points} puntos. ¡Sigue participando! ⚽`
    const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clasificación General</CardTitle>
          <CardDescription>Cargando clasificaciones...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🏆</span>
          Clasificación General
        </CardTitle>
        <CardDescription>
          Puntuación: 3 puntos por marcador exacto, 1 punto por resultado correcto
          <br />📱 Usuarios con WhatsApp: {rankings.filter((u) => u.user_phone).length} de {rankings.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.map((user, index) => {
            const position = index + 1
            const hasWhatsApp = user.user_phone && user.user_phone.trim() !== ""

            return (
              <div
                key={user.user_id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  position <= 3 ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 text-lg">{getRankIcon(position)}</div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {user.user_name}
                      {hasWhatsApp && (
                        <span className="text-green-600 text-sm" title="Usuario con WhatsApp">
                          📱
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.predictions_count} pronósticos
                      {hasWhatsApp && <span className="ml-2 text-green-600">• WhatsApp disponible</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getRankBadgeVariant(position)}>{user.total_points} puntos</Badge>
                  {position <= 3 && (
                    <Badge variant="outline" className="text-xs">
                      Top {position}
                    </Badge>
                  )}
                  {hasWhatsApp && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                      onClick={() => sendWhatsAppMessage(user.user_phone!, user.user_name, position, user.total_points)}
                    >
                      💬 WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            )
          })}

          {rankings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No hay participantes registrados aún</div>
          )}
        </div>

        {/* Estadísticas de WhatsApp */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">📊 Estadísticas de Notificaciones</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-green-600 font-medium">{rankings.filter((u) => u.user_phone).length}</div>
              <div className="text-green-700">Usuarios con WhatsApp</div>
            </div>
            <div>
              <div className="text-green-600 font-medium">{rankings.filter((u) => !u.user_phone).length}</div>
              <div className="text-green-700">Sin WhatsApp</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
