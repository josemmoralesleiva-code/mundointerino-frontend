import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'

const PANELES = [
  {
    titulo: 'Foro de Sanidad',
    icono: '💬',
    descripcion: 'Dudas sobre guardias, destinos, hospitales, alojamiento y traslados.',
    ruta: '/mundo/sanidad/foro',
    color: 'from-[#0F172A] to-[#1E3A5F]',
  },
  {
    titulo: 'Chat general',
    icono: '⚡',
    descripcion: 'Conversación rápida para sanitarios en tiempo real.',
    ruta: '/mundo/sanidad/chat',
    color: 'from-[#1E3A5F] to-[#0F172A]',
  },
  {
    titulo: 'Permutas',
    icono: '🔁',
    descripcion: 'Intercambia turno, destino o alojamiento con otros sanitarios.',
    ruta: '/mundo/sanidad/permutas',
    color: 'from-[#D4AF37] to-[#B8860B]',
  },
  {
    titulo: 'Compartir coche',
    icono: '🚗',
    descripcion: 'Comparte desplazamientos al hospital o centro de salud.',
    ruta: '/mundo/sanidad/coche',
    color: 'from-[#334155] to-[#0F172A]',
  },
  {
    titulo: 'Recursos',
    icono: '📚',
    descripcion: 'Guías, documentos y recursos útiles para personal sanitario.',
    ruta: '/mundo/sanidad/recursos',
    color: 'from-[#0F172A] to-[#334155]',
  },
  {
    titulo: 'Avisos',
    icono: '📢',
    descripcion: 'Novedades, alertas y publicaciones destacadas para sanidad.',
    ruta: '/mundo/sanidad/avisos',
    color: 'from-[#B8860B] to-[#D4AF37]',
  },
]

const DESTACADOS = [
  { icon: '🏥', texto: 'Hospitales y centros de salud por provincia.' },
  { icon: '🏠', texto: 'Vivienda temporal cerca de tu destino sanitario.' },
  { icon: '🤝', texto: 'Comunidad de apoyo entre profesionales sanitarios.' },
  { icon: '🩺', texto: 'Espacio pensado para interinos y sustitutos de sanidad.' },
]

export default function Health() {
  const navigate = useNavigate()

  return (
    <PageLayout>
      <Navbar />

      <section
        className="relative text-white pt-8 pb-12 px-6 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#111827]/90" />
        <div className="relative max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mundo')}
            className="text-sm text-slate-300 hover:text-white mb-5 inline-flex items-center gap-1 transition-colors"
          >
            ← Volver a Mundo
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs mb-4 border border-white/20 backdrop-blur-md">
                🩺 Administración · Sanidad
              </span>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight drop-shadow-lg">
                Espacio <span className="text-[#D4AF37]">Sanidad</span>
              </h1>
              <p className="mt-3 text-slate-100 text-sm md:text-base max-w-2xl leading-relaxed">
                Un espacio exclusivo para interinos de sanidad. Alojamiento cerca de tu hospital, apoyo entre compañeros y recursos para tu día a día.
              </p>
            </div>
            <button
              onClick={() => navigate('/pisos')}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg text-sm whitespace-nowrap"
            >
              🏠 Buscar piso
            </button>
          </div>

          <div className="flex justify-start gap-6 mt-5 text-xs md:text-sm text-slate-100 flex-wrap">
            <span>✅ Solo para sanitarios verificados</span>
            <span>💬 Foro · Chat · Permutas</span>
            <span>🚗 Coche compartido</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu espacio de sanidad</h2>
          <p className="text-gray-500 text-sm">Accede a cada sección pensada para tu día a día como sanitario interino.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PANELES.map(panel => (
            <button
              key={panel.titulo}
              onClick={() => navigate(panel.ruta)}
              className={`bg-gradient-to-br ${panel.color} rounded-3xl p-7 text-white text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className="text-4xl mb-3">{panel.icono}</div>
              <h3 className="text-lg font-bold mb-2">{panel.titulo}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{panel.descripcion}</p>
              <div className="mt-4 text-white/90 text-xs font-semibold group-hover:translate-x-1 transition-transform duration-200">
                Acceder →
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#F8F5EF] rounded-3xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Qué encontrarás aquí</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DESTACADOS.map(item => (
                  <div key={item.texto} className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-3xl p-8 text-white">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-bold mb-4">Inicio rápido</h3>
              <ul className="space-y-3 text-sm text-white/80">
                {[
                  'Busca alojamiento cerca del hospital.',
                  'Entra al foro para resolver dudas.',
                  'Usa el chat para contactar rápido.',
                  'Mira permutas y coche compartido.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/pisos')}
                className="mt-6 w-full bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] font-bold py-3 rounded-2xl text-sm transition-all"
              >
                Buscar piso ahora
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
