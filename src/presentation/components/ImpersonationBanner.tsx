import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { useAuth } from '../hooks/useAuth'
import adminRepository from '../../infrastructure/repositories/admin.repository'
import type { AuthUser } from '../../infrastructure/dto/auth.dto'

const ADMIN_SESSION_KEY = 'adminSession'

export async function exitImpersonation(
  navigate: ReturnType<typeof useNavigate>,
  authStore: ReturnType<typeof useAuthStore.getState>,
): Promise<void> {
  const raw = sessionStorage.getItem(ADMIN_SESSION_KEY)
  if (!raw) {
    authStore.logout()
    navigate('/')
    return
  }
  let adminUser: AuthUser
  try {
    const parsed = JSON.parse(raw)
    adminUser = parsed.usuario
  } catch {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    authStore.logout()
    navigate('/')
    return
  }
  try {
    // TODO(Bloque F / BACKEND-2): backend debe restaurar la cookie de admin via
    // POST /admin/end-impersonation o similar. Si no existe aún, fallback local.
    await adminRepository.endImpersonation()
  } catch {
    // El endpoint aún no existe o falló: restauramos localmente asumiendo que la
    // cookie de admin sigue válida. Si no lo estuviera, el interceptor de 401
    // forzará logout real.
  }
  authStore.login(adminUser)
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
  navigate('/admin')
}

export function saveAdminSession(usuario: AuthUser) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ usuario }))
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function hasAdminSession(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) !== null
}

export function getAdminSessionUser(): AuthUser | null {
  const raw = sessionStorage.getItem(ADMIN_SESSION_KEY)
  if (!raw) return null
  try {
    const { usuario } = JSON.parse(raw)
    return usuario
  } catch {
    return null
  }
}

export default function ImpersonationBanner() {
  const navigate = useNavigate()
  const authStore = useAuthStore
  const { user, logout } = useAuth()
  const [saliendo, setSaliendo] = useState(false)

  if (!hasAdminSession()) return null

  const handleExit = async () => {
    setSaliendo(true)
    try {
      await exitImpersonation(navigate, authStore.getState())
    } catch {
      logout()
    } finally {
      setSaliendo(false)
    }
  }

  return (
    <div className="bg-amber-500 text-amber-900 px-4 py-2.5 flex items-center justify-between text-sm font-medium gap-3 flex-wrap">
      <span>⚠️ Estás suplantando a <strong>{user?.nombre || 'un usuario'}</strong></span>
      <button
        onClick={handleExit}
        disabled={saliendo}
        className="bg-white text-amber-800 px-4 py-1.5 rounded-xl font-bold hover:bg-amber-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saliendo ? 'Restaurando…' : 'Volver al panel de admin'}
      </button>
    </div>
  )
}
