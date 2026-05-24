import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ZONAS = [
  {
    slug: 'aragon',
    nombre: 'Aragón',
    descripcion: 'Zona principal de Mundointerino para docentes interinos.',
    color: 'from-primary-700 to-primary-900',
    icono: '🏔️',
  },
  {
    slug: 'andalucia',
    nombre: 'Andalucía',
    descripcion: 'Gran demanda de alojamiento en ciudades y pueblos.',
    color: 'from-orange-500 to-red-600',
    icono: '🌞',
  },
]

export default function Zonas() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Explora por zonas</h1>
          <p className="text-primary-100 mt-2">
            Elige una comunidad autónoma y descubre sus provincias, ciudades y pueblos.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ZONAS.map(zona => (
            <button
              key={zona.slug}
              onClick={() => navigate(`/zonas/${zona.slug}`)}
              className={`text-left rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 bg-gradient-to-br ${zona.color}`}
            >
              <div className="text-5xl mb-4">{zona.icono}</div>
              <h2 className="text-2xl font-bold mb-2">{zona.nombre}</h2>
              <p className="text-white/85">{zona.descripcion}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                Explorar {zona.nombre} →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}