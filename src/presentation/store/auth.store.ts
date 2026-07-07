import { create } from 'zustand'
import { storage } from '../../infrastructure/storage/localStorage'
import type { AuthUser } from '../../infrastructure/dto/auth.dto'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean

  login: (user: AuthUser) => void
  logout: () => void
  setUser: (user: AuthUser) => void
  updateUser: (user: AuthUser) => void
  setBootstrapping: (value: boolean) => void
}

const cachedUser = storage.getUser()

export const useAuthStore = create<AuthState>((set) => ({
  user: cachedUser,
  isAuthenticated: cachedUser !== null,
  isBootstrapping: true,

  login: (user) => {
    storage.setUser(user)
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    storage.clearUser()
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => {
    storage.setUser(user)
    set({ user, isAuthenticated: user !== null })
  },

  updateUser: (user) => {
    storage.setUser(user)
    set({ user, isAuthenticated: user !== null })
  },

  setBootstrapping: (value) => {
    set({ isBootstrapping: value })
  },
}))
