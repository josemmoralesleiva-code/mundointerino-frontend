import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'
import type { Piso } from '../../types'

const API = import.meta.env.VITE_API_URL

export default function ZoneDetail() {
  const navigate = useNavigate()
  const { comunidad, provincia, ciudad } = useParams()
  const [pisos, setPisos] = useState<Piso[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get(`${API}/pisos`, {
          params: {
            comunidad,
            provincia,
            ciudad: decodeURIComponent(ciudad!),
            limite: 24,
          },
        })
        setPisos(res.data.pisos || [])
      } catch {
        setPisos([])
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [comunidad, provincia, ciudad])

  return (
    <PageLayout>
      <Navbar />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate(`/zonas/${comunidad}/${provincia}`)} className="text-sm text-primary-100 hover:text-white">
            ← Volver a la provincia
          </button>
          <h1 className="text-3xl font-bold mt-2">{decodeURIComponent(ciudad!)}</h1>
          <p className="text-primary-100 mt-2">Pisos disponibles en esta zona.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : pisos.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">No hay pisos en esta zona</h2>
            <p className="text-gray-500">Prueba con otra ciudad o vuelve a la provincia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pisos.map(piso => (
              <div
                key={piso._id}
                onClick={() => navigate(`/pisos/${piso._id}`)}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition-all"
              >
                <div className="h-48 bg-gray-100">
                  {piso.fotos?.[0] ? (
                    <img src={piso.fotos[0]} alt={piso.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">🏠</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-1">{piso.titulo}</h3>
                  <p className="text-gray-500 text-sm mb-2">📍 {piso.ciudad}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-700 font-bold">{piso.precio}€</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {piso.tipoEstancia}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
