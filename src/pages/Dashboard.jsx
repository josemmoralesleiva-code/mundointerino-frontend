import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function Dashboard() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const token = localStorage.getItem('token')
  const [misPisos, setMisPisos] = useState([])
  const [cargando, setCargando] = useState(true)

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  useEffect(() => {
    const cargarPisos = async () => {
      try {
        if (usuario.rol === 'propietario') {
          const res = await axios.get(`${API_URL}/api/pisos/mis-pisos`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setMisPisos(res.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setCargando(false)
      }
    }

    cargarPisos()
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
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center">
            <img src="/img/logo.png" alt="Profinter" className="h-10" />
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-gray-600 text-sm">
              Hola, {usuario.nombre}
            </span>
            <button
              onClick={cerrarSesion}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* HERO DASHBOARD */}
      <section className="bg-primary-700 text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Bienvenido, {usuario.nombre} 👋
          </h1>
          <p className="text-primary-100 text-lg">
            {usuario.rol === 'docente'
              ? 'Gestiona tus favoritos, búsquedas y mensajes en un solo lugar.'
              : 'Gestiona tus anuncios, disponibilidad y contacto con docentes.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TARJETAS DE ACCESO RÁPIDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">🔍</div>
            <h2 className="font-semibold text-gray-800 mb-1">Buscar pisos</h2>
            <p className="text-gray-500 text-sm">Encuentra el alojamiento ideal.</p>
            <button
              onClick={() => navigate('/pisos')}
              className="mt-4 text-primary-700 text-sm font-medium hover:underline"
            >
              Ver pisos →
            </button>
          </div>

          {usuario.rol === 'propietario' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="text-3xl mb-3">➕</div>
              <h2 className="font-semibold text-gray-800 mb-1">Publicar piso</h2>
              <p className="text-gray-500 text-sm">Añade un nuevo anuncio.</p>
              <button
                onClick={() => navigate('/pisos/nuevo')}
                className="mt-4 text-primary-700 text-sm font-medium hover:underline"
              >
                Publicar →
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">👤</div>
            <h2 className="font-semibold text-gray-800 mb-1">Mi perfil</h2>
            <p className="text-gray-500 text-sm">Gestiona tu cuenta.</p>
            <button
              onClick={() => navigate('/perfil')}
              className="mt-4 text-primary-700 text-sm font-medium hover:underline"
            >
              Ver perfil →
            </button>
          </div>
        </div>

        {/* MIS PISOS */}
        {usuario.rol === 'propietario' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Mis pisos publicados</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Gestiona anuncios, disponibilidad y edición.
                </p>
              </div>
              <button
                onClick={() => navigate('/publicar')}
                className="bg-primary-700 text-white px-4 py-2 rounded-xl hover:bg-primary-800 font-medium transition-all text-sm"
              >
                + Publicar piso
              </button>
            </div>

            {cargando ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3 animate-pulse">🏘️</div>
                <p>Cargando tus pisos...</p>
              </div>
            ) : misPisos.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                <div className="text-4xl mb-3">🏠</div>
                <p className="text-gray-500 font-medium">Todavía no has publicado ningún piso.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Empieza publicando tu primer anuncio para docentes.
                </p>
                <button
                  onClick={() => navigate('/publicar')}
                  className="mt-6 bg-accent-500 hover:bg-accent-600 text-white px-5 py-3 rounded-xl font-semibold transition-all"
                >
                  Publicar mi primer piso
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {misPisos.map(piso => (
                  <div
                    key={piso._id}
                    className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-sm transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{piso.titulo}</h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            piso.disponible
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {piso.disponible ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        📍 {piso.ciudad} · 💶 {piso.precio}€/mes · 🛏 {piso.habitaciones} hab.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleDisponibilidad(piso._id)}
                        className="text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-2 rounded-lg font-medium transition-colors"
                      >
                        Cambiar disponibilidad
                      </button>
                      <button
                        onClick={() => navigate(`/pisos/${piso._id}/editar`)}
                        className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg font-medium transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarPiso(piso._id)}
                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg font-medium transition-colors"
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