const SESSION_KEY = "hisab360_session"

export interface Session {
  user: {
    id: string
    email: string
    name: string
  }
  token: string
}

export function setSession(session: Session) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
}

export function getSession(): Session | null {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem(SESSION_KEY)
    return session ? JSON.parse(session) : null
  }
  return null
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY)
  }
}
