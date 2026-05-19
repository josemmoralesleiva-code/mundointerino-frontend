import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function SobreNosotros() {
  const navigate = useNavigate()

  const valores = [
    {
      icono: '🧑‍💼',
      titulo: 'Pensado para interinos',
      texto: 'Creamos una plataforma centrada en las necesidades reales de interinos desplazados por trabajo.',
    },
    {
      icono: '🏠',
      titulo: 'Alquiler más humano',
      texto: 'Buscamos que propietarios e inquilinos conecten sin intermediarios ni comisiones ocultas.',
    },
    {
      icono: '💶',
      titulo: 'Precio justo',
      texto: 'Queremos una alternativa más económica y flexible que los portales de alojamiento tradicionales.',
    },
    {
      icono: '🤝',
      titulo: 'Contacto directo',
      texto: 'Facilitamos comunicación clara entre propietario e inquilino para cerrar acuerdos rápido.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-primary-100 hover:text-white mb-4 inline-flex items-center gap-1"
          >
            ← Volver al inicio
          </button>
          <h1 className="text-4xl md:text-5xl font-bold">Sobre nosotros</h1>
          {/* ✏️ CAMBIO: marca y enfoque */}
          <p className="text-primary-100 mt-4 max-w-3xl text-lg">
            Repla nace para ayudar a interinos a encontrar alojamiento mejor adaptado a sus estancias temporales.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra misión</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Queremos simplificar la búsqueda de vivienda para interinos que se desplazan por trabajo.
              Sabemos que muchas veces el problema no es solo encontrar piso, sino encontrar un piso
              adecuado para una estancia corta o de varios meses, con trato directo y condiciones claras.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Por eso construimos un portal donde el enfoque está en comunidades, provincias y ciudades,
              para que cada persona llegue más rápido a su destino ideal.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Qué ofrecemos</h2>
            <div className="space-y-4">
              {[
                'Búsqueda por comunidades autónomas, provincias y ciudades.',
                'Pisos para estancias cortas y largas.',
                'Contacto directo con propietarios.',
                'Una experiencia clara, rápida y sencilla.',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-primary-700 mt-0.5">✓</span>
                  <p className="text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nuestros valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map(v => (
              <div
                key={v.titulo}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-all"
              >
                <div className="text-5xl mb-4">{v.icono}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-primary-50 border border-primary-100 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">¿Eres propietario?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Si tienes un piso pensado para interinos, puedes publicarlo gratis y recibir consultas directas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/pisos/nuevo"
              className="bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-800 transition-all"
            >
              Publicar piso
            </Link>
            <Link
              to="/contacto"
              className="border border-primary-200 text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-100 transition-all"
            >
              Contactar con Repla
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}