import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API = import.meta.env.VITE_API_URL

const ZONAS = [
  {
    nombre: 'Aragón',
    slug: 'aragon',
    emoji: '🏔️',
    desc: 'Tu zona principal: Zaragoza, Huesca y Teruel',
    color: 'from-[#0F172A] to-[#1E3A5F]',
  },
  {
    nombre: 'Andalucía',
    slug: 'andalucia',
    emoji: '🌞',
    desc: 'Sevilla, Málaga, Granada y más provincias',
    color: 'from-[#D4AF37] to-[#B8860B]',
  },
  {
    nombre: 'Más comunidades',
    slug: 'zonas',
    emoji: '🗺️',
    desc: 'Explora todas las zonas disponibles',
    color: 'from-[#334155] to-[#0F172A]',
  },
]

const DESTACADOS = [
  { nombre: 'Zaragoza', comunidad: 'aragon', provincia: 'zaragoza', ciudad: 'Zaragoza', emoji: '🏛️' },
  { nombre: 'Huesca', comunidad: 'aragon', provincia: 'huesca', ciudad: 'Huesca', emoji: '🏔️' },
  { nombre: 'Teruel', comunidad: 'aragon', provincia: 'teruel', ciudad: 'Teruel', emoji: '🌟' },
  { nombre: 'Sevilla', comunidad: 'andalucia', provincia: 'sevilla', ciudad: 'Sevilla', emoji: '🌇' },
  { nombre: 'Málaga', comunidad: 'andalucia', provincia: 'malaga', ciudad: 'Málaga', emoji: '🏖️' },
  { nombre: 'Granada', comunidad: 'andalucia', provincia: 'granada', ciudad: 'Granada', emoji: '⛰️' },
]

