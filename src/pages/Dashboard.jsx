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
  const [tabActiva, setTabActiva] = useState('todos')

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

  const pisosDisponibles = misPisos.filter(p => p.disponible)
  const pisosNoDisponibles = misPisos.filter(p => !p.disponible)
  const pisosFiltrados = tabActiva === 'todos' ? misPisos
    : tabActiva === 'disponibles' ? pisosDisponibles
    : pisosNoDisponibles

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center">
            {/* ✏️ CAMBIO: alt + tamaño consistente */}
            <img src="/img/logo.png" alt="Repla" className="h-14" />
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-gray-600 text-sm">Hola, <strong>{usuario.nombre}</strong></span>
            <button onClick={cerrarSesion} className="text-sm text-red-500 hover:text-red-700 font-medium">
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Bienvenido, {usuario.nombre} 👋
            </h1>
            <p className="text-primary-100">
              {usuario.rol === 'docente'
                ? 'Encuentra el alojamiento ideal para tu destino.'
                // ✏️ CAMBIO: "docentes" → "interinos"
                : 'Gestiona tus anuncios y conecta con interinos.'}
            </p>
          </div>
          {usuario.rol === 'propietario' && (
            <button
              onClick={() => navigate('/pisos/nuevo')}
              className="bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-50 transition-all text-sm whitespace-nowrap">
              + Publicar nuevo piso
            </button>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ESTADÍSTICAS (solo propietario) */}
        {usuario.rol === 'propietario' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Pisos publicados', valor: misPisos.length, icono: '🏠', color: 'bg-blue-50 text-blue-700' },
              { label: 'Disponibles', valor: pisosDisponibles.length, icono: '✅', color: 'bg-green-50 text-green-700' },
              { label: 'No disponibles', valor: pisosNoDisponibles.length, icono: '⏸️', color: 'bg-orange-50 text-orange-700' },
              { label: 'Precio medio', valor: misPisos.length > 0 ? `${Math.round(misPisos.reduce((a,p) => a + Number(p.precio), 0) / misPisos.length)}€` : '—', icono: '💶', color: 'bg-purple-50 text-purple-700' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 ${stat.color}`}>
                  {stat.icono}
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.valor}</p>
                <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ACCESOS RÁPIDOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button onClick={() => navigate('/pisos')}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all text-left group">
            <div className="text-2xl mb-3">🔍</div>
            <h2 className="font-semibold text-gray-800 mb-1 group-hover:text-primary-700 transition-colors">Buscar pisos</h2>
            {/* ✏️ CAMBIO: ampliado a toda España */}
            <p className="text-gray-400 text-sm">Encuentra alojamiento ideal en toda España.</p>
          </button>

          {usuario.rol === 'propietario' && (
            <button onClick={() => navigate('/pisos/nuevo')}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all text-left group">
              <div className="text-2xl mb-3">➕</div>
              <h2 className="font-semibold text-gray-800 mb-1 group-hover:text-primary-700 transition-colors">Publicar piso</h2>
              <p className="text-gray-400 text-sm">Añade un nuevo anuncio en 3 pasos.</p>
            </button>
          )}

          <button onClick={() => navigate('/perfil')}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all text-left group">
            <div className="text-2xl mb-3">👤</div>
            <h2 className="font-semibold text-gray-800 mb-1 group-hover:text-primary-700 transition-colors">Mi perfil</h2>
            <p className="text-gray-400 text-sm">Edita tus datos y preferencias.</p>
          </button>
        </div>

        {/* MIS PISOS (solo propietario) */}
        {usuario.rol === 'propietario' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Mis pisos publicados</h2>
                <p className="text-gray-400 text-sm mt-0.5">Gestiona disponibilidad, edita y elimina anuncios.</p>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {[['todos','Todos'],['disponibles','Disponibles'],['no-disponibles','Pausados']].map(([val, label]) => (
                  <button key={val} onClick={() => setTabActiva(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      tabActiva === val ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {cargando ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : misPisos.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏠</span>
                </div>
                <p className="text-gray-700 font-semibold text-lg">Sin anuncios todavía</p>
                {/* ✏️ CAMBIO: "docentes de Aragón" → "interinos de toda España" */}
                <p className="text-gray-400 text-sm mt-1 mb-6">Publica tu primer piso para llegar a interinos de toda España.</p>
                <button onClick={() => navigate('/pisos/nuevo')}
                  className="bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-800 transition-all">
                  Publicar mi primer piso
                </button>
              </div>
            ) : pisosFiltrados.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No hay pisos en esta categoría.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {pisosFiltrados.map(piso => (
                  <div key={piso._id}
                    className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-gray-200 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">{piso.titulo}</h3>
                        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                          piso.disponible ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {piso.disponible ? 'Disponible' : 'Pausado'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        📍 {piso.ciudad}{piso.barrio ? `, ${piso.barrio}` : ''} · 💶 {piso.precio}€/mes · 🛏 {piso.habitaciones} hab.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button onClick={() => toggleDisponibilidad(piso._id)}
                        className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                          piso.disponible
                            ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}>
                        {piso.disponible ? '⏸ Pausar' : '▶ Activar'}
                      </button>
                      <button onClick={() => navigate(`/pisos/${piso._id}/editar`)}
                        className="text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-2 rounded-lg font-medium transition-colors">
                        ✏️ Editar
                      </button>
                      <button onClick={() => navigate(`/pisos/${piso._id}`)}
                        className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-2 rounded-lg font-medium transition-colors">
                        👁 Ver
                      </button>
                      <button onClick={() => eliminarPiso(piso._id)}
                        className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg font-medium transition-colors">
                        🗑 Eliminar
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