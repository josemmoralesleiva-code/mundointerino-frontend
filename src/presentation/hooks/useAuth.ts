import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { loginUseCase } from '../../application/useCases/auth'
import { registerUseCase } from '../../application/useCases/auth'
import type { LoginRequest, RegisterRequest } from '../../infrastructure/dto/auth.dto'

export function useAuth() {
  const navigate = useNavigate()
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout, hydrate } = useAuthStore()

  const login = useCallback(async (data: LoginRequest) => {
    const response = await loginUseCase(data)
    storeLogin(response.token, response.usuario)

    if (response.usuario.rol === 'admin') { navigate('/admin'); return }
    if (response.usuario.rol === 'propietario') {
      if (response.usuario.verificacionEstado === 'pendiente') { navigate('/verificacion-propietario'); return }
      navigate('/dashboard'); return
    }
    if (response.usuario.rol === 'docente') {
      if (response.usuario.verificacionEstado === 'pendiente') { navigate('/verificacion-docente'); return }
      navigate('/dashboard'); return
    }
    navigate('/dashboard')
  }, [navigate, storeLogin])

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await registerUseCase(data)
    storeLogin(response.token, response.usuario)

    if (response.usuario.rol === 'propietario') { navigate('/verificacion-propietario'); return }
    navigate('/verificacion-docente')
  }, [navigate, storeLogin])

  const logout = useCallback(() => {
    storeLogout()
    navigate('/login')
  }, [navigate, storeLogout])

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    hydrate,
  }
}
