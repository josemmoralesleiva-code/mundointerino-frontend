import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CityAutocomplete from '../components/ui/CityAutocomplete'
import PageLayout from '../components/layout/PageLayout'
import { useProperties } from '../hooks/useProperties'
import type { City } from '../../domain/models/City'

type EditPropertyFormData = Record<string, any>

const SERVICIOS_OPCIONES = [
  'WiFi', 'Calefacción', 'Aire acondicionado', 'Lavadora',
  'Lavavajillas', 'Microondas', 'TV', 'Parking', 'Ascensor',
  'Terraza', 'Balcón', 'Trastero', 'Amueblado', 'Mascotas permitidas'
]

const PASOS = [
  { numero: 1, titulo: 'Información básica', icono: '📋' },
  { numero: 2, titulo: 'Precio y detalles',  icono: '💶' },
  { numero: 3, titulo: 'Fotos y servicios',  icono: '📸' },
]

export default function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchById, update } = useProperties()

  const [form, setForm] = useState<EditPropertyFormData | null>(null)
  const [paso, setPaso] = useState(1)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  // ✅ Fotos nuevas que el usuario selecciona
  const [imagenesNuevas, setImagenesNuevas] = useState<any[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  // ✅ Solo carga datos — NUNCA guarda automáticamente
  useEffect(() => {
    if (!id) return
    setCargando(true)
    fetchById(id)
      .then((data) => {
        if (data) setForm({
          ...data,
          servicios: data.servicios || [],
          fotosActuales: data.fotos || [],
        })
        else setError('No se pudo cargar el piso')
      })
      .finally(() => setCargando(false))
  }, [id]) // ← SOLO depende de id, nunca de form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => prev ? ({ ...prev, [name]: value }) : prev)
  }

  const toggleServicio = (servicio: string) => {
    setForm(prev => prev ? ({
      ...prev,
      servicios: Array.isArray(prev.servicios) && prev.servicios.includes(servicio)
        ? prev.servicios.filter((s: string) => s !== servicio)
        : [...(prev.servicios || []), servicio]
    }) : prev)
  }

  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || [])
    if (archivos.length > 8) {
      setError('Máximo 8 fotos permitidas.')
      return
    }
    setImagenesNuevas(archivos)
    setPreviews(archivos.map(f => URL.createObjectURL(f)))
    setError('')
  }

  const eliminarPreview = (i: number) => {
    setImagenesNuevas(prev => prev.filter((_: any, idx: number) => idx !== i))
    setPreviews(prev => prev.filter((_: string, idx: number) => idx !== i))
  }

  const eliminarFotoActual = (i: number) => {
    setForm(prev => prev ? ({
      ...prev,
      fotosActuales: Array.isArray(prev.fotosActuales) ? prev.fotosActuales.filter((_: string, idx: number) => idx !== i) : []
    }) : prev)
  }

  const validarPaso = () => {
    if (!form) return false
    if (paso === 1 && (!form.titulo || !form.descripcion || !form.ciudad)) {
      setError('Por favor rellena título, descripción y ciudad.')
      return false
    }
    if (paso === 2 && (!form.precio || !form.tipoEstancia || !form.habitaciones)) {
      setError('Por favor rellena precio, tipo de estancia y habitaciones.')
      return false
    }
    setError('')
    return true
  }

  // ✅ Navegación entre pasos — NO dispara submit
  const handleSiguiente = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (validarPaso()) setPaso(p => p + 1)
  }

  const handleAnterior = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    setPaso(p => p - 1)
  }

  // ✅ Solo se ejecuta al pulsar "Guardar cambios" en paso 3
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (paso !== 3) return // 🔒 Guardia extra
    if (!form) return // 🔒 Guardia extra
    setGuardando(true)
    setError('')
    try {
      const formData = new FormData()

      // Campos de texto
      formData.append('titulo', form.titulo || '')
      formData.append('descripcion', form.descripcion || '')
      formData.append('ciudad', form.ciudad || '')
      formData.append('comunidad', form.comunidad || '')
      formData.append('provincia', form.provincia || '')
      formData.append('barrio', form.barrio || '')
      formData.append('contacto', form.contacto || '')
      formData.append('precio', form.precio || '')
      formData.append('precioDia', form.precioDia || '')
      formData.append('fianza', form.fianza || '')
      formData.append('habitaciones', form.habitaciones || '')
      formData.append('banos', form.banos || '')
      formData.append('metros', form.metros || '')
      formData.append('planta', form.planta || '')
      formData.append('tipoEstancia', form.tipoEstancia || '')
      formData.append('disponible', form.disponible?.substring(0, 10) || '')
      formData.append('activo', form.activo !== false ? 'true' : 'false')

      // Servicios
      form.servicios.forEach((s: string) => formData.append('servicios', s))

      // Fotos actuales que NO se han eliminado
      form.fotosActuales.forEach((url: string) => formData.append('fotosActuales', url))

      // Fotos nuevas (si ha seleccionado)
      imagenesNuevas.forEach((img: any) => formData.append('imagenes', img))

      await update(id!, formData)
      setExito(true)
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar los cambios')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl animate-pulse mb-3">🏠</div>
        <p className="text-gray-400">Cargando datos del piso...</p>
      </div>
    </div>
  )

  if (error && !form) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="text-primary-700 hover:underline text-sm">
          ← Volver al panel
        </button>
      </div>
    </div>
  )

  if (!form) return null

  return (
    <PageLayout showCTA={false}>
      <Navbar />

      {/* HERO */}
      <section className="relative py-14 px-6 text-white"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}>
        <div className="absolute inset-0 bg-primary-900/80" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-primary-200 text-sm mb-1 font-medium">Editando anuncio</p>
          <h1 className="text-2xl md:text-3xl font-bold">{form.titulo}</h1>
          <p className="text-primary-100 mt-1 text-sm">
            📍 {form.ciudad}{form.barrio ? `, ${form.barrio}` : ''} · 💶 {form.precio}€/mes
          </p>
        </div>
      </section>

      {/* BARRA DE PROGRESO */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            {PASOS.map((p, i) => (
              <div key={p.numero} className="flex items-center flex-1">
                <button type="button"
                  onClick={() => { if (p.numero < paso) { setError(''); setPaso(p.numero) } }}
                  className={`flex items-center gap-2 ${paso >= p.numero ? 'text-primary-700' : 'text-gray-400'} ${p.numero < paso ? 'cursor-pointer' : 'cursor-default'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    paso > p.numero  ? 'bg-primary-700 border-primary-700 text-white'
                    : paso === p.numero ? 'border-primary-700 text-primary-700 bg-primary-50'
                    : 'border-gray-200 text-gray-400 bg-white'
                  }`}>
                    {paso > p.numero ? '✓' : p.numero}
                  </div>
                  <span className="hidden md:block text-xs font-medium">{p.titulo}</span>
                </button>
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

        {exito && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <span>✅</span> Cambios guardados correctamente. Volviendo al panel...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ✅ noValidate evita submit nativo del navegador */}
        <form onSubmit={handleSubmit} noValidate>

          {/* PASO 1 */}
          {paso === 1 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">📋 Información básica</h2>
                <p className="text-gray-400 text-sm">Título, descripción y ubicación del piso.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Título del anuncio *</label>
                <input type="text" name="titulo" value={form.titulo || ''} onChange={handleChange}
                  maxLength={100}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción *</label>
                <textarea name="descripcion" value={form.descripcion || ''} onChange={handleChange}
                  maxLength={1000} rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors resize-none" />
                <p className="text-xs text-gray-400 mt-1 text-right">{(form.descripcion || '').length}/1000</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Ciudad *</label>
                  <div className="border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary-500 transition-colors">
                    <CityAutocomplete
                      value={form.ciudad || ''}
                      onChange={(c: City | null) =>
                        setForm((f: any) => ({
                          ...f,
                          ciudad: c?.nombre ?? '',
                          provincia: c?.provincia ?? '',
                          comunidad: c?.comunidad ?? '',
                        }))
                      }
                      placeholder="Busca una ciudad..."
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Barrio (opcional)</label>
                  <input type="text" name="barrio" value={form.barrio || ''} onChange={handleChange}
                    placeholder="Ej: Delicias, Centro..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Contacto (teléfono o email)</label>
                <input type="text" name="contacto" value={form.contacto || ''} onChange={handleChange}
                  placeholder="600 123 456 o propietario@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">💶 Precio y detalles</h2>
                <p className="text-gray-400 text-sm">Actualiza precios, tipo de estancia y características.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de estancia *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[['larga','📅 Larga'],['corta','🌙 Corta'],['ambas','✅ Ambas']].map(([val, label]) => (
                    <button key={val} type="button"
                      onClick={() => setForm(prev => prev ? ({ ...prev, tipoEstancia: val }) : prev)}
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
                  { label: 'Precio mensual (€) *', name: 'precio', placeholder: '450', min: 50 },
                  { label: 'Precio por día (€)', name: 'precioDia', placeholder: '25', min: 10 },
                  { label: 'Fianza (€)', name: 'fianza', placeholder: '0', min: 0 },
                  { label: 'Metros cuadrados', name: 'metros', placeholder: '70', min: 10 },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">{f.label}</label>
                    <input type="number" name={f.name} value={form[f.name] || ''} onChange={handleChange}
                      min={f.min} placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Habitaciones *</label>
                  <select name="habitaciones" value={form.habitaciones || ''} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors">
                    <option value="">Selecciona</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} habitación{n > 1 ? 'es' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Baños</label>
                  <select name="banos" value={form.banos || ''} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors">
                    <option value="">Selecciona</option>
                    {[1,2,3].map(n => <option key={n} value={n}>{n} baño{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Planta</label>
                  <input type="text" name="planta" value={form.planta || ''} onChange={handleChange}
                    placeholder="Ej: 3º, Bajo, Ático..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Disponible desde</label>
                  <input type="date" name="disponible" value={form.disponible?.substring(0,10) || ''} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors [color-scheme:light]" />
                </div>
              </div>

              {/* Toggle disponibilidad */}
              <div className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                form.activo !== false ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
              }`}
                onClick={() => setForm(prev => prev ? ({ ...prev, activo: !prev.activo }) : prev)}>
                <div>
                  <p className="font-medium text-sm text-gray-800">Estado del anuncio</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {form.activo !== false ? '✅ El piso aparece como disponible' : '⏸️ El piso está pausado'}
                  </p>
                </div>
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  form.activo !== false ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    form.activo !== false ? 'left-7' : 'left-1'
                  }`} />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 — Fotos + Servicios */}
          {paso === 3 && (
            <div className="space-y-5">

              {/* FOTOS ACTUALES */}
              {form.fotosActuales?.length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">🖼️ Fotos actuales</h2>
                    <p className="text-gray-400 text-sm">Pulsa la ✕ para eliminar una foto existente.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {form.fotosActuales.map((url: string, i: number) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`foto-${i}`}
                          className="w-full h-28 object-cover rounded-xl border border-gray-200" />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 bg-primary-700 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            Principal
                          </span>
                        )}
                        <button type="button" onClick={() => eliminarFotoActual(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBIR FOTOS NUEVAS */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">📸 Añadir fotos nuevas</h2>
                  <p className="text-gray-400 text-sm">Las fotos nuevas se añadirán a las existentes. Máximo 8 en total.</p>
                </div>

                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-primary-200 rounded-2xl cursor-pointer bg-primary-50 hover:bg-primary-100 transition-colors">
                  <div className="text-center pointer-events-none">
                    <div className="text-3xl mb-2">📷</div>
                    <p className="text-primary-700 font-semibold text-sm">Haz clic para seleccionar fotos</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG, WEBP · Máx. 5MB por foto</p>
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
                      {previews.length} foto{previews.length > 1 ? 's' : ''} nueva{previews.length > 1 ? 's' : ''} seleccionada{previews.length > 1 ? 's' : ''}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {previews.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`nueva-${i}`}
                            className="w-full h-28 object-cover rounded-xl border-2 border-primary-200" />
                          <span className="absolute top-1 left-1 bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            Nueva
                          </span>
                          <button type="button" onClick={() => eliminarPreview(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                  <p className="text-gray-400 text-sm">Actualiza los servicios que ofrece el alojamiento.</p>
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
                <h3 className="font-bold text-gray-800 mb-4">📝 Resumen de cambios</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['📍', `${form.ciudad}${form.barrio ? `, ${form.barrio}` : ''}`],
                    ['💶', `${form.precio}€/mes${form.precioDia ? ` · ${form.precioDia}€/día` : ''}`],
                    ['🛏', `${form.habitaciones} hab.${form.banos ? ` · ${form.banos} baños` : ''}`],
                    ['📅', form.tipoEstancia === 'larga' ? 'Larga estancia' : form.tipoEstancia === 'corta' ? 'Corta estancia' : 'Ambas'],
                    ['🖼️', `${form.fotosActuales?.length || 0} actuales + ${previews.length} nuevas`],
                    ['🔘', form.activo !== false ? 'Disponible' : 'Pausado'],
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

          {/* BOTONES NAVEGACIÓN */}
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
              <button type="submit" disabled={guardando || exito}
                className="px-8 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold disabled:opacity-50 transition-all flex items-center gap-2">
                {guardando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : '💾 Guardar cambios'}
              </button>
            )}
          </div>

        </form>
      </div>
    </PageLayout>
  )
}
