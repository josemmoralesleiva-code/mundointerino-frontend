import type { AuthUser } from '../dto/auth.dto'

const KEYS = {
  usuario: 'usuario',
} as const

export const storage = {
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(KEYS.usuario)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  setUser(user: AuthUser): void {
    localStorage.setItem(KEYS.usuario, JSON.stringify(user))
  },

  updateUser(user: AuthUser): void {
    localStorage.setItem(KEYS.usuario, JSON.stringify(user))
  },

  clearUser(): void {
    localStorage.removeItem(KEYS.usuario)
  },
}
