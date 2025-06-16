"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PredictionsForm } from "./predictions-form"
import { RankingsDashboard } from "./rankings-dashboard"
import { AdminPanel } from "./admin-panel"

interface MainDashboardProps {
  user: any
  onLogout: () => void
}

export function MainDashboard({ user, onLogout }: MainDashboardProps) {
  const isSuperAdmin = user.role === "superadmin"

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h1 className="text-xl font-bold text-gray-900">Mundial de Clubes 2025</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-lg">👤</span>
                <span>{user.name}</span>
                {isSuperAdmin && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                    🔑 ADMIN
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <span className="mr-2">🚪</span>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isSuperAdmin ? "🔑 Panel de Superadministrador" : "¡Bienvenido a la Quiniela!"}
              </CardTitle>
              <CardDescription className="text-yellow-100">
                {isSuperAdmin
                  ? "Gestiona los resultados del Mundial de Clubes FIFA 2025 y supervisa la competencia"
                  : "Predice los resultados del Mundial de Clubes FIFA 2025 y compite con otros usuarios"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
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
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={isSuperAdmin ? "admin" : "predictions"} className="space-y-6">
          <TabsList className={`grid w-full ${isSuperAdmin ? "grid-cols-3" : "grid-cols-2"}`}>
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
              <PredictionsForm user={user} />
            </TabsContent>
          )}

          <TabsContent value="rankings">
            <RankingsDashboard />
          </TabsContent>

          {isSuperAdmin && (
            <>
              <TabsContent value="predictions">
                <PredictionsForm user={user} />
              </TabsContent>
              <TabsContent value="admin">
                <AdminPanel />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}