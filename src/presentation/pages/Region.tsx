import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'

const DATA: Record<string, {
  nombre: string
  emoji: string
  descripcion: string
  color: string
  provincias: { slug: string; nombre: string; emoji: string; ciudades: string[] }[]
}> = {
  aragon: {
    nombre: 'Aragón',
    emoji: '🏔️',
    descripcion: 'Provincias y ciudades donde hay más movimiento de pisos para interinos.',
    color: 'from-[#0F172A] to-[#1E3A5F]',
    provincias: [
      { slug: 'zaragoza', nombre: 'Zaragoza', emoji: '🏛️', ciudades: ['Zaragoza', 'Calatayud', 'Ejea de los Caballeros', 'Tarazona'] },
      { slug: 'huesca', nombre: 'Huesca', emoji: '🏔️', ciudades: ['Huesca', 'Jaca', 'Fraga', 'Monzón'] },
      { slug: 'teruel', nombre: 'Teruel', emoji: '🌟', ciudades: ['Teruel', 'Alcañiz', 'Andorra', 'Bajo Aragón'] },
    ],
  },
  andalucia: {
    nombre: 'Andalucía',
    emoji: '🌞',
    descripcion: 'Gran volumen de demanda en capitales y pueblos de destino interino.',
    color: 'from-[#D4AF37] to-[#B8860B]',
    provincias: [
      { slug: 'sevilla', nombre: 'Sevilla', emoji: '🌇', ciudades: ['Sevilla', 'Écija', 'Utrera', 'Carmona'] },
      { slug: 'malaga', nombre: 'Málaga', emoji: '🏖️', ciudades: ['Málaga', 'Marbella', 'Vélez-Málaga', 'Antequera'] },
      { slug: 'granada', nombre: 'Granada', emoji: '⛰️', ciudades: ['Granada', 'Motril', 'Baza', 'Guadix'] },
      { slug: 'cordoba', nombre: 'Córdoba', emoji: '🕌', ciudades: ['Córdoba', 'Lucena', 'Puente Genil', 'Priego de Córdoba'] },
      { slug: 'cadiz', nombre: 'Cádiz', emoji: '⚓', ciudades: ['Cádiz', 'Jerez de la Frontera', 'Algeciras', 'San Fernando'] },
      { slug: 'huelva', nombre: 'Huelva', emoji: '🌊', ciudades: ['Huelva', 'Lepe', 'Moguer', 'Isla Cristina'] },
      { slug: 'jaen', nombre: 'Jaén', emoji: '🫒', ciudades: ['Jaén', 'Linares', 'Úbeda', 'Andújar'] },
      { slug: 'almeria', nombre: 'Almería', emoji: '☀️', ciudades: ['Almería', 'El Ejido', 'Roquetas de Mar', 'Níjar'] },
    ],
  },
}

export default function Region() {
  const navigate = useNavigate()
  const { comunidad } = useParams()
  const info = DATA[comunidad as string]

  if (!info) {
    return (
      <PageLayout>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-gray-900">Comunidad no encontrada</h1>
          <p className="text-gray-500 mt-2 mb-6">La zona que buscas no está disponible todavía.</p>
          <button
            onClick={() => navigate('/zonas')}
            className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#1E3A5F] transition-all hover:scale-[1.02] shadow-md"
          >
            ← Volver a zonas
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Navbar />

      <section
        className="relative text-white py-10 px-6 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#111827]/90" />
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/zonas')}
            className="text-sm text-slate-300 hover:text-white mb-4 inline-flex items-center gap-1 transition-colors"
          >
            ← Volver a zonas
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{info.emoji}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-lg">
                {info.nombre}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">{info.descripcion}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-xs md:text-sm text-slate-100">
            <span>🏛️ {info.provincias.length} provincias</span>
            <span>📍 {info.provincias.reduce((acc, p) => acc + p.ciudades.length, 0)} ciudades</span>
            <span>💶 Sin comisiones</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Elige tu provincia
          </h2>
          <p className="text-gray-500 text-sm">
            Selecciona una provincia para ver ciudades y pisos disponibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {info.provincias.map(provincia => (
            <button
              key={provincia.slug}
              onClick={() => navigate(`/zonas/${comunidad}/${provincia.slug}`)}
              className="bg-white rounded-3xl border border-gray-100 p-6 text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{provincia.emoji}</span>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#0F172A] transition-colors">
                    {provincia.nombre}
                  </h2>
                </div>
                <span className="text-xs bg-[#F8F5EF] text-slate-500 px-3 py-1 rounded-full border border-gray-100 shrink-0">
                  {provincia.ciudades.length} zonas
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {provincia.ciudades.slice(0, 4).map(c => (
                  <span
                    key={c}
                    className="bg-[#F8F5EF] text-slate-600 text-xs px-3 py-1 rounded-full border border-gray-100"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#0F172A] text-sm font-bold group-hover:underline transition-all">
                  Ver pisos en {provincia.nombre} →
                </span>
                <span className="text-xs bg-[#D4AF37]/10 text-[#0F172A] px-2 py-1 rounded-full font-medium border border-[#D4AF37]/20">
                  🏠 Disponibles
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
