import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

const DATA = {
  aragon: {
    nombre: 'Aragón',
    emoji: '🏔️',
    descripcion: 'Provincias y ciudades donde hay más movimiento de pisos para interinos.',
    provincias: [
      { slug: 'zaragoza', nombre: 'Zaragoza', ciudades: ['Zaragoza', 'Calatayud', 'Ejea de los Caballeros', 'Tarazona'] },
      { slug: 'huesca', nombre: 'Huesca', ciudades: ['Huesca', 'Jaca', 'Fraga', 'Monzón'] },
      { slug: 'teruel', nombre: 'Teruel', ciudades: ['Teruel', 'Alcañiz', 'Andorra', 'Bajo Aragón'] },
    ],
  },
  andalucia: {
    nombre: 'Andalucía',
    emoji: '🌞',
    descripcion: 'Gran volumen de demanda en capitales y pueblos de destino interino.',
    provincias: [
      { slug: 'sevilla', nombre: 'Sevilla', ciudades: ['Sevilla', 'Écija', 'Utrera', 'Carmona'] },
      { slug: 'malaga', nombre: 'Málaga', ciudades: ['Málaga', 'Marbella', 'Vélez-Málaga', 'Antequera'] },
      { slug: 'granada', nombre: 'Granada', ciudades: ['Granada', 'Motril', 'Baza', 'Guadix'] },
      { slug: 'cordoba', nombre: 'Córdoba', ciudades: ['Córdoba', 'Lucena', 'Puente Genil', 'Priego de Córdoba'] },
      { slug: 'cadiz', nombre: 'Cádiz', ciudades: ['Cádiz', 'Jerez de la Frontera', 'Algeciras', 'San Fernando'] },
      { slug: 'huelva', nombre: 'Huelva', ciudades: ['Huelva', 'Lepe', 'Moguer', 'Isla Cristina'] },
      { slug: 'jaen', nombre: 'Jaén', ciudades: ['Jaén', 'Linares', 'Úbeda', 'Andújar'] },
      { slug: 'almeria', nombre: 'Almería', ciudades: ['Almería', 'El Ejido', 'Roquetas de Mar', 'Níjar'] },
    ],
  },
}

export default function Comunidad() {
  const navigate = useNavigate()
  const { comunidad } = useParams()
  const info = DATA[comunidad]

  if (!info) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-gray-900">Comunidad no encontrada</h1>
          <p className="text-gray-500 mt-2 mb-6">La zona que buscas no está disponible todavía.</p>
          <button
            onClick={() => navigate('/zonas')}
            className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#1E3A5F] transition-all shadow-md"
          >
            ← Volver a zonas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      {/* HERO */}
      <section className="bg-[#0F172A] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/zonas')}
            className="text-sm text-slate-300 hover:text-white mb-3 inline-block transition-colors"
          >
            ← Volver a zonas
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{info.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold">{info.nombre}</h1>
              <p className="text-slate-300 text-sm mt-1">{info.descripcion}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROVINCIAS */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {info.provincias.map(provincia => (
            <button
              key={provincia.slug}
              onClick={() => navigate(`/zonas/${comunidad}/${provincia.slug}`)}
              className="bg-white rounded-3xl border border-gray-100 p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#0F172A] transition-colors">
                  {provincia.nombre}
                </h2>
                <span className="text-xs bg-[#F8F5EF] text-slate-500 px-2 py-1 rounded-full border border-gray-100">
                  {provincia.ciudades.length} zonas
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {provincia.ciudades.slice(0, 4).map(c => (
                  <span
                    key={c}
                    className="bg-[#F8F5EF] text-slate-600 text-xs px-3 py-1 rounded-full border border-gray-100"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="text-[#2F5DAA] text-sm font-semibold">
                Ver pisos en {provincia.nombre} →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}