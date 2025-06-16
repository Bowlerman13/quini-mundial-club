"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTeamLogo } from "@/lib/team-logos"
import type { Prediction } from "@/lib/db"

interface PredictionHistoryProps {
  userId: number
}

export function PredictionHistory({ userId }: PredictionHistoryProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPredictions()
  }, [userId])

  const loadPredictions = async () => {
    try {
      const response = await fetch(`/api/predictions/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setPredictions(data)
      }
    } catch (error) {
      console.error("Error loading predictions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPredictionDate = (dateString: string) => {
    if (!dateString) return ""

    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }

    return new Date(dateString).toLocaleString("es-ES", options) + " (PT)"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pronósticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Cargando historial...</div>
        </CardContent>
      </Card>
    )
  }

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pronósticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">No has realizado pronósticos aún</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📜</span>
          Historial de Pronósticos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-muted-foreground">
                  Pronóstico realizado: {formatPredictionDate(prediction.created_at)}
                </div>
                <Badge variant={prediction.match?.is_finished ? "secondary" : "outline"}>
                  {prediction.match?.is_finished ? "Finalizado" : "Pendiente"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 mx-auto mb-1">
                    <img
                      src={getTeamLogo(prediction.match?.home_team?.name || "")}
                      alt={prediction.match?.home_team?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-medium text-sm">{prediction.match?.home_team?.name}</div>
                </div>

                <div className="flex flex-col items-center mx-4">
                  <div className="text-xs text-muted-foreground mb-1">Tu pronóstico</div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{prediction.home_score_prediction}</span>
                    <span className="mx-1">-</span>
                    <span className="text-lg font-bold">{prediction.away_score_prediction}</span>
                  </div>
                  {prediction.match?.is_finished && (
                    <>
                      <div className="text-xs text-muted-foreground mt-2 mb-1">Resultado final</div>
                      <div className="flex items-center">
                        <span className="text-sm">{prediction.match.home_score}</span>
                        <span className="mx-1">-</span>
                        <span className="text-sm">{prediction.match.away_score}</span>
                      </div>
                      <Badge className="mt-2" variant={prediction.points_earned > 0 ? "default" : "outline"}>
                        {prediction.points_earned} puntos
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex-1 text-center">
                  <div className="w-12 h-12 mx-auto mb-1">
                    <img
                      src={getTeamLogo(prediction.match?.away_team?.name || "")}
                      alt={prediction.match?.away_team?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-medium text-sm">{prediction.match?.away_team?.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}