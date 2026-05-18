import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API = import.meta.env.VITE_API_URL

export default function Perfil() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}')

  const [usuario, setUsuario] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })
  const [editando, setEditando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await axios.get(`${API}/api/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUsuario(res.data)
        setForm({
          nombre: res.data.nombre || '',
          email: res.data.email || '',
          telefono: res.data.telefono || '',
        })
      } catch (err) {
        setError('No se pudo cargar tu perfil')
      } finally {
        setCargando(false)
      }
    }

    cargarPerfil()
  }, [token])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const guardarCambios = async e => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    setMensaje('')

    try {
      const res = await axios.put(`${API}/api/usuarios/me`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setUsuario(res.data)
      localStorage.setItem('usuario', JSON.stringify(res.data))
      setEditando(false)
      setMensaje('Perfil actualizado correctamente')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar el perfil')
    } finally {
      setGuardando(false)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const badgeEstado = (estado) => {
    if (estado === 'verificado') return 'bg-green-100 text-green-700'
    if (estado === 'rechazado') return 'bg-red-100 text-red-700'
    return 'bg-amber-100 text-amber-700'
  }

  const textoEstado = (estado) => {
    if (estado === 'verificado') return 'Verificado'
    if (estado === 'rechazado') return 'Rechazado'
    return 'Pendiente'
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-white rounded-3xl animate-pulse" />
            <div className="h-96 bg-white rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const usuarioMostrado = usuario || usuarioLocal

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary-100 text-sm mb-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            ← Volver al panel
          </p>
          <h1 className="text-3xl font-bold">Mi perfil</h1>
          <p className="text-primary-100 mt-2">
            Revisa tus datos, tu verificación y actualiza la información de tu cuenta.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">
            {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Datos personales</h2>
                  <p className="text-gray-400 text-sm">Información básica de tu cuenta.</p>
                </div>
                <button
                  onClick={() => setEditando(v => !v)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {editando ? 'Cancelar edición' : 'Editar perfil'}
                </button>
              </div>

              <form onSubmit={guardarCambios} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 disabled:bg-gray-50 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 disabled:bg-gray-50 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 disabled:bg-gray-50 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Rol</label>
                  <input
                    type="text"
                    value={usuarioMostrado?.rol || ''}
                    disabled
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!editando || guardando}
                    className="bg-primary-700 text-white px-5 py-3 rounded-xl font-semibold disabled:opacity-50"
                  >
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="border border-gray-200 px-5 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Ir al panel
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Estado de verificación</h2>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${badgeEstado(usuarioMostrado?.verificacionEstado)}`}>
                {textoEstado(usuarioMostrado?.verificacionEstado)}
              </div>

              {usuarioMostrado?.verificacionEstado === 'pendiente' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm">
                  Tu perfil está pendiente de revisión. Revisa que tu nombre, email y teléfono sean correctos.
                </div>
              )}

              {usuarioMostrado?.verificacionEstado === 'verificado' && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-800 text-sm">
                  Tu cuenta ya está verificada. Ya puedes usar todas las funciones de la plataforma.
                </div>
              )}

              {usuarioMostrado?.verificacionEstado === 'rechazado' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 text-sm space-y-3">
                  <p className="font-semibold">Tu perfil ha sido rechazado.</p>
                  <p>Motivo: {usuarioMostrado?.motivoRechazo || 'No se ha indicado un motivo.'}</p>
                  <p>Corrige tus datos y vuelve a enviar tu perfil para revisión.</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setEditando(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-700"
                    >
                      Corregir datos
                    </button>
                    {usuarioMostrado?.rol === 'propietario' && (
                      <button
                        onClick={() => navigate('/pisos/nuevo')}
                        className="border border-red-200 text-red-700 px-4 py-2 rounded-xl font-medium hover:bg-red-50"
                      >
                        Publicar piso
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Más información</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-gray-400 mb-1">ID de usuario</p>
                  <p className="font-medium text-gray-800">{usuarioMostrado?._id || usuarioMostrado?.id || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-gray-400 mb-1">Fecha de alta</p>
                  <p className="font-medium text-gray-800">
                    {usuarioMostrado?.createdAt ? new Date(usuarioMostrado.createdAt).toLocaleDateString('es-ES') : '—'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-gray-400 mb-1">Última actualización</p>
                  <p className="font-medium text-gray-800">
                    {usuarioMostrado?.updatedAt ? new Date(usuarioMostrado.updatedAt).toLocaleDateString('es-ES') : '—'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-gray-400 mb-1">Nombre visible</p>
                  <p className="font-medium text-gray-800">{usuarioMostrado?.nombre || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary-700 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                {usuarioMostrado?.nombre?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{usuarioMostrado?.nombre}</h2>
              <p className="text-gray-400 text-sm mt-1">{usuarioMostrado?.email}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                {usuarioMostrado?.rol === 'propietario' ? '🏠 Propietario' : '👨‍🏫 Docente'}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h3 className="font-bold text-gray-800 mb-4">Acciones rápidas</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  Ir a mi panel
                </button>
                <button
                  onClick={() => navigate('/pisos')}
                  className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  Buscar pisos
                </button>
                {usuarioMostrado?.rol === 'propietario' && (
                  <button
                    onClick={() => navigate('/pisos/nuevo')}
                    className="w-full bg-primary-700 text-white py-3 rounded-xl font-semibold hover:bg-primary-800"
                  >
                    Publicar piso
                  </button>
                )}
                <button
                  onClick={cerrarSesion}
                  className="w-full border border-red-200 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}