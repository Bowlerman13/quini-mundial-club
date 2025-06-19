import { neon } from "@neondatabase/serverless"

// Only initialize the database connection if we're on the server side
let sql: any = null

if (typeof window === "undefined") {
  if (process.env.DATABASE_URL) {
    try {
      console.log("🔗 Inicializando conexión a base de datos...")
      sql = neon(process.env.DATABASE_URL)
      console.log("✅ Conexión a base de datos inicializada")
    } catch (error) {
      console.error("💥 Error al inicializar conexión a base de datos:", error)
      sql = null
    }
  } else {
    console.warn("⚠️ DATABASE_URL no configurada - funciones de base de datos deshabilitadas")
  }
}

export { sql }

export type User = {
  id: number
  name: string
  email: string
  phone?: string | null
  role: string
  created_at: string
}

export type Team = {
  id: number
  name: string
  country: string
  group_letter: string
}

export type Match = {
  id: number
  team_home_id: number
  team_away_id: number
  match_date: string
  phase: string
  group_letter: string | null
  home_score: number | null
  away_score: number | null
  is_finished: boolean
  home_team?: Team
  away_team?: Team
}

export type Prediction = {
  id: number
  user_id: number
  match_id: number
  home_score_prediction: number
  away_score_prediction: number
  points_earned: number
  created_at: string
  updated_at?: string
  match?: Match
}

export type UserRanking = {
  user_id: number
  user_name: string
  user_phone?: string | null
  total_points: number
  predictions_count: number
}
