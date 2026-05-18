import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

const DATA = {
  aragon: {
    nombre: 'Aragón',
    descripcion: 'Provincias y ciudades donde hay más movimiento de pisos para docentes.',
    provincias: [
      { slug: 'zaragoza', nombre: 'Zaragoza', ciudades: ['Zaragoza', 'Calatayud', 'Ejea de los Caballeros', 'Tarazona'] },
      { slug: 'huesca', nombre: 'Huesca', ciudades: ['Huesca', 'Jaca', 'Fraga', 'Monzón'] },
      { slug: 'teruel', nombre: 'Teruel', ciudades: ['Teruel', 'Alcañiz', 'Andorra', 'Bajo Aragón'] },
    ],
  },
  andalucia: {
    nombre: 'Andalucía',
    descripcion: 'Gran volumen de demanda en capitales y pueblos de destino docente.',
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Comunidad no encontrada</h1>
          <button
            onClick={() => navigate('/zonas')}
            className="mt-6 bg-primary-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Volver a zonas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate('/zonas')} className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver a zonas
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">{info.nombre}</h1>
          <p className="text-gray-500 mt-2">{info.descripcion}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {info.provincias.map(provincia => (
            <button
              key={provincia.slug}
              onClick={() => navigate(`/zonas/${comunidad}/${provincia.slug}`)}
              className="bg-white rounded-3xl border border-gray-100 p-6 text-left hover:shadow-lg transition-all"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{provincia.nombre}</h2>
              <p className="text-gray-500 text-sm mb-4">
                {provincia.ciudades.length} ciudades y pueblos disponibles
              </p>
              <div className="flex flex-wrap gap-2">
                {provincia.ciudades.slice(0, 4).map(c => (
                  <span key={c} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}