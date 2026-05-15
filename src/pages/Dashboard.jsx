import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-700">🏠 Profinter</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Hola, {usuario.nombre}</span>
          <button
            onClick={cerrarSesion}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Bienvenido, {usuario.nombre} 👋
        </h1>
        <p className="text-gray-500 mb-8">
          {usuario.rol === 'docente' ? '🎓 Docente interino' : '🏠 Propietario'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-3xl mb-3">🔍</div>
            <h2 className="font-semibold text-gray-800 mb-1">Buscar pisos</h2>
            <p className="text-gray-500 text-sm">Encuentra tu alojamiento en Aragón</p>
            <button
              onClick={() => navigate('/pisos')}
              className="mt-4 text-blue-700 text-sm font-medium hover:underline"
            >
              Ver pisos →
            </button>
          </div>

          {usuario.rol === 'propietario' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-3xl mb-3">➕</div>
              <h2 className="font-semibold text-gray-800 mb-1">Publicar piso</h2>
              <p className="text-gray-500 text-sm">Añade tu piso para docentes</p>
              <button
                onClick={() => navigate('/pisos/nuevo')}
                className="mt-4 text-blue-700 text-sm font-medium hover:underline"
              >
                Publicar →
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-3xl mb-3">👤</div>
            <h2 className="font-semibold text-gray-800 mb-1">Mi perfil</h2>
            <p className="text-gray-500 text-sm">Gestiona tu cuenta</p>
            <button
              onClick={() => navigate('/perfil')}
              className="mt-4 text-blue-700 text-sm font-medium hover:underline"
            >
              Ver perfil →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}