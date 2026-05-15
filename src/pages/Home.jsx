import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const [ciudad, setCiudad] = useState('')
  const [fecha, setFecha] = useState('')
  const [tipoEstancia, setTipoEstancia] = useState('')

  const handleBuscar = () => {
    navigate(`/pisos?ciudad=${ciudad}&fecha=${fecha}&tipo=${tipoEstancia}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img src="/img/logo.png" alt="Profinter" className="h-9" />
          </a>
          <ul className="hidden md:flex items-center gap-6 list-none">
            <li>
              <button onClick={() => navigate('/pisos')} className="text-gray-700 hover:text-primary-700 font-medium">
                Buscar piso
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/sobre-nosotros')} className="text-gray-700 hover:text-primary-700 font-medium">
                Sobre nosotros
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contacto')} className="text-gray-700 hover:text-primary-700 font-medium">
                Contacto
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/publicar')}
                className="border border-primary-700 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 font-medium"
              >
                Publicar piso
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/login')}
                className="bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 font-medium"
              >
                Entrar
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-primary-700 text-white py-20 px-6 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            El portal de alquiler<br />
            <span className="text-accent-400">para docentes interinos</span><br />
            en Aragón
          </h1>
          <p className="text-primary-100 text-lg mb-10">
            Encuentra piso cerca de tu destino rápidamente. Precios justos, estancias cortas o largas.
          </p>

          {/* BUSCADOR */}
          <div className="bg-white rounded-2xl p-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex flex-col items-start px-2">
              <label className="text-xs text-gray-500 mb-1 font-medium">📍 Localidad o provincia</label>
              <input
                type="text"
                placeholder="Zaragoza, Huesca, Teruel…"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                className="w-full text-gray-700 focus:outline-none focus:border-primary-500 border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
            <div className="flex flex-col items-start px-2">
              <label className="text-xs text-gray-500 mb-1 font-medium">📅 Disponible desde</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="text-gray-700 focus:outline-none focus:border-primary-500 border border-gray-200 rounded-xl px-3 py-2"
              />
            </div>
            <div className="flex flex-col items-start px-2">
              <label className="text-xs text-gray-500 mb-1 font-medium">⏱️ Tipo de estancia</label>
              <select
                value={tipoEstancia}
                onChange={e => setTipoEstancia(e.target.value)}
                className="text-gray-700 focus:outline-none focus:border-primary-500 border border-gray-200 rounded-xl px-3 py-2"
              >
                <option value="">Cualquiera</option>
                <option value="corta">Corta (días/semanas)</option>
                <option value="larga">Larga (meses)</option>
              </select>
            </div>
            <button
              onClick={handleBuscar}
              className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold self-end"
            >
              🔍 Buscar
            </button>
          </div>
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">¿Por qué Profinter?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '👨‍🏫', titulo: 'Solo para docentes', texto: 'Propietarios que entienden tus necesidades: contratos flexibles y sin burocracia.' },
            { icon: '💶', titulo: 'Precios justos', texto: 'Más económico que Booking. Sin comisiones ocultas. Negociación directa.' },
            { icon: '📅', titulo: 'Estancia flexible', texto: 'Desde un fin de semana hasta todo el curso escolar. Tú decides cuánto tiempo.' },
            { icon: '🗺️', titulo: 'En todo Aragón', texto: 'Zaragoza, Huesca y Teruel. Pisos cerca de colegios e institutos.' },
          ].map(v => (
            <div key={v.titulo} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{v.titulo}</h3>
              <p className="text-gray-500 text-sm">{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PISOS DESTACADOS */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Pisos disponibles ahora</h2>
        <div id="pisosDestacados" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TODO: mapear pisos desde API */}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/pisos')}
            className="bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-800 text-lg"
          >
            Ver todos los pisos
          </button>
        </div>
      </section>

      {/* CTA PROPIETARIOS */}
      <section className="bg-primary-700 py-14 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">¿Tienes un piso en Aragón?</h2>
          <p className="text-primary-100 mb-6">
            Únete a los propietarios que ya alquilan a docentes. Publicación gratuita, inquilinos responsables.
          </p>
          <button
            onClick={() => navigate('/publicar')}
            className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 text-lg"
          >
            Publicar mi piso gratis
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary-900 text-white py-8 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <img src="/img/logo.png" alt="Profinter" className="h-8 mx-auto mb-3 opacity-70 brightness-0 invert" />
          <p className="text-primary-100 text-sm">© 2026 Profinter · Portal de alquiler para interinos en Aragón</p>
        </div>
      </footer>

    </div>
  )
}