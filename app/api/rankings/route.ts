import { NextResponse } from "next/server"
import { getRankings } from "@/lib/matches"

export async function GET() {
  try {
    const rankings = await getRankings()

    return NextResponse.json(rankings)
  } catch (error) {
    console.error("Error fetching rankings:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
