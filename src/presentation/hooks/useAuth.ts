import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import {
  loginUseCase,
  registerUseCase,
  verifyEmailUseCase,
  resendVerificationUseCase,
  meUseCase,
  logoutUseCase,
} from '../../application/useCases/auth'
import { clearAdminSession } from '../components/ImpersonationBanner'
import { storage } from '../../infrastructure/storage/localStorage'
import type { LoginRequest, RegisterRequest, AuthUser } from '../../infrastructure/dto/auth.dto'

export type VerifyEmailHookError = string | undefined

const redirectByRole = (usuario: AuthUser, navigate: (to: string) => void) => {
  if (usuario.rol === 'admin') { navigate('/admin'); return }
  if (usuario.rol === 'propietario') {
    if (usuario.verificacionEstado !== 'verificado') { navigate('/verificacion-propietario'); return }
    navigate('/dashboard'); return
  }
  if (usuario.rol === 'docente') {
    if (usuario.verificacionEstado !== 'verificado') { navigate('/verificacion-docente'); return }
    navigate('/dashboard'); return
  }
  navigate('/dashboard')
}

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isBootstrapping, login: storeLogin, logout: storeLogout, updateUser, setBootstrapping } = useAuthStore()

  const login = useCallback(async (data: LoginRequest) => {
    const usuario = await loginUseCase(data)
    storeLogin(usuario)
    redirectByRole(usuario, navigate)
  }, [navigate, storeLogin])

  const register = useCallback(async (data: RegisterRequest) => {
    await registerUseCase(data)
    const emailEncoded = encodeURIComponent(data.email)
    navigate(`/verificar-email-pendiente?email=${emailEncoded}`)
  }, [navigate])

  const verifyEmail = useCallback(async (token: string): Promise<{ ok: boolean; error?: VerifyEmailHookError }> => {
    try {
      const res = await verifyEmailUseCase(token)
      storeLogin(res.usuario)
      redirectByRole(res.usuario, navigate)
      return { ok: true }
    } catch (err: any) {
      const code = err?.response?.data?.error as string | undefined
      return { ok: false, error: code }
    }
  }, [navigate, storeLogin])

  const resendVerification = useCallback(async (email: string): Promise<{ ok: boolean; error?: VerifyEmailHookError }> => {
    try {
      await resendVerificationUseCase(email)
      return { ok: true }
    } catch (err: any) {
      const code = err?.response?.data?.error as string | undefined
      return { ok: false, error: code }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUseCase()
    } catch {
      // best-effort: limpiamos estado local aunque falle la llamada al servidor
    }
    storeLogout()
    storage.clearUser()
    clearAdminSession()
    navigate('/')
  }, [navigate, storeLogout])

  const bootstrap = useCallback(async () => {
    // Solo validamos contra el backend si había una sesión cacheada;
    // si no hay usuario guardado, no tiene sentido llamar a /me ni disparar
    // refresh (la cookie httpOnly no se puede leer desde JS).
    const cached = storage.getUser()
    if (!cached) {
      setBootstrapping(false)
      return
    }
    setBootstrapping(true)
    try {
      const usuario = await meUseCase()
      storeLogin(usuario)
    } catch {
      // Si /me falla (sesión expirada, backend caído, timeout, etc.)
      // conservamos el usuario cacheado. El interceptor de axios
      // se encargará del refresh si es necesario en la siguiente llamada real.
    } finally {
      setBootstrapping(false)
    }
  }, [storeLogin, storeLogout, setBootstrapping])

  return {
    user,
    isAuthenticated,
    isBootstrapping,
    login,
    register,
    verifyEmail,
    resendVerification,
    logout,
    updateUser,
    bootstrap,
  }
}
