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
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al publicar el piso')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center">
            <img src="/img/logo.png" alt="Profinter" className="h-10" />
          </button>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600 hover:text-primary-700 font-medium">
            ← Volver
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative py-16 px-6 text-white"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary-900/80"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Publicar piso</h1>
          <p className="text-primary-100 text-lg max-w-2xl">
            Rellena los datos de tu alojamiento y conecta con docentes que necesitan vivienda.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* INFORMACIÓN BÁSICA */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-semibold text-gray-800 text-lg mb-5">📋 Información básica</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Título del anuncio *</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Ej: Piso luminoso cerca del colegio"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción *</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                  maxLength={1000}
                  rows={5}
                  placeholder="Describe el piso, el entorno, condiciones..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* UBICACIÓN */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-semibold text-gray-800 text-lg mb-5">📍 Ubicación</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ciudad *</label>
                <select
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Selecciona ciudad</option>
                  <option value="Zaragoza">Zaragoza</option>
                  <option value="Huesca">Huesca</option>
                  <option value="Teruel">Teruel</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Barrio (opcional)</label>
                <input
                  type="text"
                  name="barrio"
                  value={form.barrio}
                  onChange={handleChange}
                  placeholder="Ej: Delicias, Centro, Arrabal..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* PRECIO Y ESTANCIA */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-semibold text-gray-800 text-lg mb-5">💶 Precio y estancia</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de estancia *</label>
                <select
                  name="tipoEstancia"
                  value={form.tipoEstancia}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Selecciona tipo</option>
                  <option value="larga">Larga estancia (meses)</option>
                  <option value="corta">Corta estancia (días)</option>
                  <option value="ambas">Ambas</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Precio mensual € *</label>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                    required
                    min={50}
                    placeholder="450"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Precio por día €</label>
                  <input
                    type="number"
                    name="precioDia"
                    value={form.precioDia}
                    onChange={handleChange}
                    min={10}
                    placeholder="25"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Fianza €</label>
                  <input
                    type="number"
                    name="fianza"
                    value={form.fianza}
                    onChange={handleChange}
                    min={0}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Disponible desde *</label>
                  <input
                    type="date"
                    name="disponible"
                    value={form.disponible}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DETALLES */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-semibold text-gray-800 text-lg mb-5">🏠 Detalles del piso</h2>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Número de habitaciones *</label>
              <select
                name="habitaciones"
                value={form.habitaciones}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value="">Selecciona</option>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n} habitación{n > 1 ? 'es' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SERVICIOS */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-semibold text-gray-800 text-lg mb-5">✨ Servicios incluidos</h2>
            <div className="flex flex-wrap gap-2">
              {SERVICIOS_OPCIONES.map(servicio => (
                <button
                  key={servicio}
                  type="button"
                  onClick={() => toggleServicio(servicio)}
                  className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                    form.servicios.includes(servicio)
                      ? 'bg-primary-700 text-white border-primary-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
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
            className="bg-primary-700 text-white py-4 rounded-xl font-semibold hover:bg-primary-800 disabled:opacity-50 text-base transition-all hover:scale-[1.01]"
          >
            {cargando ? 'Publicando...' : '🚀 Publicar piso'}
          </button>
        </form>
      </div>
    </div>
  )
}