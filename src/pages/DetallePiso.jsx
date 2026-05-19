import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL

export default function DetallePiso() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [piso, setPiso] = useState(null)
  const [error, setError] = useState(false)
  const [fotoActiva, setFotoActiva] = useState(0)

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/pisos/${id}`)
        setPiso(res.data)
        setError(false)
        setFotoActiva(0)
      } catch (err) {
        setError(true)
      }
    }
    if (id) cargar()
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center p-10 max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-5">😕</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Piso no encontrado</h1>
          <p className="text-gray-400 text-sm mb-6">No hemos podido localizar este anuncio.</p>
          <button
            onClick={() => navigate('/pisos')}
            className="bg-primary-700 text-white px-6 py-3 rounded-xl hover:bg-primary-800 transition-all font-medium text-sm"
          >
            Volver al listado
          </button>
        </div>
      </div>
    )
  }

  if (!piso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-700 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Cargando piso...</p>
        </div>
      </div>
    )
  }

  const fotos = piso.fotos?.length > 0 ? piso.fotos : null
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((piso.ciudad || '') + ' ' + (piso.barrio || ''))}`

  const serviciosIconos = {
    WiFi: '📶',
    Calefacción: '🔥',
    'Aire acondicionado': '❄️',
    Lavadora: '🫧',
    'Cocina equipada': '🍳',
    Parking: '🅿️',
    Terraza: '🌿',
    Ascensor: '🛗',
    Amueblado: '🛋️',
    'Agua incluida': '💧',
    'Luz incluida': '💡',
    Mascotas: '🐾',
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 fade-in">
        <button
          onClick={() => navigate('/pisos')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-primary-700 text-sm mb-6 transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Volver al listado</span>
        </button>

        {/* GALERÍA */}
        <div className="mb-8">
          {fotos ? (
            <div className="grid grid-cols-1 gap-3">
              <div className="w-full h-72 md:h-[500px] rounded-3xl overflow-hidden bg-gray-100 relative">
                <img
                  key={fotoActiva}
                  src={fotos[fotoActiva]}
                  alt={piso.titulo}
                  className="w-full h-full object-cover fade-in"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                    piso.tipoEstancia === 'corta'
                      ? 'bg-amber-400/90 text-amber-900'
                      : 'bg-emerald-400/90 text-emerald-900'
                  }`}>
                    {piso.tipoEstancia === 'corta' ? '⚡ Estancia corta' : '📅 Estancia larga'}
                  </span>
                  {piso.activo !== undefined && (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                      piso.activo ? 'bg-green-400/90 text-green-900' : 'bg-red-400/90 text-red-900'
                    }`}>
                      {piso.activo ? '✅ Disponible' : '❌ No disponible'}
                    </span>
                  )}
                </div>
                {fotos.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {fotoActiva + 1} / {fotos.length}
                  </div>
                )}
              </div>

              {fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {fotos.map((foto, i) => (
                    <button
                      key={i}
                      onClick={() => setFotoActiva(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all border-2 ${
                        fotoActiva === i ? 'border-primary-700 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={foto} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-72 md:h-96 rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center border border-primary-100">
              <span className="text-8xl opacity-20">🏠</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h1 style={{ fontFamily: "'DM Serif Display', serif" }}
                className="text-3xl md:text-4xl text-gray-900 mb-3 leading-tight">
                {piso.titulo}
              </h1>
              <p className="text-gray-500 flex items-center gap-1 mb-5">
                <span>📍</span>
                <span className="font-medium">{piso.ciudad}{piso.barrio ? ` · ${piso.barrio}` : ''}</span>
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-primary-50 rounded-2xl p-4 text-center border border-primary-100">
                  <div className="text-2xl mb-1">🛏</div>
                  <div className="text-xl font-bold text-primary-700">{piso.habitaciones || '—'}</div>
                  <div className="text-xs text-gray-500">Habitaciones</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                  <div className="text-2xl mb-1">🚿</div>
                  <div className="text-xl font-bold text-blue-700">{piso.banos || '—'}</div>
                  <div className="text-xs text-gray-500">Baños</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
                  <div className="text-2xl mb-1">📐</div>
                  <div className="text-xl font-bold text-purple-700">{piso.metros ? `${piso.metros}m²` : '—'}</div>
                  <div className="text-xs text-gray-500">Superficie</div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="text-xl font-bold text-amber-700">{piso.planta || '—'}</div>
                  <div className="text-xs text-gray-500">Planta</div>
                </div>
              </div>
            </div>

            {piso.descripcion && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📝 <span>Descripción</span>
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{piso.descripcion}</p>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                🏠 <span>Detalles del piso</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Ciudad', valor: piso.ciudad, icono: '📍' },
                  { label: 'Barrio / Zona', valor: piso.barrio, icono: '🗺️' },
                  { label: 'Tipo de estancia', valor: piso.tipoEstancia === 'corta' ? 'Corta (días/semanas)' : 'Larga (meses)', icono: '📅' },
                  { label: 'Habitaciones', valor: piso.habitaciones, icono: '🛏' },
                  { label: 'Baños', valor: piso.banos, icono: '🚿' },
                  { label: 'Metros cuadrados', valor: piso.metros ? `${piso.metros} m²` : null, icono: '📐' },
                  { label: 'Planta', valor: piso.planta, icono: '🏢' },
                  { label: 'Precio', valor: `${piso.precio}€ ${piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}`, icono: '💶' },
                  { label: 'Disponibilidad', valor: piso.activo ? 'Disponible' : 'No disponible', icono: piso.activo ? '✅' : '❌' },
                  { label: 'Publicado', valor: piso.createdAt ? new Date(piso.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '—', icono: '📆' },
                ].filter(d => d.valor !== null && d.valor !== undefined && d.valor !== '').map(d => (
                  <div key={d.label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <span className="text-lg">{d.icono}</span>
                    <div>
                      <p className="text-xs text-gray-400">{d.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{d.valor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {piso.servicios?.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  ✨ <span>Servicios incluidos</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {piso.servicios.map(servicio => (
                    <span
                      key={servicio}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-50 border border-primary-100 text-sm text-primary-800 font-medium"
                    >
                      <span>{serviciosIconos[servicio] || '✅'}</span>
                      {servicio}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                🗺️ <span>Ubicación</span>
              </h2>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-gradient-to-r from-primary-50 to-blue-50 hover:from-primary-100 hover:to-blue-100 border border-primary-100 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">
                    🗺️
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{piso.ciudad}{piso.barrio ? ` · ${piso.barrio}` : ''}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Abrir en Google Maps</p>
                  </div>
                </div>
                <span className="text-primary-700 font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {piso.propietario && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  👤 <span>Propietario</span>
                </h2>
                <div className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-primary-50 rounded-2xl p-5 border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-primary-700 flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-md">
                    {piso.propietario.nombre?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{piso.propietario.nombre || 'Propietario'}</p>
                    {piso.propietario.email && (
                      <p className="text-gray-500 text-sm mt-0.5 truncate">✉️ {piso.propietario.email}</p>
                    )}
                    {piso.propietario.telefono && (
                      <p className="text-gray-500 text-sm">📞 {piso.propietario.telefono}</p>
                    )}
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                    ✅ Verificado
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary-700">{piso.precio}€</span>
                    <span className="text-gray-400 text-sm">
                      {piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Precio orientativo · Negociación directa</p>
                </div>

                {/* ✏️ CAMBIO: badge más inclusivo */}
                <div className="bg-primary-50 border border-primary-100 rounded-2xl px-4 py-3 mb-5 text-sm text-primary-700 font-medium">
                  🧑‍💼 Piso pensado para interinos de la administración
                </div>

                <div className="space-y-3">
                  {piso.propietario?.telefono && (
                    <a
                      href={`tel:${piso.propietario.telefono}`}
                      className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      📞 Llamar al propietario
                    </a>
                  )}
                  {piso.propietario?.email && (
                    <a
                      href={`mailto:${piso.propietario.email}?subject=Consulta sobre ${encodeURIComponent(piso.titulo)}`}
                      className="w-full flex items-center justify-center gap-2 border-2 border-primary-200 hover:border-primary-700 text-primary-700 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                    >
                      ✉️ Enviar email
                    </a>
                  )}
                  {piso.propietario?.telefono && (
                    <a
                      href={`https://wa.me/${piso.propietario.telefono.replace(/\s/g, '')}?text=Hola, me interesa el piso: ${encodeURIComponent(piso.titulo)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      💬 WhatsApp
                    </a>
                  )}
                </div>

                <button
                  onClick={() => navigate('/pisos')}
                  className="w-full text-gray-400 hover:text-primary-700 py-3 text-sm transition-colors mt-3"
                >
                  ← Ver más pisos
                </button>
              </div>

              {/* ✏️ CAMBIO: título y contenido del bloque "¿Por qué?" */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">¿Por qué MundoInterino?</h3>
                <div className="space-y-4">
                  {[
                    { icono: '🧑‍💼', titulo: 'Ideal para interinos', desc: 'Vivienda pensada para estancias laborales y temporales.' },
                    { icono: '🤝', titulo: 'Contacto directo', desc: 'Sin intermediarios. Negocia directamente con el propietario.' },
                    { icono: '💶', titulo: 'Sin comisiones', desc: 'La publicación y el contacto son completamente gratuitos.' },
                    { icono: '✅', titulo: 'Propietarios verificados', desc: 'Revisamos cada anuncio antes de publicarlo.' },
                  ].map(g => (
                    <div key={g.titulo} className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{g.icono}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{g.titulo}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{g.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-primary-900 text-white py-10 px-6 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {/* ✏️ CAMBIO: alt y texto del footer */}
            <img src="/img/logo.png" alt="MundoInterino" className="h-12 brightness-0 invert opacity-70" />
            <p className="text-primary-100 text-sm">© 2026 MundoInterino · Tu hogar donde te necesiten</p>
          </div>
          <div className="flex gap-6 text-sm text-primary-100">
            <button onClick={() => navigate('/pisos')} className="hover:text-white transition-colors">Buscar piso</button>
            <button onClick={() => navigate('/publicar')} className="hover:text-white transition-colors">Publicar piso</button>
            <button onClick={() => navigate('/contacto')} className="hover:text-white transition-colors">Contacto</button>
          </div>
        </div>
      </footer>
    </div>
  )
}