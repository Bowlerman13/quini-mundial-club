import bcrypt from "bcryptjs"
import { sql } from "./db"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(name: string, email: string, password: string) {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  const hashedPassword = await hashPassword(password)

  const result = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES (${name}, ${email}, ${hashedPassword}, 'user')
    RETURNING id, name, email, role, created_at
  `

  return result[0]
}

export async function getUserByEmail(email: string) {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  const result = await sql`
    SELECT id, name, email, password, role, created_at
    FROM users
    WHERE email = ${email}
  `

  return result[0] || null
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    return null
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function isSuperAdmin(userId: number): Promise<boolean> {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  const result = await sql`
    SELECT role FROM users WHERE id = ${userId}
  `

  return result[0]?.role === "superadmin"
}
