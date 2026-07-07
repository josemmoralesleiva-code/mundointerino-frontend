import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../store/auth.store'
import type { Role } from '../../domain/models'

interface PrivateRouteProps {
  children: ReactNode
  administracion?: string
  roles?: Role[]
}

export default function PrivateRoute({ children, administracion, roles }: PrivateRouteProps) {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" />

  if (roles && !roles.includes(user.rol as Role)) {
    return <Navigate to="/" />
  }

  if (administracion) {
    if (user.verificacionEstado !== 'verificado') {
      return <Navigate to="/verificacion-docente" />
    }
    if ((user.administracion || '').toLowerCase() !== administracion.toLowerCase()) {
      return <Navigate to="/dashboard" state={{ accesoDenegado: true }} />
    }
  }

  return children
}
