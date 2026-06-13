import { create } from 'zustand'
import { storage } from '../../infrastructure/storage/localStorage'
import type { AuthUser } from '../../infrastructure/dto/auth.dto'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean

  login: (token: string, user: AuthUser) => void
  logout: () => void
  hydrate: () => void
  updateUser: (user: AuthUser) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    storage.setAuth(token, user)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    storage.clearAuth()
    set({ user: null, token: null, isAuthenticated: false })
  },

  hydrate: () => {
    const token = storage.getToken()
    const user = storage.getUser()
    if (token && user) {
      set({ user, token, isAuthenticated: true })
    }
  },

  updateUser: (user) => {
    storage.updateUser(user)
    set({ user })
  },
}))
