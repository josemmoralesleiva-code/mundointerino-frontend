import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, administracion }) {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

  // Sin token → login
  if (!token || !usuario) return <Navigate to="/login" />

  // Si la ruta requiere una administración concreta
  if (administracion) {
    // Cuenta no verificada
    if (usuario.verificacionEstado !== 'verificado') {
      return <Navigate to="/verificacion-docente" />
    }
    // Administración no coincide — comparación en minúsculas para evitar fallos
    if ((usuario.administracion || '').toLowerCase() !== administracion.toLowerCase()) {
      return <Navigate to="/mundo" state={{ accesoDenegado: true }} />
    }
  }

  return children
}