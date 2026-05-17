import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function DetallePiso() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [piso, setPiso] = useState(null)
  const [error, setError] = useState(false)
  const [fotoActiva, setFotoActiva] = useState(0)

  useEffect(() => {
    axios.get(`${API_URL}/api/pisos/${id}`)
      .then(res => setPiso(res.data))
      .catch(() => setError(true))
  }, [id])

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center p-10 max-w-sm">
        <div className="text-6xl mb-5">😕</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Piso no encontrado</h1>
        <p className="text-gray-400 text-sm mb-6">No hemos podido localizar este anuncio.</p>
        <button
          onClick={() => navigate('/pisos')}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all font-medium text-sm"
        >
          Volver al listado
        </button>
      </div>
    </div>
  )

  if (!piso) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-300">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Cargando...</p>
      </div>
    </div>
  )

  const fotos = piso.fotos?.length > 0 ? piso.fotos : null
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((piso.ciudad || '') + ' ' + (piso.barrio || ''))}`

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .thumb:hover { opacity: 1 !important; }
      `}</style>

      {/* NAVBAR */}
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center">
            <img src="/img/logo.png" alt="Profinter" className="h-9" />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => navigate('/pisos')} className="text-gray-500 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
              Buscar piso
            </button>
            <button onClick={() => navigate('/publicar')} className="text-gray-700 font-medium text-sm px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-400 transition-all">
              Publicar piso
            </button>
            <button onClick={() => navigate('/login')} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium text-sm transition-all">
              Entrar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 fade-in">

        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/pisos')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 text-sm mb-6 transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Volver al listado</span>
        </button>

        {/* GALERÍA */}
        <div className="mb-8">
          {fotos ? (
            <div className="grid grid-cols-1 gap-3">
              <div className="w-full h-72 md:h-[480px] rounded-2xl overflow-hidden bg-gray-50">
                <img
                  key={fotoActiva}
                  src={fotos[fotoActiva]}
                  alt={piso.titulo}
                  className="w-full h-full object-cover fade-in"
                />
              </div>
              {fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {fotos.map((foto, i) => (
                    <button
                      key={i}
                      onClick={() => setFotoActiva(i)}
                      className="thumb flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all"
                      style={{ opacity: fotoActiva === i ? 1 : 0.5 }}
                    >
                      <img src={foto} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-72 md:h-96 rounded-2xl bg-gray-50 flex items-center justify-center">
              <span className="text-7xl opacity-20">🏠</span>
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  piso.tipoEstancia === 'corta'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {piso.tipoEstancia === 'corta' ? 'Estancia corta' : 'Estancia larga'}
                </span>
                {piso.disponible !== undefined && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    piso.disponible ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {piso.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                )}
              </div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl md:text-4xl text-gray-900 mb-2 leading-tight">
                {piso.titulo}
              </h1>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <span>📍</span>
                {piso.ciudad}{piso.barrio ? ` · ${piso.barrio}` : ''}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 py-6 border-y border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-lg">🛏</span>
                <span><strong className="text-gray-900">{piso.habitaciones}</strong> habitaciones</span>
              </div>
              {piso.banos && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">🚿</span>
                  <span><strong className="text-gray-900">{piso.banos}</strong> baños</span>
                </div>
              )}
              {piso.metros && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">📐</span>
                  <span><strong className="text-gray-900">{piso.metros}</strong> m²</span>
                </div>
              )}
            </div>

            {piso.descripcion && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Descripción</h2>
                <p className="text-gray-500 leading-relaxed text-sm whitespace-pre-line">{piso.descripcion}</p>
              </div>
            )}

            {piso.servicios?.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Servicios incluidos</h2>
                <div className="flex flex-wrap gap-2">
                  {piso.servicios.map(servicio => (
                    <span
                      key={servicio}
                      className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600"
                    >
                      {servicio}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mapa */}
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">Ubicación</h2>
              
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-lg">
                    🗺️
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{piso.ciudad}{piso.barrio ? ` · ${piso.barrio}` : ''}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Ver en Google Maps</p>
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-gray-600 transition-colors text-lg">→</span>
              </a>
            </div>

            {/* Propietario */}
            {piso.propietario && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Propietario</h2>
                <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600 flex-shrink-0">
                    {piso.propietario.nombre?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{piso.propietario.nombre || 'Propietario'}</p>
                    {piso.propietario.email && (
                      <p className="text-gray-400 text-xs mt-0.5 truncate">{piso.propietario.email}</p>
                    )}
                    {piso.propietario.telefono && (
                      <p className="text-gray-400 text-xs">{piso.propietario.telefono}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-gray-900">{piso.precio}€</span>
                  <span className="text-gray-400 text-sm">
                    {piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Precio orientativo · Negociación directa</p>
              </div>

              <div className="border-t border-gray-100 mb-5" />

              {piso.propietario?.telefono && (
                
                  href={`tel:${piso.propietario.telefono}`}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-xl font-medium text-sm transition-all mb-3"
                >
                  📞 Llamar al propietario
                </a>
              )}

              {piso.propietario?.email && (
                
                  href={`mailto:${piso.propietario.email}?subject=Consulta sobre ${encodeURIComponent(piso.titulo)}`}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-400 text-gray-700 py-3 rounded-xl font-medium text-sm transition-all mb-3"
                >
                  ✉️ Enviar email
                </a>
              )}

              <button
                onClick={() => navigate('/pisos')}
                className="w-full text-gray-400 hover:text-gray-700 py-2 text-sm transition-colors"
              >
                Ver más pisos →
              </button>

              <div className="border-t border-gray-100 mt-5 mb-5" />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5">🎓</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Ideal para docentes</p>
                    <p className="text-xs text-gray-400 mt-0.5">Vivienda pensada para estancias laborales y temporales.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5">🤝</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Contacto directo</p>
                    <p className="text-xs text-gray-400 mt-0.5">Sin intermediarios y con negociación clara.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center mt-16">
        <div className="max-w-5xl mx-auto">
          <img src="/img/logo.png" alt="Profinter" className="h-7 mx-auto mb-3 opacity-30" />
          <p className="text-gray-300 text-xs">© 2026 Profinter · Portal de alquiler para docentes</p>
        </div>
      </footer>
    </div>
  )
}