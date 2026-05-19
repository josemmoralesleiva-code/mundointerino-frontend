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
    color: 'from-blue-500 to-primary-700'
  },
  {
    nombre: 'Andalucía',
    slug: 'andalucia',
    emoji: '🌞',
    desc: 'Sevilla, Málaga, Granada y más provincias',
    color: 'from-orange-500 to-red-600'
  },
  {
    nombre: 'Más comunidades',
    slug: 'zonas',
    emoji: '🗺️',
    desc: 'Explora todas las zonas disponibles',
    color: 'from-green-500 to-emerald-700'
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO */}
      <section
        className="relative text-white py-24 px-6 text-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary-900 opacity-75"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
            El portal de alquiler<br />
            {/* ✏️ CAMBIO: ampliado a toda la administración */}
            <span className="text-accent-400">para interinos de la administración</span>
          </h1>
          {/* ✏️ CAMBIO: descripción más inclusiva */}
          <p className="text-primary-100 text-lg mb-10 drop-shadow">
            Educación, sanidad, justicia y más. Encuentra piso cerca de tu destino rápidamente. Precios justos, estancias cortas o largas.
          </p>

          <div className="bg-white rounded-2xl p-3 max-w-4xl mx-auto flex flex-col md:flex-row gap-2 shadow-2xl">
            <div className="flex-1 flex flex-col items-start px-3 py-1 border-r border-gray-100">
              <label className="text-xs text-gray-400 font-medium">📍 Destino</label>
              <input
                type="text"
                placeholder="Ciudad o provincia…"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                className="w-full text-gray-800 font-medium focus:outline-none placeholder-gray-300 text-sm"
              />
            </div>
            <div className="flex flex-col items-start px-3 py-1 border-r border-gray-100">
              <label className="text-xs text-gray-400 font-medium">📅 Disponible desde</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="text-gray-800 font-medium focus:outline-none text-sm"
              />
            </div>
            <div className="flex flex-col items-start px-3 py-1">
              <label className="text-xs text-gray-400 font-medium">⏱️ Estancia</label>
              <select
                value={tipoEstancia}
                onChange={e => setTipoEstancia(e.target.value)}
                className="text-gray-800 font-medium focus:outline-none text-sm bg-transparent"
              >
                <option value="">Cualquiera</option>
                <option value="corta">Corta (días/semanas)</option>
                <option value="larga">Larga (meses)</option>
              </select>
            </div>
            <button
              onClick={handleBuscar}
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-md"
            >
              🔍 Buscar
            </button>
          </div>

          {/* ✏️ CAMBIO: estadísticas actualizadas y público ampliado */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-primary-100 flex-wrap">
            <span>✅ +200 pisos publicados</span>
            <span>🏥 Educación · Sanidad · Justicia</span>
            <span>💶 Sin comisiones</span>
          </div>
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        {/* ✏️ CAMBIO: título y subtítulo */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">¿Por qué Repla?</h2>
        <p className="text-gray-400 text-center mb-10">El portal pensado para interinos de toda la administración pública</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🏥',
              // ✏️ CAMBIO: de "Solo para docentes" a todos los sectores
              titulo: 'Todos los sectores',
              texto: 'Educación, sanidad, justicia y concertada. Propietarios que entienden tus necesidades: contratos flexibles.',
              color: 'bg-blue-50'
            },
            {
              icon: '💶',
              titulo: 'Precios justos',
              texto: 'Más económico que Booking. Sin comisiones ocultas. Negociación directa.',
              color: 'bg-green-50'
            },
            {
              icon: '📅',
              titulo: 'Estancia flexible',
              texto: 'Desde un fin de semana hasta todo el curso o contrato. Tú decides cuánto tiempo.',
              color: 'bg-yellow-50'
            },
            {
              icon: '🗺️',
              titulo: 'Cobertura amplia',
              texto: 'Encuentra pisos en distintas comunidades, provincias y pueblos.',
              color: 'bg-purple-50'
            },
          ].map(v => (
            <div key={v.titulo} className={`${v.color} rounded-2xl p-6 border border-gray-100 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{v.titulo}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ZONAS */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Busca por zona</h2>
              <p className="text-gray-400">Empieza por comunidad autónoma y baja hasta ciudad o pueblo.</p>
            </div>
            <button
              onClick={() => navigate('/zonas')}
              className="text-primary-700 font-semibold hover:underline text-sm"
            >
              Ver todas las zonas →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ZONAS.map(z => (
              <button
                key={z.slug}
                onClick={() => navigate(z.slug === 'zonas' ? '/zonas' : `/zonas/${z.slug}`)}
                className={`bg-gradient-to-br ${z.color} rounded-2xl p-8 text-white cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left`}
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
                className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left border border-gray-100 transition-all"
              >
                <div className="text-2xl mb-2">{z.emoji}</div>
                <div className="font-semibold text-gray-800">{z.nombre}</div>
                <div className="text-xs text-gray-500 mt-1">Ver pisos en {z.ciudad}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PISOS DESTACADOS */}
      <section className="max-w-5xl mx-auto px-6 pb-16 pt-8">
        <div className="flex justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Pisos disponibles ahora</h2>
            <p className="text-gray-400 text-sm mt-1">Los más recientes</p>
          </div>
          <button onClick={() => navigate('/pisos')} className="text-primary-700 font-semibold hover:underline text-sm">
            Ver todos →
          </button>
        </div>

        {pisosDestacados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pisosDestacados.map(piso => (
              <div
                key={piso._id}
                onClick={() => navigate(`/pisos/${piso._id}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-48 bg-primary-50 overflow-hidden relative">
                  {piso.fotos?.[0] ? (
                    <img src={piso.fotos[0]} alt={piso.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-primary-100">🏠</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      piso.tipoEstancia === 'corta' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'
                    }`}>
                      {piso.tipoEstancia === 'corta' ? '⚡ Corta' : '📅 Larga'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 leading-snug group-hover:text-primary-700 transition-colors">{piso.titulo}</h3>
                  <p className="text-gray-400 text-sm mb-3">📍 {piso.ciudad}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-700 font-bold text-lg">
                      {piso.precio}€
                      <span className="text-sm font-normal text-gray-400">{piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}</span>
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">🛏 {piso.habitaciones} hab.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">🏠</div>
            <p className="text-gray-400">Cargando pisos disponibles...</p>
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/pisos')}
            className="bg-primary-700 text-white px-10 py-4 rounded-xl font-bold hover:bg-primary-800 text-lg transition-all hover:scale-105 shadow-md"
          >
            Ver todos los pisos
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 py-16 px-6 text-center text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)', backgroundSize: 'cover' }}
        />
        <div className="relative max-w-3xl mx-auto">
          {/* ✏️ CAMBIO: CTA más inclusivo */}
          <h2 className="text-3xl font-bold mb-3">¿Tienes un piso cerca de un hospital, colegio o juzgado?</h2>
          <p className="text-primary-100 mb-8 text-lg">
            Únete a los propietarios que ya publican en Repla. Publicación gratuita, inquilinos con nómina pública garantizada.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/pisos/nuevo"
              className="bg-accent-500 hover:bg-accent-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg inline-flex items-center justify-center"
            >
              Publicar mi piso gratis
            </Link>
            <Link
              to="/sobre-nosotros"
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all border border-white/30 inline-flex items-center justify-center"
            >
              Saber más
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary-900 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {/* ✏️ CAMBIO: alt y texto del footer */}
            <img src="/img/logo.png" alt="Repla" className="h-8 brightness-0 invert opacity-70" />
            <p className="text-primary-100 text-sm">© 2026 Repla · Tu hogar donde te necesiten</p>
          </div>
          <div className="flex gap-6 text-sm text-primary-100">
            <Link to="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link>
            <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
            <Link to="/pisos/nuevo" className="hover:text-white transition-colors">Publicar piso</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}