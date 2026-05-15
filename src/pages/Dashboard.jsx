import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function Dashboard() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const token = localStorage.getItem('token')
  const [misPisos, setMisPisos] = useState([])

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  useEffect(() => {
    if (usuario.rol === 'propietario') {
      axios.get(`${API_URL}/api/pisos/mis-pisos`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setMisPisos(res.data))
        .catch(err => console.error(err))
    }
  }, [])

  const eliminarPiso = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este piso?')) return
    await axios.delete(`${API_URL}/api/pisos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setMisPisos(prev => prev.filter(p => p._id !== id))
  }

  const toggleDisponibilidad = async (id) => {
    const res = await axios.patch(`${API_URL}/api/pisos/${id}/disponibilidad`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setMisPisos(prev => prev.map(p => p._id === id ? res.data : p))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-700">🏠 Profinter</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Hola, {usuario.nombre}</span>
          <button onClick={cerrarSesion} className="text-sm text-red-500 hover:text-red-700 font-medium">
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

        {/* Tarjetas de acceso rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-3xl mb-3">🔍</div>
            <h2 className="font-semibold text-gray-800 mb-1">Buscar pisos</h2>
            <p className="text-gray-500 text-sm">Encuentra tu alojamiento en Aragón</p>
            <button onClick={() => navigate('/pisos')} className="mt-4 text-blue-700 text-sm font-medium hover:underline">
              Ver pisos →
            </button>
          </div>

          {usuario.rol === 'propietario' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-3xl mb-3">➕</div>
              <h2 className="font-semibold text-gray-800 mb-1">Publicar piso</h2>
              <p className="text-gray-500 text-sm">Añade tu piso para docentes</p>
              <button onClick={() => navigate('/pisos/nuevo')} className="mt-4 text-blue-700 text-sm font-medium hover:underline">
                Publicar →
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-3xl mb-3">👤</div>
            <h2 className="font-semibold text-gray-800 mb-1">Mi perfil</h2>
            <p className="text-gray-500 text-sm">Gestiona tu cuenta</p>
            <button onClick={() => navigate('/perfil')} className="mt-4 text-blue-700 text-sm font-medium hover:underline">
              Ver perfil →
            </button>
          </div>
        </div>

        {/* Mis pisos — solo propietarios */}
        {usuario.rol === 'propietario' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏘 Mis pisos publicados</h2>

            {misPisos.length === 0 ? (
              <p className="text-gray-400 text-sm">Todavía no has publicado ningún piso.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {misPisos.map(piso => (
                  <div key={piso._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{piso.titulo}</h3>
                      <p className="text-gray-500 text-sm">📍 {piso.ciudad} · 💶 {piso.precio}€/mes · 🛏 {piso.habitaciones} hab.</p>
                      <span className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${piso.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {piso.disponible ? '✅ Disponible' : '❌ No disponible'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => toggleDisponibilidad(piso._id)}
                        className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium"
                      >
                        Cambiar disponibilidad
                      </button>
                      <button
                        onClick={() => navigate(`/pisos/${piso._id}/editar`)}
                        className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarPiso(piso._id)}
                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}