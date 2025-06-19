import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Iniciando proceso de registro...")

    const body = await request.json()
    console.log("📝 Datos recibidos:", {
      name: body.name,
      email: body.email,
      phone: body.phone ? "***" : null,
      hasPassword: !!body.password,
    })

    const { name, email, phone, password } = body

    // Validaciones básicas
    if (!name || !email || !password) {
      console.log("❌ Faltan campos requeridos")
      return NextResponse.json({ error: "Nombre, email y contraseña son requeridos" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Formato de email inválido:", email)
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
    }

    // Validar formato de teléfono si se proporciona
    if (phone) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      const cleanPhone = phone.replace(/[\s\-()]/g, "")
      if (!phoneRegex.test(cleanPhone)) {
        console.log("❌ Formato de teléfono inválido:", phone)
        return NextResponse.json(
          { error: "Formato de teléfono inválido. Usa formato internacional: +1234567890" },
          { status: 400 },
        )
      }
    }

    console.log("✅ Validaciones básicas pasadas")

    // Check if user already exists
    console.log("🔍 Verificando si el usuario ya existe...")
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      console.log("❌ Usuario ya existe:", email)
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    console.log("✅ Usuario no existe, procediendo a crear...")

    // Crear usuario
    const user = await createUser(name, email, phone || null, password)

    console.log("✅ Usuario creado exitosamente:", { id: user.id, email: user.email })

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("💥 Error completo en registro:", error)
    console.error("📍 Stack trace:", error instanceof Error ? error.stack : "No stack available")

    // Manejo específico de errores de base de datos
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
      }
      if (error.message.includes("Database connection not available")) {
        return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
      }
      if (error.message.includes("invalid input syntax")) {
        return NextResponse.json({ error: "Datos inválidos proporcionados" }, { status: 400 })
      }
    }

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 },
    )
  }
}
