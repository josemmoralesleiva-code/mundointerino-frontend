import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Navbar from '../components/Navbar'
import PropertyCard from '../components/PropertyCard'
import CityAutocomplete from '../components/ui/CityAutocomplete'
import PageLayout from '../components/layout/PageLayout'
import { useProperties } from '../hooks/useProperties'
import type { City } from '../../domain/models/City'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function Properties() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { properties: pisos, loading: cargando, fetchAll } = useProperties()
  const [orden, setOrden] = useState('precio_asc')
  const [vistaLista, setVistaLista] = useState(true)

  const [ciudad, setCiudad] = useState(searchParams.get('ciudad') || '')
  const [fecha, setFecha] = useState(searchParams.get('fecha') || '')
  const [tipoEstancia, setTipoEstancia] = useState(searchParams.get('tipo') || '')
  const [provincia, setProvincia] = useState(searchParams.get('provincia') || '')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [habitaciones, setHabitaciones] = useState('')
  const [banos, setBanos] = useState('')
  const [metrosMin, setMetrosMin] = useState('')
  const [serviciosRequeridos, setServiciosRequeridos] = useState<string[]>([])
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const SERVICIOS_FILTRO = ['WiFi', 'Aire acondicionado', 'Calefacción', 'Parking', 'Ascensor', 'Terraza', 'Amueblado', 'Mascotas permitidas']

  const fetchPisos = (overrides: {
    c?: string; f?: string; t?: string; pro?: string;
    pmin?: string; pmax?: string; hab?: string; ban?: string; m?: string;
  } = {}) => {
    fetchAll({
      ciudad: overrides.c ?? ciudad,
      fecha: overrides.f ?? fecha,
      tipo: overrides.t ?? tipoEstancia,
      provincia: overrides.pro ?? provincia,
      precioMin: (overrides.pmin !== undefined ? overrides.pmin : precioMin) || undefined,
      precioMax: (overrides.pmax !== undefined ? overrides.pmax : precioMax) || undefined,
      habitaciones: (overrides.hab !== undefined ? overrides.hab : habitaciones) || undefined,
      banos: (overrides.ban !== undefined ? overrides.ban : banos) || undefined,
      metrosMin: (overrides.m !== undefined ? overrides.m : metrosMin) || undefined,
    })
  }

  const limpiarFiltros = () => {
    setPrecioMin('')
    setPrecioMax('')
    setHabitaciones('')
    setBanos('')
    setMetrosMin('')
    setServiciosRequeridos([])
    setTipoEstancia('')
    setCiudad('')
    setFecha('')
    setProvincia('')
    fetchAll({})
  }

  const toggleServicioRequerido = (s: string) => {
    setServiciosRequeridos(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const contenidoFiltros = () => (
    <>
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

      <div className="mb-5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          🚿 Baños mínimos
        </label>
        <div className="flex gap-2 flex-wrap">
          {['', '1', '2'].map(n => (
            <button
              key={n}
              onClick={() => setBanos(n)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                banos === n
                  ? 'bg-[#0F172A] text-white border-[#0F172A]'
                  : 'border-gray-200 text-gray-600 hover:border-[#0F172A]'
              }`}
            >
              {n === '' ? 'Todos' : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          📐 Superficie mínima (m²)
        </label>
        <div className="flex gap-2 flex-wrap">
          {['', '40', '60', '80', '100'].map(n => (
            <button
              key={n}
              onClick={() => setMetrosMin(n)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                metrosMin === n
                  ? 'bg-[#0F172A] text-white border-[#0F172A]'
                  : 'border-gray-200 text-gray-600 hover:border-[#0F172A]'
              }`}
            >
              {n === '' ? 'Todos' : `${n}+ m²`}
            </button>
          ))}
        </div>
      </div>

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

      <div className="mb-5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          🛎️ Servicios incluidos
        </label>
        <div className="flex flex-wrap gap-2">
          {SERVICIOS_FILTRO.map(s => (
            <button
              key={s}
              onClick={() => toggleServicioRequerido(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                serviciosRequeridos.includes(s)
                  ? 'bg-[#0F172A] text-white border-[#0F172A]'
                  : 'border-gray-200 text-gray-600 hover:border-[#0F172A]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </>
  )

  useEffect(() => {
    fetchPisos()
  }, [])

  const handleBuscar = () => {
    fetchPisos()
  }

  const pisosOrdenados = [...pisos]
    .filter(p => {
      // Filtros de servicios: client-side (servicios es simple-array en BD)
      if (serviciosRequeridos.length > 0) {
        const srv = p.servicios || []
        const tieneTodos = serviciosRequeridos.every(s => srv.includes(s))
        if (!tieneTodos) return false
      }
      return true
    })
    .sort((a, b) =>
      orden === 'precio_asc' ? a.precio - b.precio : b.precio - a.precio
    )

  const pisosConCoordenadas = pisosOrdenados.filter(
    (p): p is typeof p & { lat: number; lng: number } => Boolean(p.lat && p.lng),
  )

  return (
    <PageLayout>
      <Navbar />

      {/* HERO COMPACTO */}
      <section className="bg-[#0F172A] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Encuentra tu piso ideal</h1>
          <p className="text-slate-300 text-sm">
            Filtra por provincia, ciudad y tipo de estancia para interinos de la administración.
          </p>
        </div>
      </section>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col md:flex-row gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-gray-400 font-medium mb-1 block">📍 Ciudad o provincia</label>
              <div className="border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#0F172A] transition-colors">
                <CityAutocomplete
                  value={ciudad}
                  onChange={(c: City | null) => setCiudad(c?.nombre ?? '')}
                  placeholder="Ej: Zaragoza, Sevilla, Huesca..."
                />
              </div>
            </div>
            <div className="md:w-40">
              <label className="text-xs text-gray-400 font-medium mb-1 block">📅 Desde</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0F172A] [color-scheme:light]"
              />
            </div>
            <div className="md:w-44">
              <label className="text-xs text-gray-400 font-medium mb-1 block">⏱️ Estancia</label>
              <select
                value={tipoEstancia}
                onChange={e => setTipoEstancia(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0F172A]"
              >
                <option value="">Cualquiera</option>
                <option value="corta">Corta (días/semanas)</option>
                <option value="larga">Larga (meses)</option>
              </select>
            </div>
            <button
              onClick={handleBuscar}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
            >
              🔍 Buscar
            </button>
            <button
              onClick={() => setFiltrosAbiertos(true)}
              className="lg:hidden border border-gray-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-slate-50"
            >
              ⚙️ Filtros
            </button>
          </div>
        </div>
      </div>

      {/* DRAWER FILTROS (móvil) */}
      {filtrosAbiertos && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
            onClick={() => setFiltrosAbiertos(false)}
          />
          <div className="relative ml-auto w-full max-w-sm h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Filtros</h3>
              <button
                onClick={() => setFiltrosAbiertos(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {contenidoFiltros()}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => { handleBuscar(); setFiltrosAbiertos(false) }}
                className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] py-3 rounded-2xl font-bold text-sm transition-all"
              >
                Aplicar
              </button>
              <button
                onClick={limpiarFiltros}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

        {/* SIDEBAR FILTROS */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sticky top-[152px]">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Filtros</h3>

            {contenidoFiltros()}

            <button
              onClick={handleBuscar}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] py-3 rounded-2xl font-bold text-sm transition-all mt-2"
            >
              Aplicar filtros
            </button>

            <button
              onClick={limpiarFiltros}
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
                  <Marker key={piso.id} position={[piso.lat, piso.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{piso.titulo}</p>
                        <p className="text-gray-500">{piso.ciudad}</p>
                        <p className="font-bold text-[#0F172A]">{piso.precio}€</p>
                        <button
                          onClick={() => navigate(`/pisos/${piso.id}`)}
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
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
            }>
              {pisosOrdenados.map(piso => (
                <PropertyCard
                  key={piso.id}
                  property={piso}
                  variant={vistaLista ? 'list' : 'grid'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
