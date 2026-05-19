import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const PANELES = [
  {
    titulo: 'Foro de Justicia',
    icono: '💬',
    descripcion: 'Dudas sobre destinos, juzgados, vivienda, movilidad y cambios de sede.',
    ruta: '/mundo/justicia/foro',
    color: 'from-blue-50 to-blue-100',
    texto: 'text-blue-700',
  },
  {
    titulo: 'Chat general',
    icono: '⚡',
    descripcion: 'Conversación rápida para personal de justicia en tiempo real.',
    ruta: '/mundo/justicia/chat',
    color: 'from-green-50 to-green-100',
    texto: 'text-green-700',
  },
  {
    titulo: 'Permutas',
    icono: '🔁',
    descripcion: 'Intercambia destino, alojamiento o información con otros compañeros.',
    ruta: '/mundo/justicia/permutas',
    color: 'from-amber-50 to-amber-100',
    texto: 'text-amber-700',
  },
  {
    titulo: 'Compartir coche',
    icono: '🚗',
    descripcion: 'Encuentra compañeros para rutas, gasolina y desplazamientos.',
    ruta: '/mundo/justicia/coche',
    color: 'from-purple-50 to-purple-100',
    texto: 'text-purple-700',
  },
  {
    titulo: 'Recursos',
    icono: '📚',
    descripcion: 'Guías, checklist, modelos de documentos y consejos útiles.',
    ruta: '/mundo/justicia/recursos',
    color: 'from-slate-50 to-slate-100',
    texto: 'text-slate-700',
  },
  {
    titulo: 'Avisos',
    icono: '📢',
    descripcion: 'Novedades, alertas y publicaciones destacadas para justicia.',
    ruta: '/mundo/justicia/avisos',
    color: 'from-red-50 to-red-100',
    texto: 'text-red-700',
  },
]

const DESTACADOS = [
  'Destinos por ciudad, partido judicial o sede.',
  'Vivienda temporal para traslados y estancias cortas.',
  'Comunidad útil para compartir experiencias reales.',
  'Espacio pensado para movilidad profesional en justicia.',
]

export default function Justicia() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/mundo')}
            className="text-sm text-primary-100 hover:text-white mb-4 inline-flex items-center gap-1"
          >
            ← Volver a Mundo
          </button>

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm mb-4">
            ⚖️ Administración
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Justicia
          </h1>

          <p className="mt-5 text-primary-100 text-lg max-w-2xl">
            Un espacio para profesionales de justicia que necesitan alojamiento, apoyo, conversación y recursos útiles.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {PANELES.map(panel => (
            <button
              key={panel.titulo}
              onClick={() => navigate(panel.ruta)}
              className={`bg-gradient-to-br ${panel.color} rounded-3xl border border-gray-100 p-6 text-left hover:shadow-md transition-all group`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`text-3xl mb-3 ${panel.texto}`}>{panel.icono}</div>
                  <h2 className="text-lg font-bold text-gray-800">{panel.titulo}</h2>
                </div>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{panel.descripcion}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Qué encontrarás aquí</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DESTACADOS.map(item => (
                <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                  <span className="text-primary-700">✓</span>
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-50 rounded-3xl border border-primary-100 p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Inicio rápido</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>• Busca alojamiento por zona.</li>
              <li>• Entra al foro para resolver dudas.</li>
              <li>• Usa el chat para contactar rápido.</li>
              <li>• Mira permutas y coche compartido.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}