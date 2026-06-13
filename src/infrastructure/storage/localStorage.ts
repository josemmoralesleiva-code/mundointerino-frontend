import type { AuthUser } from '../dto/auth.dto'

const KEYS = {
  token: 'token',
  usuario: 'usuario',
} as const

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(KEYS.token)
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(KEYS.usuario)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  setAuth(token: string, user: AuthUser): void {
    localStorage.setItem(KEYS.token, token)
    localStorage.setItem(KEYS.usuario, JSON.stringify(user))
  },

  updateUser(user: AuthUser): void {
    localStorage.setItem(KEYS.usuario, JSON.stringify(user))
  },

  clearAuth(): void {
    localStorage.removeItem(KEYS.token)
    localStorage.removeItem(KEYS.usuario)
  },
}
