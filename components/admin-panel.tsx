"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getTeamLogo } from "@/lib/team-logos"
import type { Match } from "@/lib/db"

export function AdminPanel() {
  const [matches, setMatches] = useState<Match[]>([])
  const [results, setResults] = useState<Record<number, { home: number; away: number }>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const { toast } = useToast()

  useEffect(() => {
    loadMatches()
  }, [])

  // Auto-refresh cada 15 segundos para admin
  useEffect(() => {
    const interval = setInterval(() => {
      loadMatches(true) // Carga silenciosa
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const loadMatches = async (silent = false) => {
    try {
      const response = await fetch("/api/matches", { cache: "no-store" })
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
        setLastUpdate(new Date())

        if (!silent) {
          console.log("✅ Admin: Partidos actualizados:", data.length)
        }
      }
    } catch (error) {
      console.error("Error loading matches:", error)
      if (!silent) {
        toast({
          title: "❌ Error",
          description: "Error al cargar los partidos",
          variant: "destructive",
        })
      }
    }
  }

  const handleResultChange = (matchId: number, type: "home" | "away", value: string) => {
    const numValue = Number.parseInt(value) || 0
    setResults((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [type]: numValue,
      },
    }))
  }

  const saveResult = async (matchId: number) => {
    const result = results[matchId]
    if (!result) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          homeScore: result.home,
          awayScore: result.away,
        }),
      })

      if (response.ok) {
        toast({
          title: "✅ Resultado guardado",
          description: `Resultado ${result.home}-${result.away} guardado a las ${new Date().toLocaleTimeString()}`,
        })

        // ACTUALIZACIÓN AUTOMÁTICA INMEDIATA
        await loadMatches(true) // Reload matches silently
        setLastUpdate(new Date())

        // Limpiar el resultado temporal
        setResults((prev) => {
          const newResults = { ...prev }
          delete newResults[matchId]
          return newResults
        })
      } else {
        const data = await response.json()
        toast({
          title: "❌ Error",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
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
      year: "numeric",
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
      case "quarter_final":
        return "Cuartos de Final"
      case "semi_final":
        return "Semifinales"
      case "third_place":
        return "Tercer Puesto"
      case "final":
        return "Final"
      default:
        return phase
    }
  }

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true
    if (filter === "pending") return !match.is_finished
    if (filter === "finished") return match.is_finished
    return match.phase === filter
  })

  const groupedMatches = filteredMatches.reduce(
    (acc, match) => {
      const key = match.phase === "group" ? `Grupo ${match.group_letter}` : getPhaseLabel(match.phase)
      if (!acc[key]) acc[key] = []
      acc[key].push(match)
      return acc
    },
    {} as Record<string, Match[]>,
  )

  return (
    <div className="space-y-6">
      {/* Header con información de actualización */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">🔑 Panel de Superadministrador</h2>
        <p className="text-muted-foreground">Gestiona los resultados del Mundial de Clubes FIFA 2025</p>
        <div className="mt-2 text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
          🕒 Última sincronización: {lastUpdate.toLocaleTimeString()}
          <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔍 Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              Todos los partidos
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              ⏳ Pendientes
            </Button>
            <Button
              variant={filter === "finished" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("finished")}
            >
              ✅ Finalizados
            </Button>
            <Button variant={filter === "group" ? "default" : "outline"} size="sm" onClick={() => setFilter("group")}>
              🏟️ Fase de Grupos
            </Button>
            <Button
              variant={filter === "round_16" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("round_16")}
            >
              🎯 Octavos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{matches.length}</div>
            <div className="text-sm text-muted-foreground">Total partidos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{matches.filter((m) => m.is_finished).length}</div>
            <div className="text-sm text-muted-foreground">Finalizados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{matches.filter((m) => !m.is_finished).length}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(groupedMatches).length}</div>
            <div className="text-sm text-muted-foreground">Fases/Grupos</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de partidos con actualización automática */}
      <div className="space-y-4">
        {Object.entries(groupedMatches).map(([groupName, groupMatches]) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{groupName}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {groupMatches.filter((m) => m.is_finished).length}/{groupMatches.length} finalizados
                  </Badge>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    title="Actualización automática activa"
                  ></div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupMatches.map((match) => {
                const currentResult = results[match.id] || { home: match.home_score || 0, away: match.away_score || 0 }

                return (
                  <div
                    key={match.id}
                    className={`border rounded-lg p-4 space-y-3 transition-all duration-300 ${
                      match.is_finished
                        ? "bg-green-50 border-green-200 shadow-sm"
                        : "bg-yellow-50 border-yellow-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">📅 {formatDate(match.match_date)}</div>
                      {match.is_finished && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✅ Finalizado: {match.home_score} - {match.away_score}
                        </Badge>
                      )}
                      {!match.is_finished && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          ⏳ Pendiente
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-center flex flex-col items-center">
                        <div className="w-16 h-16 mb-2">
                          <img
                            src={getTeamLogo(match.home_team?.name || "")}
                            alt={match.home_team?.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="font-medium">{match.home_team?.name}</div>
                        <div className="text-sm text-muted-foreground">🏴 {match.home_team?.country}</div>
                      </div>

                      {/* Selectores de goles para admin */}
                      <div className="flex justify-center items-center space-x-4">
                        <div className="flex flex-col items-center space-y-1">
                          <Label className="text-xs font-semibold">Local</Label>
                          <div className="flex items-center space-x-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-sm"
                              onClick={() =>
                                handleResultChange(match.id, "home", String(Math.max(0, currentResult.home - 1)))
                              }
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              className="w-16 text-center font-bold"
                              value={currentResult.home}
                              onChange={(e) => handleResultChange(match.id, "home", e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-sm"
                              onClick={() =>
                                handleResultChange(match.id, "home", String(Math.min(20, currentResult.home + 1)))
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        <div className="text-xl font-bold">-</div>

                        <div className="flex flex-col items-center space-y-1">
                          <Label className="text-xs font-semibold">Visitante</Label>
                          <div className="flex items-center space-x-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-sm"
                              onClick={() =>
                                handleResultChange(match.id, "away", String(Math.max(0, currentResult.away - 1)))
                              }
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              className="w-16 text-center font-bold"
                              value={currentResult.away}
                              onChange={(e) => handleResultChange(match.id, "away", e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-sm"
                              onClick={() =>
                                handleResultChange(match.id, "away", String(Math.min(20, currentResult.away + 1)))
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 text-center flex flex-col items-center">
                        <div className="w-16 h-16 mb-2">
                          <img
                            src={getTeamLogo(match.away_team?.name || "")}
                            alt={match.away_team?.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="font-medium">{match.away_team?.name}</div>
                        <div className="text-sm text-muted-foreground">🏴 {match.away_team?.country}</div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => saveResult(match.id)}
                        disabled={isLoading}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Guardando...
                          </div>
                        ) : (
                          <>💾 {match.is_finished ? "🔄 Actualizar Resultado" : "✅ Guardar Resultado"}</>
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">No hay partidos que coincidan con el filtro seleccionado</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
