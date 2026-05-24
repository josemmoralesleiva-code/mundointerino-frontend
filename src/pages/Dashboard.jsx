import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL

export default function Dashboard() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const token = localStorage.getItem('token')
  const [misPisos, setMisPisos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [tabActiva, setTabActiva] = useState('todos')
  const [ciudad, setCiudad] = useState('')
  const [tipo, setTipo] = useState('')

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
            headers: { Authorization: `Bearer ${token}` },
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

  const eliminarPiso = async id => {
    if (!confirm('¿Seguro que quieres eliminar este piso?')) return
    await axios.delete(`${API_URL}/api/pisos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setMisPisos(prev => prev.filter(p => p._id !== id))
  }

  const toggleDisponibilidad = async id => {
    const res = await axios.patch(`${API_URL}/api/pisos/${id}/disponibilidad`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setMisPisos(prev => prev.map(p => (p._id === id ? res.data : p)))
  }

  const handleBuscar = () => {
    navigate(`/pisos?ciudad=${encodeURIComponent(ciudad)}&tipo=${tipo}`)
  }

  const pisosDisponibles = misPisos.filter(p => p.disponible)
  const pisosNoDisponibles = misPisos.filter(p => !p.disponible)
  const pisosFiltrados =
    tabActiva === 'todos' ? misPisos
    : tabActiva === 'disponibles' ? pisosDisponibles
    : pisosNoDisponibles

  const esInquilino = usuario.rol === 'docente' || usuario.rol === 'inquilino' || !usuario.rol || usuario.rol === ''
  const esPropietario = usuario.rol === 'propietario'

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      {/* HERO */}
      <section
        className="relative text-white pt-8 pb-12 px-6 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#111827]/90" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 drop-shadow-lg">
                Bienvenido, <span className="text-[#D4AF37]">{usuario.nombre}</span> 👋
              </h1>
              <p className="text-slate-100 text-sm">
                {esPropietario
                  ? 'Gestiona tus anuncios y conecta con interinos.'
                  : 'Encuentra el alojamiento ideal para tu destino.'}
              </p>
            </div>
            {esPropietario && (
              <button
                onClick={() => navigate('/pisos/nuevo')}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] px-5 py-2.5 rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-md text-sm whitespace-nowrap"
              >
                + Publicar nuevo piso
              </button>
            )}
          </div>

          {/* BARRA DE BÚSQUEDA */}
          <div className="bg-white/96 backdrop-blur-xl rounded-3xl p-3 md:p-4 max-w-3xl shadow-2xl border border-white/40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col items-start px-4 py-2 md:border-r md:border-gray-100">
                <label className="text-xs text-gray-400 font-semibold mb-1">📍 Destino</label>
                <input
                  type="text"
                  placeholder="Ciudad o provincia…"
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                  className="w-full bg-transparent text-gray-900 font-medium focus:outline-none placeholder:text-gray-300 text-sm"
                />
              </div>
              <div className="flex flex-col items-start px-4 py-2 md:border-r md:border-gray-100">
                <label className="text-xs text-gray-400 font-semibold mb-1">⏱️ Estancia</label>
                <select
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  className="w-full bg-transparent text-gray-900 font-medium focus:outline-none text-sm"
                >
                  <option value="">Cualquiera</option>
                  <option value="corta">Corta (días/semanas)</option>
                  <option value="larga">Larga (meses)</option>
                </select>
              </div>
              <button
                onClick={handleBuscar}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] px-5 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-md text-sm"
              >
                🔍 Buscar piso
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-5 text-xs md:text-sm text-slate-100">
            <span>✅ +200 pisos publicados</span>
            <span>🏥 Educación · Sanidad · Justicia</span>
            <span>💶 Sin comisiones</span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── PANEL INQUILINO ── */}
        {esInquilino && (
          <>
            {/* Accesos rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { icono: '🔍', titulo: 'Buscar pisos', desc: 'Encuentra alojamiento en toda España.', ruta: '/pisos' },
                { icono: '🌍', titulo: 'Mundo', desc: 'Comunidad de interinos. Foros, chat y más.', ruta: '/mundo' },
                { icono: '🗺️', titulo: 'Explorar zonas', desc: 'Busca por comunidad, provincia y ciudad.', ruta: '/zonas' },
                { icono: '👤', titulo: 'Mi perfil', desc: 'Edita tus datos y preferencias.', ruta: '/perfil' },
              ].map(item => (
                <button
                  key={item.titulo}
                  onClick={() => navigate(item.ruta)}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3">{item.icono}</div>
                  <h2 className="font-bold text-gray-900 mb-2 group-hover:text-[#0F172A] transition-colors">{item.titulo}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Mundo comunidad */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🌍 MundoInterino — Comunidad</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Conecta con otros interinos de tu sector.</p>
                </div>
                <button onClick={() => navigate('/mundo')} className="text-[#0F172A] text-sm font-bold hover:underline">
                  Ver todo →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icono: '🎓', titulo: 'Educación', desc: 'Interinos, sustituciones y destinos.', ruta: '/mundo/educacion', color: 'from-[#0F172A] to-[#1E3A5F]' },
                  { icono: '🩺', titulo: 'Sanidad', desc: 'Sanitarios, turnos y guardias.', ruta: '/mundo/sanidad', color: 'from-[#1E3A5F] to-[#0F172A]' },
                  { icono: '⚖️', titulo: 'Justicia', desc: 'Juzgados y concursos de destino.', ruta: '/mundo/justicia', color: 'from-[#D4AF37] to-[#B8860B]' },
                  { icono: '🧩', titulo: 'Otros', desc: 'Otras administraciones públicas.', ruta: '/mundointerino', color: 'from-[#334155] to-[#0F172A]' },
                ].map(item => (
                  <button
                    key={item.titulo}
                    onClick={() => navigate(item.ruta)}
                    className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 text-white text-left hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
                  >
                    <div className="text-3xl mb-2">{item.icono}</div>
                    <h3 className="font-bold text-sm mb-1">{item.titulo}</h3>
                    <p className="text-white/80 text-xs leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Zonas destacadas */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">📍 Zonas destacadas</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Accede rápido a las zonas más buscadas.</p>
                </div>
                <button onClick={() => navigate('/zonas')} className="text-[#0F172A] text-sm font-bold hover:underline">
                  Ver todas →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { nombre: 'Zaragoza', emoji: '🏛️', slug: 'aragon/zaragoza/Zaragoza' },
                  { nombre: 'Madrid', emoji: '🏙️', slug: 'madrid/madrid/Madrid' },
                  { nombre: 'Barcelona', emoji: '🌊', slug: 'cataluna/barcelona/Barcelona' },
                  { nombre: 'Sevilla', emoji: '🌇', slug: 'andalucia/sevilla/Sevilla' },
                  { nombre: 'Valencia', emoji: '🍊', slug: 'valencia/valencia/Valencia' },
                  { nombre: 'Málaga', emoji: '🏖️', slug: 'andalucia/malaga/Malaga' },
                ].map(z => (
                  <button
                    key={z.nombre}
                    onClick={() => navigate(`/zonas/${z.slug}`)}
                    className="bg-[#F8F5EF] hover:bg-gray-100 rounded-2xl p-4 text-center border border-gray-100 transition-all shadow-sm"
                  >
                    <div className="text-2xl mb-1">{z.emoji}</div>
                    <div className="font-semibold text-gray-900 text-sm">{z.nombre}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info útil */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icono: '📋', titulo: '¿Cómo funciona?', desc: 'Busca piso, contacta directamente con el propietario y negocia sin intermediarios.', color: 'from-[#0F172A] to-[#1E3A5F]' },
                { icono: '💶', titulo: 'Sin comisiones', desc: 'No cobramos comisión ni al inquilino ni al propietario. Precio directo y justo.', color: 'from-[#D4AF37] to-[#B8860B]' },
                { icono: '🤝', titulo: 'Propietarios verificados', desc: 'Propietarios que entienden la movilidad del interino y ofrecen contratos flexibles.', color: 'from-[#334155] to-[#0F172A]' },
              ].map(item => (
                <div
                  key={item.titulo}
                  className={`bg-gradient-to-br ${item.color} rounded-3xl p-6 text-white`}
                >
                  <div className="text-3xl mb-3">{item.icono}</div>
                  <h3 className="font-bold mb-2">{item.titulo}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PANEL PROPIETARIO ── */}
        {esPropietario && (
          <>
            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Pisos publicados', valor: misPisos.length, icono: '🏠', color: 'from-[#0F172A] to-[#1E3A5F]' },
                { label: 'Disponibles', valor: pisosDisponibles.length, icono: '✅', color: 'from-[#1E3A5F] to-[#0F172A]' },
                { label: 'Pausados', valor: pisosNoDisponibles.length, icono: '⏸️', color: 'from-[#D4AF37] to-[#B8860B]' },
                {
                  label: 'Precio medio',
                  valor: misPisos.length > 0
                    ? `${Math.round(misPisos.reduce((a, p) => a + Number(p.precio), 0) / misPisos.length)}€`
                    : '—',
                  icono: '💶',
                  color: 'from-[#334155] to-[#0F172A]',
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 text-white shadow-sm`}
                >
                  <div className="text-3xl mb-2">{stat.icono}</div>
                  <p className="text-2xl font-bold">{stat.valor}</p>
                  <p className="text-white/80 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Accesos rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icono: '➕', titulo: 'Publicar piso', desc: 'Añade un nuevo anuncio en 3 pasos.', ruta: '/pisos/nuevo' },
                { icono: '🔍', titulo: 'Ver todos los pisos', desc: 'Consulta cómo aparece tu anuncio.', ruta: '/pisos' },
                { icono: '👤', titulo: 'Mi perfil', desc: 'Edita tus datos y preferencias.', ruta: '/perfil' },
              ].map(item => (
                <button
                  key={item.titulo}
                  onClick={() => navigate(item.ruta)}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3">{item.icono}</div>
                  <h2 className="font-bold text-gray-900 mb-2 group-hover:text-[#0F172A] transition-colors">{item.titulo}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Mis pisos */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Mis pisos publicados</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Gestiona disponibilidad, edita y elimina anuncios.</p>
                </div>
                <div className="flex gap-1 bg-[#F8F5EF] rounded-2xl p-1 border border-gray-100">
                  {[['todos', 'Todos'], ['disponibles', 'Disponibles'], ['no-disponibles', 'Pausados']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setTabActiva(val)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        tabActiva === val
                          ? 'bg-[#0F172A] text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {cargando ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-[#F8F5EF] rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : misPisos.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                  <div className="text-4xl mb-3">🏠</div>
                  <p className="text-gray-700 font-bold text-lg">Sin anuncios todavía</p>
                  <p className="text-gray-500 text-sm mt-1 mb-6">
                    Publica tu primer piso para llegar a interinos de toda España.
                  </p>
                  <button
                    onClick={() => navigate('/pisos/nuevo')}
                    className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#1E3A5F] transition-all hover:scale-[1.02] shadow-md"
                  >
                    Publicar mi primer piso
                  </button>
                </div>
              ) : pisosFiltrados.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No hay pisos en esta categoría.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pisosFiltrados.map(piso => (
                    <div
                      key={piso._id}
                      className="bg-[#F8F5EF] rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-gray-900 truncate">{piso.titulo}</h3>
                          <span
                            className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                              piso.disponible
                                ? 'bg-[#D4AF37]/20 text-[#0F172A]'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {piso.disponible ? '✅ Disponible' : '⏸ Pausado'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">
                          📍 {piso.ciudad}{piso.barrio ? `, ${piso.barrio}` : ''} · 💶 {piso.precio}€/mes · 🛏 {piso.habitaciones} hab.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          onClick={() => toggleDisponibilidad(piso._id)}
                          className={`text-xs px-3 py-2 rounded-xl font-bold transition-all hover:scale-[1.02] ${
                            piso.disponible
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-[#D4AF37]/20 text-[#0F172A] hover:bg-[#D4AF37]/30'
                          }`}
                        >
                          {piso.disponible ? '⏸ Pausar' : '▶ Activar'}
                        </button>
                        <button
                          onClick={() => navigate(`/pisos/${piso._id}/editar`)}
                          className="text-xs bg-[#0F172A] text-white hover:bg-[#1E3A5F] px-3 py-2 rounded-xl font-bold transition-all hover:scale-[1.02]"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => navigate(`/pisos/${piso._id}`)}
                          className="text-xs bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl font-bold transition-all"
                        >
                          👁 Ver
                        </button>
                        <button
                          onClick={() => eliminarPiso(piso._id)}
                          className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-2 rounded-xl font-bold transition-all"
                        >
                          🗑 Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* CTA BANNER */}
      <section className="bg-[#0F172A] py-14 px-6 text-center text-white relative overflow-hidden mt-10">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
            backgroundSize: 'cover',
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            ¿Tienes un piso cerca de un hospital, colegio o juzgado?
          </h2>
          <p className="text-slate-100 mb-8 text-base md:text-lg">
            Únete a los propietarios que ya publican en MundoInterino. Publicación gratuita, inquilinos con nómina pública garantizada.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/pisos/nuevo"
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:scale-[1.02] shadow-lg inline-flex items-center justify-center"
            >
              Publicar mi piso gratis
            </Link>
            <Link
              to="/sobre-nosotros"
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all border border-white/20 inline-flex items-center justify-center backdrop-blur-md"
            >
              Saber más
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B1220] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="MundoInterino" className="h-12 object-contain opacity-90" />
            <p className="text-slate-100 text-sm">© 2026 MundoInterino · Tu hogar donde te necesiten</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-100">
            <Link to="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link>
            <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
            <Link to="/pisos/nuevo" className="hover:text-white transition-colors">Publicar piso</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}