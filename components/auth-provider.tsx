"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/auth-context"
import { getSession } from "@/lib/session"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session.user)
    }
    setLoading(false)
  }, [setUser, setLoading])

  return <>{children}</>
}
