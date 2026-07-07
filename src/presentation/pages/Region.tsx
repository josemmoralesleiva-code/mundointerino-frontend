import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'
import { useProvincias } from '../hooks/useCities'

export default function Region() {
  const navigate = useNavigate()
  const { comunidad } = useParams()
  const { provincias, loading, error } = useProvincias(comunidad as string)

  if (error && !loading && (provincias ?? []).length === 0) {
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
            <span className="text-5xl">📍</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-lg capitalize">
                {comunidad}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Provincias y ciudades donde hay movimiento de pisos para interinos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-xs md:text-sm text-slate-100">
            <span>🏛️ {provincias.length} provincias</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
              ))
            : (provincias ?? []).map(provincia => (
                <button
                  key={provincia.slug}
                  onClick={() => navigate(`/zonas/${comunidad}/${provincia.slug}`)}
                  className="bg-white rounded-3xl border border-gray-100 p-6 text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#0F172A] transition-colors">
                      {provincia.nombre}
                    </h2>
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
