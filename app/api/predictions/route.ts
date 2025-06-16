import { type NextRequest, NextResponse } from "next/server"
import { savePrediction } from "@/lib/matches"

export async function POST(request: NextRequest) {
  try {
    const { userId, matchId, homeScore, awayScore } = await request.json()

    if (!userId || !matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const prediction = await savePrediction(userId, matchId, homeScore, awayScore)

    return NextResponse.json({
      message: "Pronóstico guardado exitosamente",
      prediction,
    })
  } catch (error) {
    console.error("Error saving prediction:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
