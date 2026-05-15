import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function DetallePiso() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [piso, setPiso] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    axios.get(`${API_URL}/api/pisos/${id}`)
      .then(res => setPiso(res.data))
      .catch(() => setError(true))
  }, [id])

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-gray-500 text-lg">Piso no encontrado.</p>
        <button onClick={() => navigate('/pisos')} className="mt-4 bg-primary-700 text-white px-6 py-2 rounded-xl hover:bg-primary-800">
          Volver al listado
        </button>
      </div>
    </div>
  )

  if (!piso) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="text-4xl mb-3 animate-pulse">🔍</div>
        <p>Cargando piso...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a onClick={() => navigate('/')} className="flex items-center cursor-pointer">
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

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Botón volver */}
        <button
          onClick={() => navigate('/pisos')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-700 border border-gray-200 px-4 py-2 rounded-xl mb-6 text-sm hover:border-primary-700 transition-all"
        >
          ← Volver al listado
        </button>

        {/* Imagen principal */}
        <div className="w-full h-72 md:h-96 bg-primary-50 rounded-2xl overflow-hidden mb-6">
          {piso.fotos?.[0] ? (
            <img
              src={piso.fotos[0]}
              alt={piso.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl text-primary-100">
              🏠
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Columna principal */}
          <div className="md:col-span-2">

            {/* Título y ciudad */}
            <div className="mb-4">
              <span className={`text-xs px-2 py-1 rounded-full font-medium mb-3 inline-block ${
                piso.tipoEstancia === 'corta'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-green-50 text-green-700'
              }`}>
                {piso.tipoEstancia === 'corta' ? '⚡ Estancia corta' : '📅 Estancia larga'}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{piso.titulo}</h1>
              <p className="text-gray-500">📍 {piso.ciudad}</p>
            </div>

            {/* Tarjetas de info */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
                🛏 <span><strong>{piso.habitaciones}</strong> habitaciones</span>
              </div>
              {piso.disponible !== undefined && (
                <div className={`rounded-xl px-4 py-2 text-sm flex items-center gap-2 ${
                  piso.disponible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {piso.disponible ? '✅ Disponible' : '❌ No disponible'}
                </div>
              )}
            </div>

            {/* Descripción */}
            {piso.descripcion && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Descripción</h2>
                <p className="text-gray-600 leading-relaxed">{piso.descripcion}</p>
              </div>
            )}
          </div>

          {/* Columna lateral — Precio y contacto */}
          <div className="md:col-span-1">

            {/* Card precio */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 sticky top-6">
              <div className="text-3xl font-bold text-primary-700 mb-1">
                {piso.precio}€
                <span className="text-base font-normal text-gray-500">
                  {piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Precio orientativo. Negociación directa.</p>

              {/* Contacto */}
              {piso.contacto && (
                <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Contacto</p>
                    <p className="font-semibold text-primary-700">{piso.contacto}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => window.location.href = `tel:${piso.contacto}`}
                className="w-full mt-4 bg-accent-500 hover:bg-accent-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                📞 Llamar al propietario
              </button>
              <button
                onClick={() => navigate('/pisos')}
                className="w-full mt-2 border border-primary-700 text-primary-700 py-3 rounded-xl font-medium hover:bg-primary-50 transition-all"
              >
                Ver más pisos
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-primary-900 text-white py-8 px-6 text-center mt-8">
        <div className="max-w-5xl mx-auto">
          <img src="/img/logo.png" alt="Profinter" className="h-8 mx-auto mb-3 opacity-70 brightness-0 invert" />
          <p className="text-primary-100 text-sm">© 2026 Profinter · Portal de alquiler para interinos en Aragón</p>
        </div>
      </footer>

    </div>
  )
}