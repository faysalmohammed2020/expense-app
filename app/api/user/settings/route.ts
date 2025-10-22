import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { darkMode, emailNotifications, twoFactorEnabled } = await request.json()

    const settings = await prisma.userSettings.update({
      where: { userId },
      data: {
        ...(darkMode !== undefined && { darkMode }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(twoFactorEnabled !== undefined && { twoFactorEnabled }),
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
