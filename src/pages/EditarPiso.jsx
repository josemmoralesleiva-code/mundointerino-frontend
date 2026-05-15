import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function EditarPiso() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  useEffect(() => {
    axios.get(`${API_URL}/api/pisos/${id}`)
      .then(res => setForm(res.data))
      .catch(() => setError('No se pudo cargar el piso'))
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${API_URL}/api/pisos/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExito(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError('Error al guardar los cambios')
    }
  }

  if (error) return <p className="p-8 text-red-500">{error}</p>
  if (!form) return <p className="p-8 text-gray-400">Cargando...</p>

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <button onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← Volver al panel
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">✏️ Editar piso</h1>

        {exito && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
            ✅ Cambios guardados. Volviendo al panel...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input name="titulo" value={form.titulo || ''} onChange={handleChange}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Ciudad</label>
            <select name="ciudad" value={form.ciudad || ''} onChange={handleChange}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">Selecciona ciudad</option>
              <option value="Zaragoza">Zaragoza</option>
              <option value="Huesca">Huesca</option>
              <option value="Teruel">Teruel</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Precio (€/mes)</label>
              <input name="precio" type="number" value={form.precio || ''} onChange={handleChange}
                className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Habitaciones</label>
              <input name="habitaciones" type="number" value={form.habitaciones || ''} onChange={handleChange}
                className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Tipo de estancia</label>
            <select name="tipoEstancia" value={form.tipoEstancia || ''} onChange={handleChange}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="larga">Larga temporada</option>
              <option value="corta">Corta temporada</option>
              <option value="ambas">Ambas</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="descripcion" value={form.descripcion || ''} onChange={handleChange} rows={4}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Contacto (teléfono o email)</label>
            <input name="contacto" value={form.contacto || ''} onChange={handleChange}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input type="checkbox" name="disponible" id="disponible"
              checked={form.disponible || false} onChange={handleChange}
              className="w-4 h-4 accent-blue-600" />
            <label htmlFor="disponible" className="text-sm text-gray-700">Disponible ahora</label>
          </div>

          <button type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl mt-2 transition">
            Guardar cambios
          </button>

        </form>
      </div>
    </div>
  )
}