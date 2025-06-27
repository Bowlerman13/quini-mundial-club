import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-yellow-600 to-amber-600 text-white">
            <CardTitle className="text-3xl flex items-center justify-center gap-3">
              <span className="text-4xl">🏆</span>
              Sobre Nuestra Quiniela
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 ¿Qué es esta aplicación?</h2>
              <p className="text-gray-600 leading-relaxed">
                Esta es una aplicación web <strong>completamente legítima y segura</strong> para realizar pronósticos
                deportivos del Mundial de Clubes 2025. No es un sitio de apuestas con dinero real, sino una plataforma
                de entretenimiento donde los usuarios pueden predecir resultados y competir por puntos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🔒 Seguridad y Privacidad</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>No manejamos dinero real</strong> - Solo puntos virtuales
                </li>
                <li>
                  <strong>Datos encriptados</strong> - Todas las contraseñas están hasheadas
                </li>
                <li>
                  <strong>No spam</strong> - Solo enviamos notificaciones de resultados si lo solicitas
                </li>
                <li>
                  <strong>Código abierto</strong> - Puedes revisar nuestro código en GitHub
                </li>
                <li>
                  <strong>Sin publicidad maliciosa</strong> - Sitio limpio y seguro
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⚽ Cómo Funciona</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800">1. Registro Gratuito</h3>
                  <p className="text-blue-600 text-sm">Crea tu cuenta con email y contraseña</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800">2. Haz Pronósticos</h3>
                  <p className="text-green-600 text-sm">Predice los resultados de los 64 partidos</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-bold text-yellow-800">3. Gana Puntos</h3>
                  <p className="text-yellow-600 text-sm">3 puntos por marcador exacto, 1 por resultado</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-800">4. Compite</h3>
                  <p className="text-purple-600 text-sm">Ve tu posición en la clasificación general</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📞 Contacto</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Email:</strong> admin@quiniela.com
                </p>
                <p>
                  <strong>Propósito:</strong> Entretenimiento deportivo
                </p>
                <p>
                  <strong>Tipo:</strong> Aplicación web gratuita
                </p>
                <p>
                  <strong>Contenido:</strong> Pronósticos deportivos sin dinero real
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🛡️ Declaración de Legitimidad</h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-800 font-medium">
                  Esta aplicación es completamente legítima y segura. No es un sitio de phishing, no roba información
                  personal, y no contiene malware. Es simplemente una plataforma de entretenimiento para fanáticos del
                  fútbol que quieren predecir resultados del Mundial de Clubes 2025.
                </p>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                <span className="text-3xl">🏆</span>
                Mundial de Clubes 2025
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">32</div>
                  <div className="text-sm text-gray-600">Equipos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">64</div>
                  <div className="text-sm text-gray-600">Partidos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <div className="text-sm text-gray-600">Ciudades</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">29</div>
                  <div className="text-sm text-gray-600">Días</div>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
