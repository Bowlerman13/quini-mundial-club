import bcrypt from "bcryptjs"
import { sql } from "./db"

export async function hashPassword(password: string): Promise<string> {
  try {
    console.log("🔐 Iniciando hash de contraseña...")
    const hash = await bcrypt.hash(password, 12)
    console.log("✅ Hash de contraseña completado")
    return hash
  } catch (error) {
    console.error("💥 Error al hacer hash de contraseña:", error)
    throw new Error("Error al procesar la contraseña")
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("💥 Error al verificar contraseña:", error)
    return false
  }
}

export async function createUser(name: string, email: string, phone: string | null, password: string) {
  console.log("👤 Iniciando creación de usuario...")

  if (!sql) {
    console.error("💥 Conexión a base de datos no disponible")
    throw new Error("Database connection not available")
  }

  try {
    console.log("🔐 Hasheando contraseña...")
    const hashedPassword = await hashPassword(password)

    console.log("💾 Insertando usuario en base de datos...")
    console.log("📝 Datos a insertar:", {
      name,
      email,
      phone: phone ? "***" : null,
      hasPassword: !!hashedPassword,
    })

    const result = await sql`
      INSERT INTO users (name, email, phone, password, role)
      VALUES (${name}, ${email}, ${phone}, ${hashedPassword}, 'user')
      RETURNING id, name, email, phone, role, created_at
    `

    if (!result || result.length === 0) {
      console.error("💥 No se pudo insertar el usuario")
      throw new Error("No se pudo crear el usuario")
    }

    console.log("✅ Usuario insertado exitosamente:", { id: result[0].id })
    return result[0]
  } catch (error) {
    console.error("💥 Error en createUser:", error)

    // Manejo específico de errores de PostgreSQL
    if (error instanceof Error) {
      if (error.message.includes("duplicate key value violates unique constraint")) {
        throw new Error("El email ya está registrado")
      }
      if (error.message.includes("null value in column")) {
        throw new Error("Faltan datos requeridos")
      }
      if (error.message.includes("invalid input syntax")) {
        throw new Error("Formato de datos inválido")
      }
    }

    throw error
  }
}

export async function getUserByEmail(email: string) {
  console.log("🔍 Buscando usuario por email...")

  if (!sql) {
    console.error("💥 Conexión a base de datos no disponible")
    throw new Error("Database connection not available")
  }

  try {
    const result = await sql`
      SELECT id, name, email, phone, password, role, created_at
      FROM users
      WHERE email = ${email}
    `

    console.log("✅ Búsqueda completada, usuario encontrado:", !!result[0])
    return result[0] || null
  } catch (error) {
    console.error("💥 Error al buscar usuario:", error)
    throw error
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    console.log("🔐 Iniciando autenticación...")
    const user = await getUserByEmail(email)

    if (!user) {
      console.log("❌ Usuario no encontrado")
      return null
    }

    console.log("🔍 Verificando contraseña...")
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      console.log("❌ Contraseña inválida")
      return null
    }

    console.log("✅ Autenticación exitosa")
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("💥 Error en autenticación:", error)
    throw error
  }
}

export async function isSuperAdmin(userId: number): Promise<boolean> {
  if (!sql) {
    throw new Error("Database connection not available")
  }

  try {
    const result = await sql`
      SELECT role FROM users WHERE id = ${userId}
    `

    return result[0]?.role === "superadmin"
  } catch (error) {
    console.error("💥 Error verificando superadmin:", error)
    return false
  }
}
