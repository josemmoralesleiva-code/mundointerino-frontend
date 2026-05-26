import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, administracion }) {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

  if (!token) return <Navigate to="/login" />

  if (administracion) {
    if (usuario?.verificacionEstado !== 'verificado') {
      return <Navigate to="/verificacion-docente" />
    }
    if (usuario?.administracion !== administracion) {
      return <Navigate to="/mundo" state={{ accesoDenegado: true }} />
    }
  }

  return children
}