// ── Canales de la comunidad Espacio Mundo ──────────────────────────────────
const ESPACIO_MUNDO = [
  {
    icon: '💬',
    titulo: 'Foro de interinos',
    desc: 'Comparte dudas, experiencias y consejos con otros interinos de toda España.',
    slug: 'foro',
    color: 'from-[#1E3A5F] to-[#0F172A]',
    badge: 'Nuevo',
  },
  {
    icon: '📋',
    titulo: 'Tablón de anuncios',
    desc: 'Ofertas de piso, compañeros de piso y oportunidades publicadas por la comunidad.',
    slug: 'tablon',
    color: 'from-[#334155] to-[#1E3A5F]',
    badge: null,
  },
  {
    icon: '🗺️',
    titulo: 'Grupos por zona',
    desc: 'Únete al grupo de WhatsApp o Telegram de tu comunidad autónoma.',
    slug: 'grupos',
    color: 'from-[#B8860B] to-[#D4AF37]',
    badge: '+30 grupos',
  },
  {
    icon: '📰',
    titulo: 'Noticias y convocatorias',
    desc: 'Últimas oposiciones, listas de espera y novedades de la administración pública.',
    slug: 'noticias',
    color: 'from-[#0F172A] to-[#334155]',
    badge: null,
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [ciudad, setCiudad] = useState('')
  const [fecha, setFecha] = useState('')
  const [tipoEstancia, setTipoEstancia] = useState('')
  const [pisosDestacados, setPisosDestacados] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/pisos?limite=6`)
      .then(res => setPisosDestacados(res.data.pisos || []))
      .catch(() => {})
  }, [])

  const handleBuscar = () => {
    navigate(`/pisos?ciudad=${encodeURIComponent(ciudad)}&fecha=${fecha}&tipo=${tipoEstancia}`)
  }

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative text-white pt-8 pb-12 px-6 text-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#111827]/90"></div>

        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight drop-shadow-lg">
            El portal de alquiler
            <br />
            <span className="text-[#D4AF37]">para interinos de la administración</span>
          </h1>

          <p className="text-slate-100 text-sm md:text-base mb-5 max-w-2xl mx-auto leading-relaxed">
            Educación, sanidad, justicia y más. Encuentra piso cerca de tu destino con una experiencia clara, elegante y sin comisiones ocultas.
          </p>

          <div className="bg-white/96 backdrop-blur-xl rounded-3xl p-3 md:p-4 max-w-5xl mx-auto shadow-2xl border border-white/40">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                <label className="text-xs text-gray-400 font-semibold mb-1">📅 Disponible desde</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  className="w-full bg-transparent text-gray-900 font-medium focus:outline-none text-sm"
                />
              </div>

              <div className="flex flex-col items-start px-4 py-2 md:border-r md:border-gray-100">
                <label className="text-xs text-gray-400 font-semibold mb-1">⏱️ Estancia</label>
                <select
                  value={tipoEstancia}
                  onChange={e => setTipoEstancia(e.target.value)}
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
                🔍 Buscar
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <button
              onClick={() => navigate('/pisos')}
              className="bg-white hover:bg-slate-50 text-[#0F172A] font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg border border-white/40 text-sm"
            >
              🔍 Buscar piso
            </button>
            <button
              onClick={() => navigate('/mundointerino')}
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg border border-white/20 backdrop-blur-md text-sm"
            >
              🌍 MundoInterino
            </button>
          </div>

          <div className="flex justify-center gap-6 mt-5 text-xs md:text-sm text-slate-100 flex-wrap">
            <span>✅ +200 pisos publicados</span>
            <span>🏥 Educación · Sanidad · Justicia</span>
            <span>💶 Sin comisiones</span>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ MUNDOINTERINO ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">¿Por qué MundoInterino?</h2>
          <p className="text-gray-500">El portal pensado para interinos de toda la administración pública</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🏥',
              titulo: 'Todos los sectores',
              texto: 'Educación, sanidad, justicia y concertada. Contratos y estancias flexibles.',
            },
            {
              icon: '💶',
              titulo: 'Precios justos',
              texto: 'Más económico que Booking. Sin comisiones ocultas. Negociación directa.',
            },
            {
              icon: '📅',
              titulo: 'Estancia flexible',
              texto: 'Desde un fin de semana hasta todo el curso o contrato. Tú decides.',
            },
            {
              icon: '🗺️',
              titulo: 'Cobertura amplia',
              texto: 'Encuentra pisos en distintas comunidades, provincias y pueblos.',
            },
          ].map(v => (
            <div
              key={v.titulo}
              className="bg-white rounded-3xl p-6 border border-gray-100 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{v.titulo}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUSCA POR ZONA ───────────────────────────────────────────────── */}
      <section className="bg-white py-14 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Busca por zona</h2>
              <p className="text-gray-500">Empieza por comunidad autónoma y baja hasta ciudad o pueblo.</p>
            </div>
            <button
              onClick={() => navigate('/zonas')}
              className="text-[#0F172A] font-semibold hover:underline text-sm"
            >
              Ver todas las zonas →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ZONAS.map(z => (
              <button
                key={z.slug}
                onClick={() => navigate(z.slug === 'zonas' ? '/zonas' : `/zonas/${z.slug}`)}
                className={`bg-gradient-to-br ${z.color} rounded-3xl p-8 text-white cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left`}
              >
                <div className="text-5xl mb-3">{z.emoji}</div>
                <h3 className="text-xl font-bold mb-1">{z.nombre}</h3>
                <p className="text-white/80 text-sm">{z.desc}</p>
                <div className="mt-4 text-white/90 text-sm font-medium">Explorar →</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {DESTACADOS.map(z => (
              <button
                key={z.nombre}
                onClick={() => navigate(`/zonas/${z.comunidad}/${z.provincia}/${encodeURIComponent(z.ciudad)}`)}
                className="bg-[#F8F5EF] hover:bg-gray-100 rounded-2xl p-4 text-left border border-gray-100 transition-all shadow-sm"
              >
                <div className="text-2xl mb-2">{z.emoji}</div>
                <div className="font-semibold text-gray-900">{z.nombre}</div>
                <div className="text-xs text-gray-500 mt-1">Ver pisos en {z.ciudad}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PISOS DISPONIBLES ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 pt-10">
        <div className="flex justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pisos disponibles ahora</h2>
            <p className="text-gray-500 text-sm mt-1">Los más recientes</p>
          </div>
          <button onClick={() => navigate('/pisos')} className="text-[#0F172A] font-semibold hover:underline text-sm">
            Ver todos →
          </button>
        </div>

        {pisosDestacados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pisosDestacados.map(piso => (
              <div
                key={piso._id}
                onClick={() => navigate(`/pisos/${piso._id}`)}
                className="bg-white rounded-3xl shadow-sm hover:shadow-2xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-52 bg-primary-50 overflow-hidden relative">
                  {piso.fotos?.[0] ? (
                    <img
                      src={piso.fotos[0]}
                      alt={piso.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-primary-100">🏠</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        piso.tipoEstancia === 'corta'
                          ? 'bg-[#D4AF37] text-[#0F172A]'
                          : 'bg-[#1E3A5F] text-white'
                      }`}
                    >
                      {piso.tipoEstancia === 'corta' ? '⚡ Corta' : '📅 Larga'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1 leading-snug group-hover:text-[#0F172A] transition-colors">
                    {piso.titulo}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">📍 {piso.ciudad}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-[#0F172A] font-bold text-lg">
                      {piso.precio}€
                      <span className="text-sm font-normal text-gray-400">
                        {piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}
                      </span>
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      🛏 {piso.habitaciones} hab.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">🏠</div>
            <p className="text-gray-500">Cargando pisos disponibles...</p>
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/pisos')}
            className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#1E3A5F] text-lg transition-all hover:scale-[1.02] shadow-lg"
          >
            Ver todos los pisos
          </button>
        </div>
      </section>

      {/* ── ESPACIO MUNDO · COMUNIDAD ────────────────────────────────────── */}
      <section className="bg-white py-16 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">

          {/* Cabecera */}
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#0F172A] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
                🌍 Espacio Mundo
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                La comunidad de los interinos
              </h2>
              <p className="text-gray-500 max-w-xl">
                Mucho más que un portal de pisos. Conecta con miles de interinos, comparte información y mantente al día de todo lo que importa.
              </p>
            </div>
            <button
              onClick={() => navigate('/mundointerino')}
              className="text-[#0F172A] font-semibold hover:underline text-sm whitespace-nowrap"
            >
              Explorar comunidad →
            </button>
          </div>

          {/* Cards de canales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ESPACIO_MUNDO.map(canal => (
              <button
                key={canal.slug}
                onClick={() => navigate(`/mundointerino/${canal.slug}`)}
                className={`bg-gradient-to-br ${canal.color} rounded-3xl p-6 text-white text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
              >
                {canal.badge && (
                  <span className="absolute top-4 right-4 bg-[#D4AF37] text-[#0F172A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {canal.badge}
                  </span>
                )}
                <div className="text-4xl mb-3">{canal.icon}</div>
                <h3 className="font-bold text-base mb-1">{canal.titulo}</h3>
                <p className="text-white/75 text-xs leading-relaxed">{canal.desc}</p>
                <div className="mt-4 text-white/90 text-xs font-semibold group-hover:translate-x-1 transition-transform duration-200">
                  Acceder →
                </div>
              </button>
            ))}
          </div>

          {/* Banner de grupos WhatsApp */}
          <div className="mt-6 bg-gradient-to-r from-[#F8F5EF] to-[#EEE9DF] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📲</div>
              <div>
                <p className="font-bold text-gray-900 text-base">¿Estás en los grupos de WhatsApp de interinos?</p>
                <p className="text-gray-500 text-sm mt-0.5">
                  Miles de compañeros ya comparten pisos, dudas y convocatorias. Únete al grupo de tu zona.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/mundointerino/grupos')}
              className="bg-[#0F172A] hover:bg-[#1E3A5F] text-white font-bold px-7 py-3 rounded-2xl text-sm transition-all hover:scale-[1.02] shadow-md whitespace-nowrap"
            >
              Ver grupos por zona
            </button>
          </div>

          {/* Stats de comunidad */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { valor: '+8.000', label: 'Interinos en la comunidad', icon: '👥' },
              { valor: '+30', label: 'Grupos por comunidad autónoma', icon: '🗺️' },
              { valor: '+500', label: 'Mensajes al día', icon: '💬' },
              { valor: '100%', label: 'Gratuito para interinos', icon: '🎁' },
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-[#F8F5EF] rounded-2xl p-4 text-center border border-gray-100"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-[#0F172A]">{stat.valor}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA PROPIETARIOS ─────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] py-14 px-6 text-center text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
            backgroundSize: 'cover',
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">¿Tienes un piso cerca de un hospital, colegio o juzgado?</h2>
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

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
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