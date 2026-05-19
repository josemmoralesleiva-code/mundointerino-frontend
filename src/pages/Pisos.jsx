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

  const [ciudad, setCiudad] = useState(searchParams.get('ciudad') || '')
  const [fecha, setFecha] = useState(searchParams.get('fecha') || '')
  const [tipoEstancia, setTipoEstancia] = useState(searchParams.get('tipo') || '')
  const [comunidad, setComunidad] = useState(searchParams.get('comunidad') || '')
  const [provincia, setProvincia] = useState(searchParams.get('provincia') || '')

  const fetchPisos = async (c, f, t, co, pro) => {
    setCargando(true)
    try {
      const res = await axios.get(`${API}/api/pisos`, {
        params: { ciudad: c, fecha: f, tipo: t, comunidad: co, provincia: pro }
      })
      setPisos(res.data.pisos || [])
    } catch (error) {
      console.error(error)
      setPisos([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    fetchPisos(ciudad, fecha, tipoEstancia, comunidad, provincia)
  }, [])

  const handleBuscar = () => {
    fetchPisos(ciudad, fecha, tipoEstancia, comunidad, provincia)
  }

  const pisosOrdenados = [...pisos].sort((a, b) =>
    orden === 'precio_asc' ? a.precio - b.precio : b.precio - a.precio
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center">
            {/* ✏️ CAMBIO: alt + tamaño */}
            <img src="/img/logo.png" alt="Repla" className="h-14" />
          </button>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/zonas')}
              className="text-primary-700 font-semibold text-sm border-b-2 border-primary-700 pb-1"
            >
              Buscar por zonas
            </button>
            <button
              onClick={() => navigate('/publicar')}
              className="border border-primary-700 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 font-medium transition-all text-sm"
            >
              Publicar piso
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 font-medium transition-all text-sm"
            >
              Entrar
            </button>
          </div>
        </div>
      </nav>

      {/* CABECERA */}
      <section
        className="relative py-14 px-6 text-white"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary-900/80"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Encuentra tu piso ideal
          </h1>
          {/* ✏️ CAMBIO: "docentes" → "interinos de la administración" */}
          <p className="text-primary-100 text-lg max-w-2xl">
            Filtra por comunidad, provincia, ciudad, fecha y tipo de estancia para encontrar alojamientos para interinos de la administración.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex flex-col items-start px-2">
            <label className="text-xs text-gray-500 mb-1 font-medium">📍 Comunidad / provincia / ciudad</label>
            <input
              type="text"
              placeholder="Ej: Andalucía, Sevilla, Málaga..."
              value={ciudad}
              onChange={e => setCiudad(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex flex-col items-start px-2">
            <label className="text-xs text-gray-500 mb-1 font-medium">📅 Disponible desde</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex flex-col items-start px-2">
            <label className="text-xs text-gray-500 mb-1 font-medium">⏱️ Tipo de estancia</label>
            <select
              value={tipoEstancia}
              onChange={e => setTipoEstancia(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-primary-500"
            >
              <option value="">Cualquiera</option>
              <option value="corta">Corta (días/semanas)</option>
              <option value="larga">Larga (meses)</option>
            </select>
          </div>
          <div className="flex flex-col items-start px-2">
            <label className="text-xs text-gray-500 mb-1 font-medium">🏞 Comunidad</label>
            <select
              value={comunidad}
              onChange={e => setComunidad(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-primary-500"
            >
              <option value="">Cualquiera</option>
              <option value="aragon">Aragón</option>
              <option value="andalucia">Andalucía</option>
            </select>
          </div>
          <div className="flex flex-col items-start px-2">
            <label className="text-xs text-gray-500 mb-1 font-medium">🏙 Provincia</label>
            <input
              type="text"
              placeholder="Ej: Zaragoza"
              value={provincia}
              onChange={e => setProvincia(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            onClick={handleBuscar}
            className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold self-end transition-all"
          >
            🔍 Buscar
          </button>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {!cargando && pisos.length > 0 && (
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {ciudad ? `Pisos en ${ciudad}` : 'Todos los pisos'}
              </h2>
              <p className="text-gray-500 text-sm">{pisos.length} pisos encontrados</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Ordenar por:</label>
              <select
                value={orden}
                onChange={e => setOrden(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>
        )}

        {cargando && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">🔍</div>
            <p>Buscando pisos...</p>
          </div>
        )}

        {!cargando && pisos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-gray-700 text-lg font-medium">No se encontraron pisos con esos filtros.</p>
            <p className="text-gray-400 mb-6">Prueba con otra localidad o cambia el tipo de estancia.</p>
            <button
              onClick={() => navigate('/publicar')}
              className="bg-primary-700 text-white px-6 py-3 rounded-xl hover:bg-primary-800 font-medium transition-all"
            >
              Publicar piso
            </button>
          </div>
        )}

        {!cargando && pisosOrdenados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pisosOrdenados.map(piso => (
              <div
                key={piso._id}
                onClick={() => navigate(`/pisos/${piso._id}`)}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-52 bg-primary-50 overflow-hidden relative">
                  {piso.fotos?.[0] ? (
                    <img
                      src={piso.fotos[0]}
                      alt={piso.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-primary-100">🏠</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      piso.tipoEstancia === 'corta'
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-green-400 text-green-900'
                    }`}>
                      {piso.tipoEstancia === 'corta' ? '⚡ Corta' : '📅 Larga'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-1 leading-snug group-hover:text-primary-700 transition-colors">
                    {piso.titulo}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">📍 {piso.ciudad}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-700 font-bold text-lg">
                      {piso.precio}€
                      <span className="text-sm font-normal text-gray-500">
                        {piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}
                      </span>
                    </span>
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
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
      <footer className="bg-primary-900 text-white py-8 px-6 text-center mt-8">
        <div className="max-w-5xl mx-auto">
          {/* ✏️ CAMBIO: alt, tamaño y texto */}
          <img src="/img/logo.png" alt="Repla" className="h-12 mx-auto mb-3 opacity-70 brightness-0 invert" />
          <p className="text-primary-100 text-sm">© 2026 Repla · Tu hogar donde te necesiten</p>
        </div>
      </footer>
    </div>
  )
}