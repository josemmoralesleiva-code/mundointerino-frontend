import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'
import CityAutocomplete from '../components/ui/CityAutocomplete'
import PageLayout from '../components/layout/PageLayout'
import { useProperties } from '../hooks/useProperties'
import { useComunidades } from '../hooks/useCities'
import type { City } from '../../domain/models/City'

const ZONAS = [
  {
    nombre: 'Aragón',
    slug: 'aragon',
    emoji: '🏔️',
    desc: 'Tu zona principal: Zaragoza, Huesca y Teruel',
    color: 'from-primary-700 to-primary-900',
  },
  {
    nombre: 'Andalucía',
    slug: 'andalucia',
    emoji: '🌞',
    desc: 'Sevilla, Málaga, Granada y más provincias',
    color: 'from-accent-400 to-accent-600',
  },
  {
    nombre: 'Más comunidades',
    slug: 'zonas',
    emoji: '🗺️',
    desc: 'Explora todas las zonas disponibles',
    color: 'from-gray-600 to-primary-800',
  },
]



export default function Home() {
  const navigate = useNavigate()
  const [ciudad, setCiudad] = useState('')
  const [fecha, setFecha] = useState('')
  const [tipoEstancia, setTipoEstancia] = useState('')
  const { properties: pisosDestacados, fetchAll } = useProperties()
  const { comunidades } = useComunidades()

  useEffect(() => {
    fetchAll({ limite: '6' })
  }, [])

  const handleBuscar = () => {
    navigate(`/pisos?ciudad=${encodeURIComponent(ciudad)}&fecha=${fecha}&tipo=${tipoEstancia}`)
  }

  const onSelectCiudad = (city: City | null) => setCiudad(city?.nombre ?? '')

  const destacar = (comunidades || []).slice(0, 6).map(c => ({
    nombre: c.nombre,
    slug: c.slug,
    emoji: '📍',
  }))

  return (
    <PageLayout>
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
        <div className="absolute inset-0 bg-primary-900/90"></div>

        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight drop-shadow-lg">
            El portal de alquiler
            <br />
            <span className="text-accent-400">para interinos de la administración</span>
          </h1>

          <p className="text-slate-100 text-sm md:text-base mb-5 max-w-2xl mx-auto leading-relaxed">
            Educación, sanidad, justicia y más. Encuentra piso cerca de tu destino con una experiencia clara, elegante y sin comisiones ocultas.
          </p>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 md:p-4 max-w-5xl mx-auto shadow-2xl border border-white/40">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col items-start px-4 py-2 md:border-r md:border-gray-100">
                <label className="text-xs text-gray-400 font-semibold mb-1">📍 Destino</label>
                <CityAutocomplete
                  value={ciudad}
                  onChange={onSelectCiudad}
                  placeholder="Ciudad o provincia…"
                />
              </div>

              <div className="flex flex-col items-start px-4 py-2 md:border-r md:border-gray-100">
                <label className="text-xs text-gray-400 font-semibold mb-1">📅 Disponible desde</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  className="w-full bg-transparent text-gray-900 font-medium focus:outline-none text-sm [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
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
                className="bg-accent-500 hover:bg-accent-600 text-primary-900 px-5 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-md text-sm"
              >
                🔍 Buscar
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <button
              onClick={() => navigate('/pisos')}
              className="bg-white hover:bg-slate-50 text-primary-900 font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg border border-white/40 text-sm"
            >
              🔍 Buscar piso
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
              texto: 'Más económico que las plataformas tradicionales. Sin comisiones ocultas. Negociación directa.',
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
              className="text-primary-900 font-semibold hover:underline text-sm"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {destacar.length > 0 ? destacar.map(z => (
              <button
                key={z.slug}
                onClick={() => navigate(`/pisos?ciudad=${encodeURIComponent(z.nombre)}`)}
                className="bg-primary-50 hover:bg-primary-100 rounded-2xl p-4 text-left border border-primary-100 transition-all shadow-sm"
              >
                <div className="text-2xl mb-2">{z.emoji}</div>
                <div className="font-semibold text-gray-900">{z.nombre}</div>
                <div className="text-xs text-gray-500 mt-1">Ver pisos en esta comunidad</div>
              </button>
            )) : Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-primary-50 rounded-2xl p-4 border border-primary-100 animate-pulse h-24" />
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
          <button onClick={() => navigate('/pisos')} className="text-primary-900 font-semibold hover:underline text-sm">
            Ver todos →
          </button>
        </div>

        {pisosDestacados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pisosDestacados.map(piso => (
              <PropertyCard key={piso.id} property={piso} />
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
            className="bg-primary-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-800 text-lg transition-all hover:scale-[1.02] shadow-lg"
          >
            Ver todos los pisos
          </button>
        </div>
      </section>
    </PageLayout>
  )
}
