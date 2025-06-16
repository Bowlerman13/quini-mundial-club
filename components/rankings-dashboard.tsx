"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
        <CardDescription>Puntuación: 3 puntos por marcador exacto, 1 punto por resultado correcto</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.map((user, index) => {
            const position = index + 1
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
                    <div className="font-medium">{user.user_name}</div>
                    <div className="text-sm text-muted-foreground">{user.predictions_count} pronósticos</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getRankBadgeVariant(position)}>{user.total_points} puntos</Badge>
                  {position <= 3 && (
                    <Badge variant="outline" className="text-xs">
                      Top {position}
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}

          {rankings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No hay participantes registrados aún</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}