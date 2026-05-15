import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const SERVICIOS_OPCIONES = [
  'WiFi', 'Calefacción', 'Aire acondicionado', 'Lavadora',
  'Lavavajillas', 'Microondas', 'TV', 'Parking', 'Ascensor',
  'Terraza', 'Balcón', 'Trastero', 'Amueblado', 'Mascotas permitidas'
]

export default function NuevoPiso() {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    ciudad: '',
    barrio: '',
    precio: '',
    precioDia: '',
    tipoEstancia: '',
    habitaciones: '',
    fianza: '',
    disponible: '',
    servicios: []
  })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleServicio = servicio => {
    setForm(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter(s => s !== servicio)
        : [...prev.servicios, servicio]
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API}/api/pisos`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/pisos')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al publicar el piso')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div onClick={() => navigate('/')} className="text-xl font-bold text-blue-700 cursor-pointer">
          🏠 Profinter
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:text-blue-700">
          ← Volver
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Publicar piso</h1>
        <p className="text-gray-500 mb-8">Rellena los datos de tu alojamiento</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Información básica */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-700">📋 Información básica</h2>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Título del anuncio *</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Ej: Piso luminoso cerca del colegio"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Descripción *</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={4}
                placeholder="Describe el piso, el entorno, condiciones..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm resize-none"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-700">📍 Ubicación</h2>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Ciudad *</label>
              <select
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
              >
                <option value="">Selecciona ciudad</option>
                <option value="Zaragoza">Zaragoza</option>
                <option value="Huesca">Huesca</option>
                <option value="Teruel">Teruel</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Barrio (opcional)</label>
              <input
                type="text"
                name="barrio"
                value={form.barrio}
                onChange={handleChange}
                placeholder="Ej: Delicias, Centro, Arrabal..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Precio y estancia */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-700">💶 Precio y estancia</h2>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Tipo de estancia *</label>
              <select
                name="tipoEstancia"
                value={form.tipoEstancia}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
              >
                <option value="">Selecciona tipo</option>
                <option value="larga">Larga estancia (meses)</option>
                <option value="corta">Corta estancia (días)</option>
                <option value="ambas">Ambas</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Precio mensual € *</label>
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  required
                  min={50}
                  placeholder="450"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Precio por día €</label>
                <input
                  type="number"
                  name="precioDia"
                  value={form.precioDia}
                  onChange={handleChange}
                  min={10}
                  placeholder="25"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Fianza €</label>
                <input
                  type="number"
                  name="fianza"
                  value={form.fianza}
                  onChange={handleChange}
                  min={0}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Disponible desde *</label>
                <input
                  type="date"
                  name="disponible"
                  value={form.disponible}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-700">🏠 Detalles del piso</h2>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Número de habitaciones *</label>
              <select
                name="habitaciones"
                value={form.habitaciones}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 text-sm"
              >
                <option value="">Selecciona</option>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n} habitación{n > 1 ? 'es' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Servicios */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-700 mb-4">✨ Servicios incluidos</h2>
            <div className="flex flex-wrap gap-2">
              {SERVICIOS_OPCIONES.map(servicio => (
                <button
                  key={servicio}
                  type="button"
                  onClick={() => toggleServicio(servicio)}
                  className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                    form.servicios.includes(servicio)
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {servicio}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-700 text-white py-4 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 text-base"
          >
            {cargando ? 'Publicando...' : '🚀 Publicar piso'}
          </button>

        </form>
      </div>
    </div>
  )
}