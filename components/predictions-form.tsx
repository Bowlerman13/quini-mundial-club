"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getTeamLogo } from "@/lib/team-logos"
import { MobileScorePicker } from "./mobile-score-picker"
import type { Match, Prediction } from "@/lib/db"

interface PredictionsFormProps {
  user: any
}

export function PredictionsForm({ user }: PredictionsFormProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<Record<number, { home: number; away: number }>>({})
  const [userPredictions, setUserPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>("A")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [user.id])

  const loadData = async () => {
    try {
      const [matchesResponse, predictionsResponse] = await Promise.all([
        fetch("/api/matches"),
        fetch(`/api/predictions/${user.id}`),
      ])

      if (matchesResponse.ok && predictionsResponse.ok) {
        const matchesData = await matchesResponse.json()
        const predictionsData = await predictionsResponse.json()

        setMatches(matchesData)
        setUserPredictions(predictionsData)

        // Pre-fill existing predictions
        const existingPredictions: Record<number, { home: number; away: number }> = {}

        // Inicializar TODOS los partidos con 0-0
        matchesData.forEach((match: Match) => {
          existingPredictions[match.id] = { home: 0, away: 0 }
        })

        // Sobrescribir con predicciones existentes
        predictionsData.forEach((pred: any) => {
          existingPredictions[pred.match_id] = {
            home: pred.home_score_prediction || 0,
            away: pred.away_score_prediction || 0,
          }
        })

        setPredictions(existingPredictions)
        console.log("Datos cargados:", {
          matchesData: matchesData.length,
          predictionsData: predictionsData.length,
          existingPredictions,
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  // FUNCIÓN PARA CAMBIOS INMEDIATOS EN UI (sin guardar)
  const handlePredictionChange = (matchId: number, type: "home" | "away", value: number) => {
    console.log(`Cambiando ${type} del partido ${matchId} de ${predictions[matchId]?.[type] || 0} a ${value}`)

    setPredictions((prev) => {
      const currentPrediction = prev[matchId] || { home: 0, away: 0 }
      const newPrediction = {
        ...currentPrediction,
        [type]: value,
      }

      console.log(`Estado actualizado para partido ${matchId}:`, newPrediction)

      return {
        ...prev,
        [matchId]: newPrediction,
      }
    })
  }

  // FUNCIÓN PARA GUARDAR EN BASE DE DATOS
  const savePrediction = async (matchId: number) => {
    const prediction = predictions[matchId]
    if (!prediction) {
      toast({
        title: "❌ Error",
        description: "No se encontró la predicción",
        variant: "destructive",
      })
      return
    }

    console.log(`Guardando predicción para partido ${matchId}:`, prediction)

    setIsLoading(true)
    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          matchId,
          homeScore: prediction.home,
          awayScore: prediction.away,
        }),
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log("Respuesta del servidor:", responseData)

        toast({
          title: "✅ Pronóstico guardado",
          description: `Guardado: ${prediction.home} - ${prediction.away}`,
        })

        // RECARGAR DATOS SIN RESETEAR EL ESTADO LOCAL
        const [matchesResponse, predictionsResponse] = await Promise.all([
          fetch("/api/matches"),
          fetch(`/api/predictions/${user.id}`),
        ])

        if (matchesResponse.ok && predictionsResponse.ok) {
          const matchesData = await matchesResponse.json()
          const predictionsData = await predictionsResponse.json()

          setMatches(matchesData)
          setUserPredictions(predictionsData)

          // MANTENER LOS VALORES ACTUALES EN LA UI
          // Solo actualizar si hay cambios desde el servidor
          const serverPrediction = predictionsData.find((p: any) => p.match_id === matchId)
          if (serverPrediction) {
            setPredictions((prev) => ({
              ...prev,
              [matchId]: {
                home: serverPrediction.home_score_prediction || 0,
                away: serverPrediction.away_score_prediction || 0,
              },
            }))
            console.log(`Predicción actualizada desde servidor para partido ${matchId}:`, {
              home: serverPrediction.home_score_prediction,
              away: serverPrediction.away_score_prediction,
            })
          }
        }
      } else {
        const data = await response.json()
        toast({
          title: "❌ Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving prediction:", error)
      toast({
        title: "❌ Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "group":
        return "Fase de Grupos"
      case "round_16":
        return "Octavos de Final"
      default:
        return phase
    }
  }

  const groupedMatches = matches.reduce(
    (acc, match) => {
      const key = match.phase === "group" ? match.group_letter || "X" : getPhaseLabel(match.phase)
      if (!acc[key]) acc[key] = []
      acc[key].push(match)
      return acc
    },
    {} as Record<string, Match[]>,
  )

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

  // Obtener grupos disponibles
  const availableGroups = Object.keys(groupedMatches)
    .filter((key) => key.length === 1)
    .sort()

  return (
    <div className="space-y-4 pb-20 px-2">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-yellow-600">⚽ Mis Pronósticos</h2>
        <p className="text-sm text-gray-600 mt-2">Toca los botones + y - para predecir, luego presiona GUARDAR</p>
      </div>

      {/* Selector de grupos - Sticky para móvil */}
      <div className="sticky top-0 z-20 bg-white shadow-lg rounded-lg p-3 mb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {availableGroups.map((group) => (
            <Button
              key={group}
              variant={selectedGroup === group ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGroup(group)}
              className={`text-sm font-bold ${
                selectedGroup === group
                  ? "bg-yellow-600 text-white"
                  : "border-yellow-600 text-yellow-600 hover:bg-yellow-50"
              }`}
            >
              Grupo {group}
            </Button>
          ))}
          {Object.keys(groupedMatches)
            .filter((key) => key.length > 1)
            .map((phase) => (
              <Button
                key={phase}
                variant={selectedGroup === phase ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGroup(phase)}
                className={`text-xs ${
                  selectedGroup === phase
                    ? "bg-yellow-600 text-white"
                    : "border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                }`}
              >
                {phase}
              </Button>
            ))}
        </div>
      </div>

      {/* Mostrar solo el grupo seleccionado */}
      {groupedMatches[selectedGroup] && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedGroup.length === 1 ? `🏆 Grupo ${selectedGroup}` : `🏆 ${selectedGroup}`}
            </h3>
          </div>

          {groupedMatches[selectedGroup].map((match) => {
            const existingPrediction = userPredictions.find((p) => p.match_id === match.id)
            const currentPrediction = predictions[match.id] || { home: 0, away: 0 }
            const isMatchFinished = match.is_finished

            return (
              <Card
                key={match.id}
                className={`border-2 shadow-lg ${isMatchFinished ? "border-gray-300 bg-gray-50" : "border-yellow-200"}`}
              >
                <CardContent className="p-4">
                  {/* Fecha y estado del partido */}
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600 mb-2">📅 {formatDate(match.match_date)}</div>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {isMatchFinished && (
                        <Badge className="bg-red-100 text-red-800 border-red-300">
                          🔒 FINALIZADO: {match.home_score} - {match.away_score}
                        </Badge>
                      )}
                      {existingPrediction && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          ⭐ {existingPrediction.points_earned} puntos
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Equipos y logos */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2">
                        <img
                          src={getTeamLogo(match.home_team?.name || "")}
                          alt={match.home_team?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="font-bold text-sm">{match.home_team?.name}</div>
                      <div className="text-xs text-gray-500">🏴 {match.home_team?.country}</div>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2">
                        <img
                          src={getTeamLogo(match.away_team?.name || "")}
                          alt={match.away_team?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="font-bold text-sm">{match.away_team?.name}</div>
                      <div className="text-xs text-gray-500">🏴 {match.away_team?.country}</div>
                    </div>
                  </div>

                  {/* DEBUG INFO - MEJORADO */}
                  <div
                    className={`text-center mb-4 p-3 rounded text-sm border-2 ${
                      isMatchFinished
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                    }`}
                  >
                    <div className="font-bold mb-1">🔍 DEBUG - Estado Actual:</div>
                    <div>
                      <strong>Tu Pronóstico:</strong> {currentPrediction.home} - {currentPrediction.away}
                    </div>
                    {isMatchFinished && (
                      <div className="mt-1">
                        <strong>Resultado Real:</strong> {match.home_score} - {match.away_score}
                      </div>
                    )}
                    {existingPrediction && (
                      <div className="mt-1">
                        <strong>En BD:</strong> {existingPrediction.home_score_prediction} -{" "}
                        {existingPrediction.away_score_prediction}
                      </div>
                    )}
                  </div>

                  {/* Selectores de goles */}
                  <div className="flex justify-center items-center gap-8 mb-6">
                    <MobileScorePicker
                      value={currentPrediction.home}
                      onChange={(value) => handlePredictionChange(match.id, "home", value)}
                      disabled={isMatchFinished}
                      label="LOCAL"
                      teamName={match.home_team?.name || ""}
                    />

                    <div className="text-4xl font-bold text-gray-400 self-center">VS</div>

                    <MobileScorePicker
                      value={currentPrediction.away}
                      onChange={(value) => handlePredictionChange(match.id, "away", value)}
                      disabled={isMatchFinished}
                      label="VISITANTE"
                      teamName={match.away_team?.name || ""}
                    />
                  </div>

                  {/* BOTÓN GUARDAR - MANTENIDO */}
                  {!isMatchFinished && (
                    <div className="text-center">
                      <Button
                        onClick={() => savePrediction(match.id)}
                        disabled={isLoading}
                        className="w-full max-w-xs bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 text-lg"
                      >
                        💾 {existingPrediction ? "ACTUALIZAR" : "GUARDAR"} PRONÓSTICO
                        <br />
                        <span className="text-sm">
                          ({currentPrediction.home} - {currentPrediction.away})
                        </span>
                      </Button>
                    </div>
                  )}

                  {existingPrediction && (
                    <div className="text-xs text-center text-gray-500 mt-3">
                      📅 Última actualización: {formatPredictionDate(existingPrediction.created_at)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Mensaje si no hay partidos */}
      {!groupedMatches[selectedGroup] && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">No hay partidos disponibles para este grupo</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
