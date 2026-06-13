import { useNavigate, Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'

const BLOQUES = [
  {
    titulo: 'Foro',
    icono: '💬',
    descripcion: 'Dudas, destinos, opiniones y experiencias compartidas por la comunidad.',
    ruta: '/mundo/foro',
    color: 'from-[#0F172A] to-[#1E3A5F]',
  },
  {
    titulo: 'Chat',
    icono: '⚡',
    descripcion: 'Conversación rápida por administración, provincia o tema.',
    ruta: '/mundo/chat',
    color: 'from-[#1E3A5F] to-[#0F172A]',
  },
  {
    titulo: 'Permutas',
    icono: '🔁',
    descripcion: 'Intercambio de destinos, pisos o habitaciones entre usuarios.',
    ruta: '/mundo/permutas',
    color: 'from-[#D4AF37] to-[#B8860B]',
  },
  {
    titulo: 'Compartir coche',
    icono: '🚗',
    descripcion: 'Viajes compartidos, gastos y rutas entre personas del mismo destino.',
    ruta: '/mundo/coche',
    color: 'from-[#334155] to-[#0F172A]',
  },
  {
    titulo: 'Recursos',
    icono: '📚',
    descripcion: 'Guías, plantillas, checklist, consejos legales y útiles.',
    ruta: '/mundo/recursos',
    color: 'from-[#0F172A] to-[#334155]',
  },
  {
    titulo: 'Avisos',
    icono: '📢',
    descripcion: 'Novedades, anuncios destacados y publicaciones oficiales.',
    ruta: '/mundo/avisos',
    color: 'from-[#B8860B] to-[#D4AF37]',
  },
]

const ADMINISTRACIONES = [
  {
    nombre: 'Educación',
    icono: '🎓',
    descripcion: 'Interinos, sustituciones, destinos, vivienda y cambios de provincia.',
    ruta: '/mundo/educacion',
  },
  {
    nombre: 'Sanidad',
    icono: '🩺',
    descripcion: 'Profesionales sanitarios, turnos, guardias y alojamiento temporal.',
    ruta: '/mundo/sanidad',
  },
  {
    nombre: 'Justicia',
    icono: '⚖️',
    descripcion: 'Juzgados, desplazamientos, concursos y estancias por destino.',
    ruta: '/mundo/justicia',
  },
  {
    nombre: 'Otros',
    icono: '🧩',
    descripcion: 'Otras administraciones y colectivos con movilidad laboral.',
    ruta: '/mundo/otros',
  },
]

export default function Community() {
  const navigate = useNavigate()
  const location = useLocation()
  const accesoDenegado = location.state?.accesoDenegado

  return (
    <PageLayout>
      <Navbar />

      {accesoDenegado && (
        <div className="bg-red-50 border-b border-red-100 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold text-red-800 text-sm">Acceso restringido</p>
              <p className="text-red-600 text-xs mt-0.5">
                Esa sección es exclusiva para interinos de ese sector. Accede al espacio de tu administración.
              </p>
            </div>
          </div>
        </div>
      )}

      <section
        className="relative text-white pt-8 pb-12 px-6 text-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#111827]/90" />
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs mb-4 border border-white/20 backdrop-blur-md">
            🌍 Comunidad profesional
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight drop-shadow-lg">
            El espacio de{' '}
            <span className="text-[#D4AF37]">la comunidad interina</span>
          </h1>
          <p className="text-slate-100 text-sm md:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
            Conecta con docentes, sanitarios, personal de justicia y otros profesionales
            que se mueven por destino. Foro, chat, permutas y mucho más.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/mundo/educacion')}
              className="bg-white hover:bg-slate-50 text-[#0F172A] font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg border border-white/40 text-sm"
            >
              🎓 Entrar por administración
            </button>
            <button
              onClick={() => navigate('/pisos')}
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg border border-white/20 backdrop-blur-md text-sm"
            >
              🏠 Buscar alojamiento
            </button>
          </div>

          <div className="flex justify-center gap-6 mt-5 text-xs md:text-sm text-slate-100 flex-wrap">
            <span>🎓 Educación · Sanidad · Justicia</span>
            <span>💬 Foro · Chat · Permutas</span>
            <span>🚗 Compartir coche</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Entra por tu administración
          </h2>
          <p className="text-gray-500 text-sm">
            Cada colectivo tiene su propio espacio adaptado a su realidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADMINISTRACIONES.map(admin => (
            <button
              key={admin.nombre}
              onClick={() => navigate(admin.ruta)}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-4xl mb-3">{admin.icono}</div>
              <h2 className="font-bold text-gray-900 mb-2 group-hover:text-[#0F172A] transition-colors">
                {admin.nombre}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">{admin.descripcion}</p>
              <div className="mt-4 text-[#0F172A] text-xs font-semibold">Entrar →</div>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Espacios de la comunidad
              </h2>
              <p className="text-gray-500 text-sm">
                Todo lo que necesitas para organizar tu movilidad y conectar con gente en tu misma situación.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOQUES.map(b => (
              <button
                key={b.titulo}
                onClick={() => navigate(b.ruta)}
                className={`bg-gradient-to-br ${b.color} rounded-3xl p-8 text-white cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left`}
              >
                <div className="text-5xl mb-3">{b.icono}</div>
                <h3 className="text-xl font-bold mb-1">{b.titulo}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{b.descripcion}</p>
                <div className="mt-4 text-white/90 text-sm font-medium">Acceder →</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                ¿Qué podrás hacer aquí?
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Mundo nace para ser la capa social de MundoInterino: una comunidad para compartir
                información útil, encontrar personas en tu misma zona, organizar viajes, resolver dudas
                y publicar recursos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: '💬', texto: 'Foros por tema y administración.' },
                  { icon: '⚡', texto: 'Chats rápidos y grupos de apoyo.' },
                  { icon: '🔁', texto: 'Permutas y cambios de destino.' },
                  { icon: '🚗', texto: 'Compartir coche y gastos.' },
                  { icon: '📚', texto: 'Recursos, guías y plantillas.' },
                  { icon: '📢', texto: 'Avisos relevantes y moderación.' },
                ].map(item => (
                  <div
                    key={item.texto}
                    className="flex items-start gap-3 bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-sm text-gray-700">{item.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-3xl p-6 text-white">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-bold mb-3">Primer MVP</h3>
              <ul className="space-y-3 text-sm text-white/80">
                {[
                  'Página principal por administración.',
                  'Foro básico con categorías.',
                  'Chat general por colectivo.',
                  'Sección de permutas.',
                  'Panel de avisos destacados.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
