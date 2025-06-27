"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PredictionsForm } from "./predictions-form"
import { RankingsDashboard } from "./rankings-dashboard"
import { AdminPanel } from "./admin-panel"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect, useCallback } from "react"

interface MainDashboardProps {
  user: any
  onLogout: () => void
}

// Hook integrado para pull-to-refresh SIMPLIFICADO
function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
}: {
  onRefresh: () => Promise<void>
  threshold?: number
  resistance?: number
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return

      const currentY = e.touches[0].clientY
      const distance = Math.max(0, (currentY - startY) / resistance)

      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    },
    [isPulling, isRefreshing, startY, threshold, resistance],
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return

    setIsPulling(false)

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error("Error during refresh:", error)
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh])

  useEffect(() => {
    const handleTouchStartPassive = (e: TouchEvent) => handleTouchStart(e)
    const handleTouchMovePassive = (e: TouchEvent) => handleTouchMove(e)
    const handleTouchEndPassive = () => handleTouchEnd()

    document.addEventListener("touchstart", handleTouchStartPassive, { passive: true })
    document.addEventListener("touchmove", handleTouchMovePassive, { passive: false })
    document.addEventListener("touchend", handleTouchEndPassive, { passive: true })

    return () => {
      document.removeEventListener("touchstart", handleTouchStartPassive)
      document.removeEventListener("touchmove", handleTouchMovePassive)
      document.removeEventListener("touchend", handleTouchEndPassive)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    isRefreshing,
    pullDistance,
    isPulling: isPulling && pullDistance > 0,
    refreshProgress: Math.min(pullDistance / threshold, 1),
  }
}

// Componente integrado para el indicador
function PullToRefreshIndicator({
  isVisible,
  pullDistance,
  isRefreshing,
  progress,
}: {
  isVisible: boolean
  pullDistance: number
  isRefreshing: boolean
  progress: number
}) {
  if (!isVisible && !isRefreshing) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center bg-gradient-to-b from-yellow-500 to-amber-500 text-white transition-all duration-200 ease-out shadow-lg"
      style={{
        height: isRefreshing ? "70px" : `${Math.min(pullDistance, 70)}px`,
        transform: isRefreshing ? "translateY(0)" : `translateY(${Math.min(pullDistance - 70, 0)}px)`,
      }}
    >
      <div className="flex items-center gap-3 px-4">
        {isRefreshing ? (
          <>
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="font-semibold text-sm">🔄 Actualizando datos...</span>
          </>
        ) : (
          <>
            <div
              className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center transition-transform duration-200"
              style={{
                transform: `rotate(${progress * 180}deg)`,
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="font-semibold text-sm">
              {progress >= 1 ? "🚀 Suelta para actualizar" : "⬇️ Desliza para actualizar"}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export function MainDashboard({ user, onLogout }: MainDashboardProps) {
  const isSuperAdmin = user.role === "superadmin"
  const [refreshKey, setRefreshKey] = useState(0)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const { toast } = useToast()

  // Pull to refresh functionality (solo para móvil)
  const { isRefreshing, pullDistance, isPulling, refreshProgress } = usePullToRefresh({
    onRefresh: async () => {
      // Simular actualización de datos
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Forzar re-render de componentes
      setRefreshKey((prev) => prev + 1)
      setLastRefresh(new Date())

      // Mostrar notificación
      toast({
        title: "✅ Actualizado",
        description: `Datos actualizados a las ${new Date().toLocaleTimeString()}`,
      })
    },
    threshold: 80,
    resistance: 2.5,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Pull to Refresh Indicator */}
      <PullToRefreshIndicator
        isVisible={isPulling}
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        progress={refreshProgress}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Icono de balón de fútbol */}
              <div className="w-10 h-10 flex items-center justify-center bg-yellow-600 rounded-full">
                <span className="text-2xl">⚽</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mundial de Clubes 2025</h1>
                <p className="text-xs text-gray-500">Torneo Internacional de Clubes</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Indicador simplificado */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Actualización manual</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-lg">👤</span>
                <span className="hidden sm:inline">{user.name}</span>
                {user.phone && (
                  <span className="text-green-600" title="WhatsApp disponible">
                    📱
                  </span>
                )}
                {isSuperAdmin && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                    🔑 ADMIN
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <span className="mr-2">🚪</span>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{ paddingTop: isRefreshing ? "90px" : "32px" }}
      >
        {/* Instrucciones de Pull to Refresh para móvil */}
        <div className="sm:hidden mb-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <span>📱</span>
                <span>Desliza hacia abajo desde la parte superior para actualizar</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                {/* Trofeo en lugar del logo */}
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full">
                  <span className="text-3xl">🏆</span>
                </div>
                {isSuperAdmin ? "🔑 Panel de Superadministrador" : "¡Bienvenido a la Quiniela!"}
              </CardTitle>
              <CardDescription className="text-yellow-100">
                {isSuperAdmin
                  ? "Gestiona los resultados del Mundial de Clubes 2025 y supervisa la competencia"
                  : "Predice los resultados del Mundial de Clubes 2025 y compite con otros usuarios"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-yellow-100">Puntos por marcador exacto</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm text-yellow-100">Punto por resultado correcto</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-2xl font-bold">64</div>
                  <div className="text-sm text-yellow-100">Partidos para pronosticar</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-2xl font-bold">32</div>
                  <div className="text-sm text-yellow-100">Equipos participantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={isSuperAdmin ? "admin" : "predictions"} className="space-y-6">
          <TabsList
            className={`grid w-full ${isSuperAdmin ? "grid-cols-3" : "grid-cols-2"} sticky top-20 z-40 bg-white shadow-md`}
          >
            {!isSuperAdmin && (
              <TabsTrigger value="predictions" className="flex items-center gap-2">
                <span>🎯</span>
                Mis Pronósticos
              </TabsTrigger>
            )}
            <TabsTrigger value="rankings" className="flex items-center gap-2">
              <span>🏆</span>
              Clasificación
            </TabsTrigger>
            {isSuperAdmin && (
              <>
                <TabsTrigger value="predictions" className="flex items-center gap-2">
                  <span>🎯</span>
                  Ver Pronósticos
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <span>⚙️</span>
                  Gestionar Resultados
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {!isSuperAdmin && (
            <TabsContent value="predictions">
              <PredictionsForm key={refreshKey} user={user} refreshKey={refreshKey} />
            </TabsContent>
          )}

          <TabsContent value="rankings">
            <RankingsDashboard key={refreshKey} />
          </TabsContent>

          {isSuperAdmin && (
            <>
              <TabsContent value="predictions">
                <PredictionsForm key={refreshKey} user={user} refreshKey={refreshKey} />
              </TabsContent>
              <TabsContent value="admin">
                <AdminPanel key={refreshKey} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}
