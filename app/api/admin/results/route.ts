import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { calculatePoints } from "@/lib/matches"

export async function POST(request: NextRequest) {
  try {
    const { matchId, homeScore, awayScore, userId } = await request.json()

    if (!matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (!sql) {
      throw new Error("Database connection not available")
    }

    // Verificar que el usuario sea superadmin (opcional, para mayor seguridad)
    if (userId) {
      const userResult = await sql`
        SELECT role FROM users WHERE id = ${userId}
      `

      if (!userResult[0] || userResult[0].role !== "superadmin") {
        return NextResponse.json({ error: "No tienes permisos para realizar esta acción" }, { status: 403 })
      }
    }

    // Update match result
    await sql`
      UPDATE matches
      SET home_score = ${homeScore}, away_score = ${awayScore}, is_finished = true
      WHERE id = ${matchId}
    `

    // Calculate points for all predictions
    await calculatePoints(matchId)

    return NextResponse.json({
      message: "Resultado actualizado exitosamente",
    })
  } catch (error) {
    console.error("Error updating match result:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
