import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../store/auth.store'

export default function PrivateRoute({ children, administracion }: { children: ReactNode; administracion?: string }) {
  const { token, user } = useAuthStore()

  if (!token || !user) return <Navigate to="/login" />

  if (administracion) {
    if (user.verificacionEstado !== 'verificado') {
      return <Navigate to="/verificacion-docente" />
    }
    if ((user.administracion || '').toLowerCase() !== administracion.toLowerCase()) {
      return <Navigate to="/mundo" state={{ accesoDenegado: true }} />
    }
  }

  return children
}
