import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const BLOQUES = [
  {
    titulo: 'Foro',
    icono: '💬',
    descripcion: 'Dudas, destinos, opiniones y experiencias compartidas por la comunidad.',
    ruta: '/mundointerino/foro',
    color: 'from-blue-50 to-blue-100',
    texto: 'text-blue-700',
  },
  {
    titulo: 'Chat',
    icono: '⚡',
    descripcion: 'Conversación rápida por administración, provincia o tema.',
    ruta: '/mundointerino/chat',
    color: 'from-green-50 to-green-100',
    texto: 'text-green-700',
  },
  {
    titulo: 'Permutas',
    icono: '🔁',
    descripcion: 'Intercambio de destinos, pisos o habitaciones entre usuarios.',
    ruta: '/mundointerino/permutas',
    color: 'from-amber-50 to-amber-100',
    texto: 'text-amber-700',
  },
  {
    titulo: 'Compartir coche',
    icono: '🚗',
    descripcion: 'Viajes compartidos, gastos y rutas entre personas del mismo destino.',
    ruta: '/mundointerino/coche',
    color: 'from-purple-50 to-purple-100',
    texto: 'text-purple-700',
  },
  {
    titulo: 'Recursos',
    icono: '📚',
    descripcion: 'Guías, plantillas, checklist, consejos legales y útiles.',
    ruta: '/mundointerino/recursos',
    color: 'from-slate-50 to-slate-100',
    texto: 'text-slate-700',
  },
  {
    titulo: 'Avisos',
    icono: '📢',
    descripcion: 'Novedades, anuncios destacados y publicaciones oficiales.',
    ruta: '/mundointerino/avisos',
    color: 'from-red-50 to-red-100',
    texto: 'text-red-700',
  },
]

const ADMINISTRACIONES = [
  {
    nombre: 'Educación',
    icono: '🎓',
    descripcion: 'Interinos, sustituciones, destinos, vivienda y cambios de provincia.',
    ruta: '/mundointerino/educacion',
  },
  {
    nombre: 'Sanidad',
    icono: '🩺',
    descripcion: 'Profesionales sanitarios, turnos, guardias y alojamiento temporal.',
    ruta: '/mundointerino/sanidad',
  },
  {
    nombre: 'Justicia',
    icono: '⚖️',
    descripcion: 'Juzgados, desplazamientos, concursos y estancias por destino.',
    ruta: '/mundointerino/justicia',
  },
  {
    nombre: 'Otros',
    icono: '🧩',
    descripcion: 'Otras administraciones y colectivos con movilidad laboral.',
    ruta: '/mundointerino/otros',
  },
]

export default function MundoInterino() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm mb-4">
              🌍 Comunidad profesional
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              MundoInterino
            </h1>
            <p className="mt-5 text-primary-100 text-lg max-w-2xl">
              Un espacio para conectar a docentes, sanitarios, personal de justicia y otros profesionales que se mueven por destino.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/mundointerino/educacion')}
                className="bg-white text-primary-800 px-5 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all"
              >
                Entrar por administración
              </button>
              <button
                onClick={() => navigate('/pisos')}
                className="border border-white/20 bg-white/10 text-white px-5 py-3 rounded-xl font-semibold hover:bg-white/15 transition-all"
              >
                Buscar alojamiento
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADMINISTRACIONES.map(admin => (
            <button
              key={admin.nombre}
              onClick={() => navigate(admin.ruta)}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="text-3xl mb-3">{admin.icono}</div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">{admin.nombre}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{admin.descripcion}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Espacios de la comunidad</h2>
            <p className="text-gray-500 text-sm mt-1">
              Todo lo que necesitas para organizar tu movilidad y conectar con gente en tu misma situación.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {BLOQUES.map(b => (
            <button
              key={b.titulo}
              onClick={() => navigate(b.ruta)}
              className={`bg-gradient-to-br ${b.color} rounded-3xl border border-gray-100 p-6 text-left hover:shadow-md transition-all group`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`text-3xl mb-3 ${b.texto}`}>{b.icono}</div>
                  <h3 className="text-lg font-bold text-gray-800">{b.titulo}</h3>
                </div>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{b.descripcion}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">¿Qué podrás hacer aquí?</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Mundo nace para ser la capa social de MundoInterino: una comunidad para compartir información útil,
                encontrar personas en tu misma zona, organizar viajes, resolver dudas y publicar recursos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Foros por tema y administración.',
                  'Chats rápidos y grupos de apoyo.',
                  'Permutas y cambios de destino.',
                  'Compartir coche y gastos.',
                  'Recursos, guías y plantillas.',
                  'Avisos relevantes y moderación.',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                    <span className="text-primary-700">✓</span>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-50 rounded-3xl p-6 border border-primary-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Primer MVP</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li>• Página principal por administración.</li>
                <li>• Foro básico con categorías.</li>
                <li>• Chat general por colectivo.</li>
                <li>• Sección de permutas.</li>
                <li>• Panel de avisos destacados.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}