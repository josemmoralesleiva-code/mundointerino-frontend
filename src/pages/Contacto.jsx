import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Contacto() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  })
  const [enviado, setEnviado] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setEnviado(true)
    setForm({ nombre: '', email: '', asunto: '', mensaje: '' })
  }

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
          <h1 className="text-4xl md:text-5xl font-bold">Contacto</h1>
          <p className="text-primary-100 mt-4 max-w-3xl text-lg">
            Escríbenos si tienes dudas, quieres publicar un piso o necesitas ayuda con la plataforma.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Información de contacto</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Email</p>
                  {/* ✏️ CAMBIO: email actualizado a Repla */}
                  <p className="font-medium text-gray-800">hola@repla.es</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Teléfono</p>
                  <p className="font-medium text-gray-800">+34 600 000 000</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Horario</p>
                  <p className="font-medium text-gray-800">Lunes a viernes, 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-3">Acciones rápidas</h3>
              <div className="flex flex-col gap-3">
                <Link
                  to="/pisos/nuevo"
                  className="bg-primary-700 text-white px-5 py-3 rounded-xl font-semibold text-center hover:bg-primary-800 transition-all"
                >
                  Publicar piso
                </Link>
                <Link
                  to="/sobre-nosotros"
                  className="border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold text-center hover:bg-gray-50 transition-all"
                >
                  Saber más
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Envíanos un mensaje</h2>
              <p className="text-gray-500 text-sm mb-6">
                Cuéntanos lo que necesitas y te responderemos lo antes posible.
              </p>

              {enviado && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                  Mensaje enviado correctamente. Te responderemos pronto.
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Asunto</label>
                  <input
                    type="text"
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Mensaje</label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    Enviar mensaje
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Volver al inicio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}