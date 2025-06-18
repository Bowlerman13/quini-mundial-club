import { sql } from "./db"
import type { Match, Prediction } from "./db"

// Función para formatear fechas con MÁXIMO DETALLE (incluyendo microsegundos)
export function formatDetailedTimestamp(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3, // Mostrar milisegundos
  }

  const dateObj = new Date(date)
  const formatted = dateObj.toLocaleString("es-ES", options)

  // Agregar información adicional
  const dayName = dateObj.toLocaleDateString("es-ES", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
  })

  return `${dayName}, ${formatted} (Hora del Pacífico)`
}

// Función para formatear fechas en zona horaria del Pacífico (versión corta)
export function formatToPacificTime(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }

  return new Date(date).toLocaleString("es-ES", options) + " (Hora del Pacífico)"
}

// Add server-side check for all functions
export async function getMatches(): Promise<Match[]> {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  const result = await sql`
    SELECT 
      m.*,
      th.name as home_team_name,
      th.country as home_team_country,
      ta.name as away_team_name,
      ta.country as away_team_country
    FROM matches m
    JOIN teams th ON m.team_home_id = th.id
    JOIN teams ta ON m.team_away_id = ta.id
    ORDER BY m.match_date ASC
  `

  return result.map((row: any) => ({
    id: row.id,
    team_home_id: row.team_home_id,
    team_away_id: row.team_away_id,
    match_date: row.match_date,
    phase: row.phase,
    group_letter: row.group_letter,
    home_score: row.home_score,
    away_score: row.away_score,
    is_finished: row.is_finished,
    home_team: {
      id: row.team_home_id,
      name: row.home_team_name,
      country: row.home_team_country,
      group_letter: row.group_letter || "",
    },
    away_team: {
      id: row.team_away_id,
      name: row.away_team_name,
      country: row.away_team_country,
      group_letter: row.group_letter || "",
    },
  }))
}

export async function getUserPredictions(userId: number): Promise<Prediction[]> {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  const result = await sql`
    SELECT p.*, 
           m.match_date, m.phase, m.group_letter,
           th.name as home_team_name,
           ta.name as away_team_name,
           m.home_score, m.away_score, m.is_finished
    FROM predictions p
    JOIN matches m ON p.match_id = m.id
    JOIN teams th ON m.team_home_id = th.id
    JOIN teams ta ON m.team_away_id = ta.id
    WHERE p.user_id = ${userId}
    ORDER BY m.match_date ASC
  `

  return result.map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    match_id: row.match_id,
    home_score_prediction: row.home_score_prediction,
    away_score_prediction: row.away_score_prediction,
    points_earned: row.points_earned,
    created_at: row.created_at,
    updated_at: row.updated_at,
    match: {
      id: row.match_id,
      team_home_id: 0,
      team_away_id: 0,
      match_date: row.match_date,
      phase: row.phase,
      group_letter: row.group_letter,
      home_score: row.home_score,
      away_score: row.away_score,
      is_finished: row.is_finished,
      home_team: {
        id: 0,
        name: row.home_team_name,
        country: "",
        group_letter: row.group_letter || "",
      },
      away_team: {
        id: 0,
        name: row.away_team_name,
        country: "",
        group_letter: row.group_letter || "",
      },
    },
  }))
}

export async function savePrediction(userId: number, matchId: number, homeScore: number, awayScore: number) {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  // Usar CURRENT_TIMESTAMP(6) para máxima precisión con microsegundos
  const result = await sql`
    INSERT INTO predictions (user_id, match_id, home_score_prediction, away_score_prediction, created_at, updated_at)
    VALUES (
      ${userId}, 
      ${matchId}, 
      ${homeScore}, 
      ${awayScore}, 
      CURRENT_TIMESTAMP(6) AT TIME ZONE 'America/Los_Angeles',
      CURRENT_TIMESTAMP(6) AT TIME ZONE 'America/Los_Angeles'
    )
    ON CONFLICT (user_id, match_id)
    DO UPDATE SET 
      home_score_prediction = ${homeScore},
      away_score_prediction = ${awayScore},
      updated_at = CURRENT_TIMESTAMP(6) AT TIME ZONE 'America/Los_Angeles'
    RETURNING *
  `

  return result[0]
}

export async function calculatePoints(matchId: number) {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  // Get match result
  const matchResult = await sql`
    SELECT home_score, away_score
    FROM matches
    WHERE id = ${matchId} AND is_finished = true
  `

  if (matchResult.length === 0) {
    return
  }

  const { home_score, away_score } = matchResult[0]

  // Get all predictions for this match
  const predictions = await sql`
    SELECT id, user_id, home_score_prediction, away_score_prediction
    FROM predictions
    WHERE match_id = ${matchId}
  `

  // Calculate points for each prediction
  for (const prediction of predictions) {
    let points = 0

    // Check if exact score (3 points)
    if (prediction.home_score_prediction === home_score && prediction.away_score_prediction === away_score) {
      points = 3
    }
    // Check if correct result (1 point)
    else {
      const actualResult = home_score > away_score ? "home" : away_score > home_score ? "away" : "draw"
      const predictedResult =
        prediction.home_score_prediction > prediction.away_score_prediction
          ? "home"
          : prediction.away_score_prediction > prediction.home_score_prediction
            ? "away"
            : "draw"

      if (actualResult === predictedResult) {
        points = 1
      }
    }

    // Update points
    await sql`
      UPDATE predictions
      SET points_earned = ${points}
      WHERE id = ${prediction.id}
    `
  }
}

export async function getRankings() {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  const result = await sql`
    SELECT 
      u.id as user_id,
      u.name as user_name,
      u.phone as user_phone,
      COALESCE(SUM(p.points_earned), 0) as total_points,
      COUNT(p.id) as predictions_count
    FROM users u
    LEFT JOIN predictions p ON u.id = p.user_id
    GROUP BY u.id, u.name, u.phone
    ORDER BY total_points DESC, predictions_count DESC
  `

  return result
}

// Nueva función para obtener usuarios con WhatsApp para notificaciones
export async function getUsersWithWhatsApp() {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  const result = await sql`
    SELECT id, name, email, phone
    FROM users
    WHERE phone IS NOT NULL AND phone != ''
    ORDER BY name
  `

  return result
}
