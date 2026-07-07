import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'
import { useComunidades } from '../hooks/useCities'

const COLORES = [
  'from-primary-700 to-primary-900',
  'from-orange-500 to-red-600',
  'from-[#1E3A5F] to-[#0F172A]',
  'from-[#D4AF37] to-[#B8860B]',
  'from-slate-700 to-slate-900',
  'from-teal-700 to-teal-900',
]

export default function Zones() {
  const navigate = useNavigate()
  const { comunidades, loading, error } = useComunidades()

  return (
    <PageLayout>
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
        {error && (
          <div className="text-center text-red-500 bg-red-50 rounded-2xl p-6 mb-6">
            No se pudieron cargar las comunidades. Inténtalo de nuevo más tarde.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 rounded-3xl bg-gray-100 animate-pulse" />
              ))
            : comunidades.map((zona, i) => (
                <button
                  key={zona.slug}
                  onClick={() => navigate(`/zonas/${zona.slug}`)}
                  className={`text-left rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 bg-gradient-to-br ${COLORES[i % COLORES.length]}`}
                >
                  <div className="text-5xl mb-4">📍</div>
                  <h2 className="text-2xl font-bold mb-2">{zona.nombre}</h2>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                    Explorar {zona.nombre} →
                  </div>
                </button>
              ))}
        </div>
      </div>
    </PageLayout>
  )
}
