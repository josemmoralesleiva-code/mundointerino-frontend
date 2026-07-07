import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'
import { searchCitiesUseCase } from '../../application/useCases/cities'
import type { City } from '../../domain/models/City'

export default function Province() {
  const navigate = useNavigate()
  const { comunidad, provincia } = useParams()
  const [ciudades, setCiudades] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!comunidad || !provincia) {
      setCiudades([])
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    searchCitiesUseCase({ comunidad, provincia, limit: 100 }, controller.signal)
      .then(setCiudades)
      .catch(() => setCiudades([]))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [comunidad, provincia])

  return (
    <PageLayout>
      <Navbar />

      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(`/zonas/${comunidad}`)} className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver a la comunidad
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mt-2 capitalize">{provincia}</h1>
          <p className="text-gray-500 mt-2">Selecciona una ciudad o pueblo para ver pisos disponibles para interinos.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : ciudades.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">No hay ciudades disponibles para esta provincia</h2>
            <button
              onClick={() => navigate(`/zonas/${comunidad}`)}
              className="mt-6 bg-primary-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Volver a la comunidad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ciudades.map(ciudad => (
              <button
                key={ciudad.slug}
                onClick={() => navigate(`/zonas/${comunidad}/${provincia}/${encodeURIComponent(ciudad.slug)}`)}
                className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-lg transition-all"
              >
                <h2 className="text-lg font-bold text-gray-800">{ciudad.nombre}</h2>
                <p className="text-gray-500 text-sm mt-1">Ver pisos en esta zona</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}