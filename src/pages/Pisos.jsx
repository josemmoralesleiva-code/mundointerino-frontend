import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Pisos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pisos, setPisos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [orden, setOrden] = useState('precio_asc')

  // Filtros
  const [ciudad, setCiudad] = useState(searchParams.get('ciudad') || '')
  const [fecha, setFecha] = useState(searchParams.get('fecha') || '')
  const [tipoEstancia, setTipoEstancia] = useState(searchParams.get('tipo') || '')

  const fetchPisos = async (c, f, t) => {
    setCargando(true)
    try {
      const res = await axios.get(`${API}/api/pisos`, {
        params: { ciudad: c, fecha: f, tipo: t }
      })
      setPisos(res.data.pisos)
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    fetchPisos(ciudad, fecha, tipoEstancia)
  }, [])

  const handleBuscar = () => {
    fetchPisos(ciudad, fecha, tipoEstancia)
  }

  const pisosOrdenados = [...pisos].sort((a, b) =>
    orden === 'precio_asc' ? a.precio - b.precio : b.precio - a.precio
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
              <button onClick={() => navigate('/pisos')} className="text-blue-700 font-semibold">
                Buscar piso
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/sobre-nosotros')} className="text-gray-700 hover:text-blue-700 font-medium">
                Sobre nosotros
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contacto')} className="text-gray-700 hover:text-blue-700 font-medium">
                Contacto
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/publicar')}
                className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium"
              >
                Publicar piso
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 font-medium"
              >
                Entrar
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* FILTROS DE BÚSQUEDA */}
      <div className="bg-blue-700 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex flex-col items-start px-2">
              <label className="text-xs text-gray-500 mb-1 font-medium">📍 Localidad o provincia</label>
              <input
                type="text"
                placeholder="Zaragoza, Huesca, Teruel…"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col items-start px-2">
              <label className="text-xs text-gray-500 mb-1 font-medium">📅 Disponible desde</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col items-start px-2">
              <label className="text-xs text-gray-500 mb-1 font-medium">⏱️ Tipo de estancia</label>
              <select
                value={tipoEstancia}
                onChange={e => setTipoEstancia(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
              >
                <option value="">Cualquiera</option>
                <option value="corta">Corta (días/semanas)</option>
                <option value="larga">Larga (meses)</option>
              </select>
            </div>
            <button
              onClick={handleBuscar}
              className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 self-end"
            >
              🔍 Buscar
            </button>
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Cabecera resultados + ordenación */}
        {!cargando && pisos.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {ciudad ? `Pisos en ${ciudad}` : 'Todos los pisos'}
              </h1>
              <p className="text-gray-500 text-sm">{pisos.length} pisos encontrados</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Ordenar por:</label>
              <select
                value={orden}
                onChange={e => setOrden(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>
        )}

        {/* Estado: cargando */}
        {cargando && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">🔍</div>
            <p>Buscando pisos...</p>
          </div>
        )}

        {/* Estado: sin resultados */}
        {!cargando && pisos.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-gray-500 text-lg font-medium">No se encontraron pisos con esos filtros.</p>
            <p className="text-gray-400 mb-6">Prueba con otra localidad o cambia el tipo de estancia.</p>
            <button
              onClick={() => navigate('/publicar')}
              className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 font-medium"
            >
              Publicar piso
            </button>
          </div>
        )}

        {/* Grid de pisos */}
        {!cargando && pisosOrdenados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pisosOrdenados.map(piso => (
              <div
                key={piso._id}
                onClick={() => navigate(`/pisos/${piso._id}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md cursor-pointer border border-gray-100 overflow-hidden transition-all"
              >
                {/* Imagen o placeholder */}
                <div className="h-48 bg-blue-50 overflow-hidden">
                  {piso.fotos?.[0] ? (
                    <img
                      src={piso.fotos[0]}
                      alt={piso.titulo}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-blue-200">🏠</div>
                  )}
                </div>

                <div className="p-4">
                  {/* Tipo estancia badge */}
                  <div className="mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      piso.tipoEstancia === 'corta'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {piso.tipoEstancia === 'corta' ? '⚡ Estancia corta' : '📅 Estancia larga'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-1 leading-snug">{piso.titulo}</h3>
                  <p className="text-gray-500 text-sm mb-3">📍 {piso.ciudad}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-bold text-lg">
                      {piso.precio}€
                      <span className="text-sm font-normal text-gray-500">
                        {piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}
                      </span>
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

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-8 px-6 text-center mt-8">
        <div className="max-w-5xl mx-auto">
          <img src="/img/logo.png" alt="Profinter" className="h-8 mx-auto mb-3 opacity-70 brightness-0 invert" />
          <p className="text-gray-400 text-sm">© 2026 Profinter · Portal de alquiler para interinos en Aragón</p>
        </div>
      </footer>

    </div>
  )
}