import { NextResponse } from "next/server"
import { getMatches } from "@/lib/matches"

export async function GET() {
  try {
    const matches = await getMatches()
    return NextResponse.json(matches)
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
