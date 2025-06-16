import { NextResponse } from "next/server"
import { getUserPredictions } from "@/lib/matches"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = Number.parseInt(params.userId)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 })
    }

    const predictions = await getUserPredictions(userId)
    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Error fetching user predictions:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
