import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { storage } from '../../infrastructure/storage/localStorage'

const ADMIN_SESSION_KEY = 'adminSession'

export function exitImpersonation(navigate: ReturnType<typeof useNavigate>, authStore: ReturnType<typeof useAuthStore.getState>) {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY)
  if (!raw) return
  try {
    const { token, usuario } = JSON.parse(raw)
    authStore.login(token, usuario)
  } catch {
    // ignore
  }
  localStorage.removeItem(ADMIN_SESSION_KEY)
  navigate('/admin')
}

export function saveAdminSession(token: string, usuario: { id: string; nombre: string; email: string; rol: string; telefono: string; verificacionEstado: string; administracion: string | null }) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ token, usuario }))
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

export function hasAdminSession(): boolean {
  return localStorage.getItem(ADMIN_SESSION_KEY) !== null
}

export function getImpersonatedUser(): { nombre: string } | null {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY)
  if (!raw) return null
  try {
    const { usuario } = JSON.parse(raw)
    return { nombre: usuario.nombre }
  } catch {
    return null
  }
}

export default function ImpersonationBanner() {
  const navigate = useNavigate()
  const authStore = useAuthStore

  if (!hasAdminSession()) return null

  const adminUser = getImpersonatedUser()

  return (
    <div className="bg-amber-500 text-amber-900 px-4 py-2.5 flex items-center justify-between text-sm font-medium">
      <span>⚠️ Estás suplantando a {adminUser?.nombre || 'un usuario'}</span>
      <button
        onClick={() => exitImpersonation(navigate, authStore.getState())}
        className="bg-white text-amber-800 px-4 py-1 rounded-xl font-bold hover:bg-amber-50 transition-colors"
      >
        Volver al panel de admin
      </button>
    </div>
  )
}
