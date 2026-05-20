import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Navbar from '../components/Navbar'

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const API = import.meta.env.VITE_API_URL

export default function Pisos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pisos, setPisos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [orden, setOrden] = useState('precio_asc')
  const [vistaLista, setVistaLista] = useState(true)

  const [ciudad, setCiudad] = useState(searchParams.get('ciudad') || '')
  const [fecha, setFecha] = useState(searchParams.get('fecha') || '')
  const [tipoEstancia, setTipoEstancia] = useState(searchParams.get('tipo') || '')
  const [comunidad, setComunidad] = useState(searchParams.get('comunidad') || '')
  const [provincia, setProvincia] = useState(searchParams.get('provincia') || '')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [habitaciones, setHabitaciones] = useState('')

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

  const pisosOrdenados = [...pisos]
    .filter(p => {
      if (precioMin && p.precio < Number(precioMin)) return false
      if (precioMax && p.precio > Number(precioMax)) return false
      if (habitaciones && p.habitaciones < Number(habitaciones)) return false
      return true
    })
    .sort((a, b) =>
      orden === 'precio_asc' ? a.precio - b.precio : b.precio - a.precio
    )

  const pisosConCoordenadas = pisosOrdenados.filter(p => p.lat && p.lng)

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      {/* HERO COMPACTO */}
      <section className="bg-[#0F172A] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Encuentra tu piso ideal</h1>
          <p className="text-slate-300 text-sm">
            Filtra por comunidad, provincia, ciudad y tipo de estancia para interinos de la administración.
          </p>
        </div>
      </section>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col md:flex-row gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-medium mb-1 block">📍 Ciudad o provincia</label>
              <input
                type="text"
                placeholder="Ej: Zaragoza, Sevilla, Huesca..."
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">📅 Desde</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">⏱️ Estancia</label>
              <select
                value={tipoEstancia}
                onChange={e => setTipoEstancia(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0F172A]"
              >
                <option value="">Cualquiera</option>
                <option value="corta">Corta (días/semanas)</option>
                <option value="larga">Larga (meses)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">🏞️ Comunidad</label>
              <select
                value={comunidad}
                onChange={e => setComunidad(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0F172A]"
              >
                <option value="">Cualquiera</option>
                <option value="aragon">Aragón</option>
                <option value="andalucia">Andalucía</option>
              </select>
            </div>
            <button
              onClick={handleBuscar}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
            >
              🔍 Buscar
            </button>
          </div>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

        {/* SIDEBAR FILTROS */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sticky top-[140px]">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Filtros</h3>

            {/* Precio */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                💶 Precio (€)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={precioMin}
                  onChange={e => setPrecioMin(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  value={precioMax}
                  onChange={e => setPrecioMax(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>

            {/* Habitaciones */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                🛏️ Habitaciones mínimas
              </label>
              <div className="flex gap-2 flex-wrap">
                {['', '1', '2', '3', '4'].map(n => (
                  <button
                    key={n}
                    onClick={() => setHabitaciones(n)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      habitaciones === n
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'border-gray-200 text-gray-600 hover:border-[#0F172A]'
                    }`}
                  >
                    {n === '' ? 'Todas' : `${n}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo estancia sidebar */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                ⏱️ Tipo de estancia
              </label>
              <div className="flex flex-col gap-2">
                {[['', 'Cualquiera'], ['corta', '⚡ Corta (días/semanas)'], ['larga', '📅 Larga (meses)']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setTipoEstancia(val)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      tipoEstancia === val
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'border-gray-200 text-gray-600 hover:border-[#0F172A]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comunidad sidebar */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                🏞️ Comunidad
              </label>
              <div className="flex flex-col gap-2">
                {[['', 'Todas'], ['aragon', '🏔️ Aragón'], ['andalucia', '🌞 Andalucía']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setComunidad(val)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      comunidad === val
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'border-gray-200 text-gray-600 hover:border-[#0F172A]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBuscar}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] py-3 rounded-2xl font-bold text-sm transition-all mt-2"
            >
              Aplicar filtros
            </button>

            <button
              onClick={() => {
                setPrecioMin('')
                setPrecioMax('')
                setHabitaciones('')
                setTipoEstancia('')
                setComunidad('')
                setCiudad('')
                setFecha('')
                fetchPisos('', '', '', '', '')
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-3 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* RESULTADOS */}
        <div className="flex-1 min-w-0">
          {/* CABECERA RESULTADOS */}
          {!cargando && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {ciudad ? `Pisos en ${ciudad}` : 'Todos los pisos'}
                </h2>
                <p className="text-gray-500 text-sm">{pisosOrdenados.length} pisos encontrados</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={orden}
                  onChange={e => setOrden(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-[#0F172A]"
                >
                  <option value="precio_asc">💶 Precio: menor a mayor</option>
                  <option value="precio_desc">💶 Precio: mayor a menor</option>
                </select>
                <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setVistaLista(true)}
                    className={`px-3 py-2 text-sm transition-colors ${vistaLista ? 'bg-[#0F172A] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    ☰
                  </button>
                  <button
                    onClick={() => setVistaLista(false)}
                    className={`px-3 py-2 text-sm transition-colors ${!vistaLista ? 'bg-[#0F172A] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    ⊞
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAPA */}
          {!cargando && pisosConCoordenadas.length > 0 && (
            <div className="mb-6 rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-64">
              <MapContainer
                center={[pisosConCoordenadas[0].lat, pisosConCoordenadas[0].lng]}
                zoom={12}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pisosConCoordenadas.map(piso => (
                  <Marker key={piso._id} position={[piso.lat, piso.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{piso.titulo}</p>
                        <p className="text-gray-500">{piso.ciudad}</p>
                        <p className="font-bold text-[#0F172A]">{piso.precio}€</p>
                        <button
                          onClick={() => navigate(`/pisos/${piso._id}`)}
                          className="mt-1 text-[#2F5DAA] text-xs underline"
                        >
                          Ver piso →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          {/* LOADING */}
          {cargando && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3 animate-pulse">🔍</div>
              <p>Buscando pisos...</p>
            </div>
          )}

          {/* VACÍO */}
          {!cargando && pisosOrdenados.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">😕</div>
              <p className="text-gray-700 text-lg font-medium">No se encontraron pisos con esos filtros.</p>
              <p className="text-gray-400 mb-6">Prueba con otra localidad o cambia el tipo de estancia.</p>
              <button
                onClick={() => navigate('/pisos/nuevo')}
                className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl hover:bg-[#1E3A5F] font-medium transition-all"
              >
                Publicar piso
              </button>
            </div>
          )}

          {/* LISTA */}
          {!cargando && pisosOrdenados.length > 0 && (
            <div className={vistaLista
              ? 'flex flex-col gap-4'
              : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
            }>
              {pisosOrdenados.map(piso => (
                vistaLista ? (
                  <div
                    key={piso._id}
                    onClick={() => navigate(`/pisos/${piso._id}`)}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex group"
                  >
                    <div className="w-56 shrink-0 relative overflow-hidden">
                      {piso.fotos?.[0] ? (
                        <img
                          src={piso.fotos[0]}
                          alt={piso.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50">🏠</div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          piso.tipoEstancia === 'corta'
                            ? 'bg-[#D4AF37] text-[#0F172A]'
                            : 'bg-[#1E3A5F] text-white'
                        }`}>
                          {piso.tipoEstancia === 'corta' ? '⚡ Corta' : '📅 Larga'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#0F172A] leading-snug">
                          {piso.titulo}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">📍 {piso.ciudad}</p>
                        <div className="flex gap-3 text-xs text-gray-400">
                          <span>🛏 {piso.habitaciones} hab.</span>
                          {piso.metros && <span>📐 {piso.metros} m²</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[#0F172A] font-bold text-xl">
                          {piso.precio}€
                          <span className="text-sm font-normal text-gray-400">
                            {piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}
                          </span>
                        </span>
                        <span className="text-xs text-[#2F5DAA] font-semibold">Ver detalles →</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={piso._id}
                    onClick={() => navigate(`/pisos/${piso._id}`)}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-2xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="h-52 overflow-hidden relative">
                      {piso.fotos?.[0] ? (
                        <img
                          src={piso.fotos[0]}
                          alt={piso.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50">🏠</div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          piso.tipoEstancia === 'corta'
                            ? 'bg-[#D4AF37] text-[#0F172A]'
                            : 'bg-[#1E3A5F] text-white'
                        }`}>
                          {piso.tipoEstancia === 'corta' ? '⚡ Corta' : '📅 Larga'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-1 leading-snug">{piso.titulo}</h3>
                      <p className="text-gray-500 text-sm mb-3">📍 {piso.ciudad}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#0F172A] font-bold text-lg">
                          {piso.precio}€
                          <span className="text-sm font-normal text-gray-400">
                            {piso.tipoEstancia === 'corta' ? '/noche' : '/mes'}
                          </span>
                        </span>
                        <span className="text-xs bg-[#F8F5EF] text-gray-600 px-2 py-1 rounded-full">
                          🛏 {piso.habitaciones} hab.
                        </span>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0B1220] text-white py-10 px-6 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="MundoInterino" className="h-12 object-contain opacity-90" />
            <p className="text-slate-100 text-sm">© 2026 MundoInterino · Tu hogar donde te necesiten</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-100">
            <Link to="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link>
            <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
            <Link to="/pisos/nuevo" className="hover:text-white transition-colors">Publicar piso</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}