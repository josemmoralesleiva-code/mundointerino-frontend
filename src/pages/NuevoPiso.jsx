import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API = import.meta.env.VITE_API_URL

const SERVICIOS_OPCIONES = [
  'WiFi', 'Calefacción', 'Aire acondicionado', 'Lavadora',
  'Lavavajillas', 'Microondas', 'TV', 'Parking', 'Ascensor',
  'Terraza', 'Balcón', 'Trastero', 'Amueblado', 'Mascotas permitidas'
]

const PASOS = [
  { numero: 1, titulo: 'Información básica', icono: '📋' },
  { numero: 2, titulo: 'Precio y detalles', icono: '💶' },
  { numero: 3, titulo: 'Fotos y servicios', icono: '📸' },
]

export default function NuevoPiso() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [imagenes, setImagenes] = useState([])
  const [previews, setPreviews] = useState([])
  const [form, setForm] = useState({
    titulo: '', descripcion: '', ciudad: '', barrio: '',
    precio: '', precioDia: '', tipoEstancia: '', habitaciones: '',
    banos: '', metros: '', planta: '', fianza: '', disponible: '', servicios: []
  })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleServicio = servicio => {
    setForm(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter(s => s !== servicio)
        : [...prev.servicios, servicio]
    }))
  }

  const handleImagenesChange = (e) => {
    const archivos = Array.from(e.target.files || [])
    if (archivos.length > 8) {
      setError('Máximo 8 fotos permitidas.')
      return
    }
    setImagenes(archivos)
    setPreviews(archivos.map(f => URL.createObjectURL(f)))
    setError('')
  }

  const eliminarImagen = (i) => {
    setImagenes(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const validarPaso = () => {
    if (paso === 1 && (!form.titulo || !form.descripcion || !form.ciudad)) {
      setError('Por favor rellena título, descripción y ciudad.')
      return false
    }
    if (paso === 2 && (!form.precio || !form.tipoEstancia || !form.habitaciones || !form.disponible)) {
      setError('Por favor rellena precio, tipo de estancia, habitaciones y fecha.')
      return false
    }
    setError('')
    return true
  }

  // ✅ Navegación separada del submit — NO usan el form
  const handleSiguiente = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (validarPaso()) setPaso(p => p + 1)
  }

  const handleAnterior = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    setPaso(p => p - 1)
  }

  // ✅ Solo se ejecuta en paso 3 con el botón de submit real
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (paso !== 3) return // 🔒 Guardia extra: solo publica en paso 3
    setCargando(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('titulo', form.titulo)
      formData.append('descripcion', form.descripcion)
      formData.append('ciudad', form.ciudad)
      formData.append('barrio', form.barrio || '')
      formData.append('precio', form.precio)
      formData.append('precioDia', form.precioDia || '')
      formData.append('tipoEstancia', form.tipoEstancia)
      formData.append('habitaciones', form.habitaciones)
      formData.append('banos', form.banos || '')
      formData.append('metros', form.metros || '')
      formData.append('planta', form.planta || '')
      formData.append('fianza', form.fianza || '')
      formData.append('disponible', form.disponible)
      form.servicios.forEach(s => formData.append('servicios', s))
      imagenes.forEach(img => formData.append('imagenes', img))

      await axios.post(`${API}/api/pisos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
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
      <Navbar />

      {/* HERO */}
      <section className="relative py-14 px-6 text-white"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
        <div className="absolute inset-0 bg-primary-900/80" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Publicar piso</h1>
          <p className="text-primary-100 text-lg">Conecta con docentes interinos que necesitan alojamiento en Aragón.</p>
        </div>
      </section>

      {/* BARRA DE PROGRESO */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            {PASOS.map((p, i) => (
              <div key={p.numero} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${paso >= p.numero ? 'text-primary-700' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    paso > p.numero ? 'bg-primary-700 border-primary-700 text-white'
                    : paso === p.numero ? 'border-primary-700 text-primary-700 bg-primary-50'
                    : 'border-gray-200 text-gray-400 bg-white'
                  }`}>
                    {paso > p.numero ? '✓' : p.numero}
                  </div>
                  <span className="hidden md:block text-xs font-medium">{p.titulo}</span>
                </div>
                {i < PASOS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 transition-all ${paso > p.numero ? 'bg-primary-700' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-primary-700 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((paso - 1) / (PASOS.length - 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ✅ onSubmit solo actúa en paso 3 */}
        <form onSubmit={handleSubmit} noValidate>

          {/* PASO 1 */}
          {paso === 1 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">📋 Información básica</h2>
                <p className="text-gray-400 text-sm">Cuéntanos qué ofreces y dónde está.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Título del anuncio *</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange}
                  maxLength={100} placeholder="Ej: Piso luminoso cerca del colegio"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción *</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                  maxLength={1000} rows={5} placeholder="Describe el piso, el entorno, condiciones..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors resize-none" />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.descripcion.length}/1000</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Ciudad *</label>
                  <select name="ciudad" value={form.ciudad} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors">
                    <option value="">Selecciona ciudad</option>
                    <option value="Zaragoza">Zaragoza</option>
                    <option value="Huesca">Huesca</option>
                    <option value="Teruel">Teruel</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Barrio (opcional)</label>
                  <input type="text" name="barrio" value={form.barrio} onChange={handleChange}
                    placeholder="Ej: Delicias, Centro, Arrabal..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">💶 Precio y detalles</h2>
                <p className="text-gray-400 text-sm">Precios, estancia y características del inmueble.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de estancia *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[['larga','📅 Larga'],['corta','🌙 Corta'],['ambas','✅ Ambas']].map(([val, label]) => (
                    <button key={val} type="button"
                      onClick={() => setForm(prev => ({ ...prev, tipoEstancia: val }))}
                      className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.tipoEstancia === val
                          ? 'border-primary-700 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Precio mensual (€) *', name: 'precio', type: 'number', placeholder: '450', min: 50 },
                  { label: 'Precio por día (€)', name: 'precioDia', type: 'number', placeholder: '25', min: 10 },
                  { label: 'Fianza (€)', name: 'fianza', type: 'number', placeholder: '0', min: 0 },
                  { label: 'Metros cuadrados', name: 'metros', type: 'number', placeholder: '70', min: 10 },
                  { label: 'Planta', name: 'planta', type: 'text', placeholder: 'Ej: 3º, Bajo, Ático...' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{f.label}</label>
                    <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                      placeholder={f.placeholder} min={f.min}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Habitaciones *</label>
                  <select name="habitaciones" value={form.habitaciones} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors">
                    <option value="">Selecciona</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} habitación{n > 1 ? 'es' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Baños</label>
                  <select name="banos" value={form.banos} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors">
                    <option value="">Selecciona</option>
                    {[1,2,3].map(n => <option key={n} value={n}>{n} baño{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Disponible desde *</label>
                  <input type="date" name="disponible" value={form.disponible} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {paso === 3 && (
            <div className="space-y-5">

              {/* FOTOS */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">📸 Fotos del piso</h2>
                  <p className="text-gray-400 text-sm">Sube hasta 8 fotos. Los pisos con fotos reciben 5x más contactos.</p>
                </div>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary-200 rounded-2xl cursor-pointer bg-primary-50 hover:bg-primary-100 transition-colors">
                  <div className="text-center pointer-events-none">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-primary-700 font-semibold text-sm">Haz clic para seleccionar fotos</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG, WEBP · Máx. 5MB por foto · Hasta 8 fotos</p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImagenesChange}
                    className="hidden"
                  />
                </label>

                {previews.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      {previews.length} foto{previews.length > 1 ? 's' : ''} seleccionada{previews.length > 1 ? 's' : ''}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {previews.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`preview-${i}`}
                            className="w-full h-28 object-cover rounded-xl border border-gray-200" />
                          {i === 0 && (
                            <span className="absolute top-1 left-1 bg-primary-700 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                              Principal
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => eliminarImagen(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SERVICIOS */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">🛎️ Servicios incluidos</h2>
                  <p className="text-gray-400 text-sm">Marca todo lo que incluye el alojamiento.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SERVICIOS_OPCIONES.map(s => (
                    <button key={s} type="button" onClick={() => toggleServicio(s)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                        form.servicios.includes(s)
                          ? 'border-primary-700 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
                {form.servicios.length > 0 && (
                  <p className="text-sm text-primary-700 font-medium">
                    ✓ {form.servicios.length} servicio{form.servicios.length > 1 ? 's' : ''} seleccionado{form.servicios.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* RESUMEN */}
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl border border-primary-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">📝 Resumen del anuncio</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['📍', `${form.ciudad}${form.barrio ? `, ${form.barrio}` : ''}`],
                    ['💶', `${form.precio}€/mes${form.precioDia ? ` · ${form.precioDia}€/día` : ''}`],
                    ['🛏', `${form.habitaciones} hab.${form.banos ? ` · ${form.banos} baños` : ''}`],
                    ['📅', `Desde ${form.disponible}`],
                    ['📐', form.metros ? `${form.metros} m²` : '—'],
                    ['📸', `${previews.length} foto${previews.length !== 1 ? 's' : ''}`],
                  ].map(([icono, valor]) => (
                    <div key={icono} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-primary-100">
                      <span>{icono}</span>
                      <span className="text-gray-700 font-medium truncate">{valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BOTONES — FUERA de los pasos pero DENTRO del form */}
          <div className="flex justify-between mt-6">
            {paso > 1 ? (
              <button type="button" onClick={handleAnterior}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-all">
                ← Anterior
              </button>
            ) : <div />}

            {paso < 3 ? (
              <button type="button" onClick={handleSiguiente}
                className="px-6 py-3 rounded-xl bg-primary-700 text-white hover:bg-primary-800 font-semibold transition-all">
                Siguiente →
              </button>
            ) : (
              <button type="submit" disabled={cargando}
                className="px-8 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold disabled:opacity-50 transition-all flex items-center gap-2">
                {cargando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publicando...
                  </>
                ) : '🚀 Publicar anuncio'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  )
}