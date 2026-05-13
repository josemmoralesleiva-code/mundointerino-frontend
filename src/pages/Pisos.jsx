import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Pisos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pisos, setPisos] = useState([])
  const [cargando, setCargando] = useState(true)

  const ciudad = searchParams.get('ciudad') || ''

  useEffect(() => {
    const fetchPisos = async () => {
      try {
        const res = await axios.get(`${API}/api/pisos?ciudad=${ciudad}`)
        setPisos(res.data.pisos)
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    fetchPisos()
  }, [ciudad])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-blue-700 cursor-pointer"
        >
          🏠 Profinter
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {ciudad ? `Pisos en ${ciudad}` : 'Todos los pisos'}
        </h1>
        <p className="text-gray-500 mb-6">{pisos.length} pisos encontrados</p>

        {cargando ? (
          <div className="text-center py-20 text-gray-400">Cargando pisos...</div>
        ) : pisos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏠</div>
            <p className="text-gray-500 text-lg">Aún no hay pisos en esta zona.</p>
            <p className="text-gray-400">¡Sé el primero en publicar!</p>
            <button
              onClick={() => navigate('/registro')}
              className="mt-6 bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800"
            >
              Publicar piso
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pisos.map(piso => (
              <div
                key={piso._id}
                onClick={() => navigate(`/pisos/${piso._id}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md cursor-pointer border border-gray-100 overflow-hidden transition-all"
              >
                <div className="h-48 bg-blue-100 flex items-center justify-center text-5xl">
                  🏠
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{piso.titulo}</h3>
                  <p className="text-gray-500 text-sm mb-3">📍 {piso.ciudad}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-bold text-lg">
                      {piso.precio}€<span className="text-sm font-normal text-gray-500">/mes</span>
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      {piso.habitaciones} hab.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}