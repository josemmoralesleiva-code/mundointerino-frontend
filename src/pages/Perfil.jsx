import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API = import.meta.env.VITE_API_URL

export default function Perfil() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}')

  const [usuario, setUsuario] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })
  const [formPassword, setFormPassword] = useState({ passwordActual: '', passwordNueva: '', passwordConfirm: '' })
  const [editando, setEditando] = useState(false)
  const [editandoPassword, setEditandoPassword] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [guardandoPassword, setGuardandoPassword] = useState(false)
  const [error, setError] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mensajePassword, setMensajePassword] = useState('')

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await axios.get(`${API}/api/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleChangePassword = e => setFormPassword({ ...formPassword, [e.target.name]: e.target.value })

  const guardarCambios = async e => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    setMensaje('')
    try {
      const res = await axios.put(`${API}/api/usuarios/me`, form, {
        headers: { Authorization: `Bearer ${token}` },
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

  const cambiarPassword = async e => {
    e.preventDefault()
    setErrorPassword('')
    setMensajePassword('')
    if (formPassword.passwordNueva !== formPassword.passwordConfirm) {
      setErrorPassword('Las contraseñas nuevas no coinciden')
      return
    }
    if (formPassword.passwordNueva.length < 6) {
      setErrorPassword('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setGuardandoPassword(true)
    try {
      await axios.put(
        `${API}/api/usuarios/me/password`,
        { passwordActual: formPassword.passwordActual, passwordNueva: formPassword.passwordNueva },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMensajePassword('Contraseña actualizada correctamente')
      setFormPassword({ passwordActual: '', passwordNueva: '', passwordConfirm: '' })
      setEditandoPassword(false)
    } catch (err) {
      setErrorPassword(err.response?.data?.error || 'No se pudo cambiar la contraseña')
    } finally {
      setGuardandoPassword(false)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const badgeEstado = estado => {
    if (estado === 'verificado') return 'bg-[#D4AF37]/20 text-[#0F172A]'
    if (estado === 'rechazado') return 'bg-red-100 text-red-700'
    return 'bg-[#F8F5EF] text-gray-700 border border-gray-200'
  }

  const textoEstado = estado => {
    if (estado === 'verificado') return '✅ Verificado'
    if (estado === 'rechazado') return '❌ Rechazado'
    return '🕐 Pendiente'
  }

  const usuarioMostrado = usuario || usuarioLocal

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="h-8 w-48 bg-gray-200 rounded-2xl animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-white rounded-3xl animate-pulse" />
            <div className="h-96 bg-white rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      {/* HERO */}
      <section
        className="relative text-white py-10 px-6 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#111827]/90" />
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-slate-300 hover:text-white mb-4 inline-flex items-center gap-1 transition-colors"
          >
            ← Volver al panel
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-[#0F172A] flex items-center justify-center text-2xl font-bold shadow-lg shrink-0">
              {usuarioMostrado?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                {usuarioMostrado?.nombre}
              </h1>
              <p className="text-slate-300 text-sm mt-0.5">
                {usuarioMostrado?.rol === 'propietario' ? '🏠 Propietario' : '🧑‍🏫 Interino'} ·{' '}
                {usuarioMostrado?.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-5 text-xs md:text-sm text-slate-100">
            <span>👤 Gestiona tus datos personales</span>
            <span>🔒 Acceso seguro</span>
            <span>✅ Verificación de cuenta</span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ALERTAS GLOBALES */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}
        {mensaje && (
          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#0F172A] rounded-2xl px-4 py-3 mb-6 text-sm font-medium">
            ✅ {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── COLUMNA PRINCIPAL ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Datos personales */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Datos personales</h2>
                  <p className="text-gray-500 text-sm">Información básica de tu cuenta.</p>
                </div>
                <button
                  onClick={() => setEditando(v => !v)}
                  className={`px-4 py-2 rounded-2xl border text-sm font-bold transition-all hover:scale-[1.02] ${
                    editando
                      ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      : 'border-[#0F172A] text-[#0F172A] hover:bg-[#F8F5EF]'
                  }`}
                >
                  {editando ? 'Cancelar edición' : '✏️ Editar perfil'}
                </button>
              </div>

              <form onSubmit={guardarCambios} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1 block">👤 Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 disabled:bg-[#F8F5EF] disabled:text-gray-500 focus:outline-none focus:border-[#0F172A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1 block">📧 Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 disabled:bg-[#F8F5EF] disabled:text-gray-500 focus:outline-none focus:border-[#0F172A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1 block">📱 Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    disabled={!editando}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 disabled:bg-[#F8F5EF] disabled:text-gray-500 focus:outline-none focus:border-[#0F172A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1 block">🎭 Rol</label>
                  <input
                    type="text"
                    value={usuarioMostrado?.rol || ''}
                    disabled
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-[#F8F5EF] text-gray-500"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!editando || guardando}
                    className="bg-[#0F172A] hover:bg-[#1E3A5F] text-white px-5 py-3 rounded-2xl font-bold text-sm disabled:opacity-50 transition-all hover:scale-[1.02] shadow-md"
                  >
                    {guardando ? 'Guardando...' : 'Guardar cambios →'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="border border-gray-200 px-5 py-3 rounded-2xl font-bold text-sm text-gray-700 hover:bg-[#F8F5EF] transition-all"
                  >
                    Ir al panel
                  </button>
                </div>
              </form>
            </div>

            {/* ── CAMBIAR CONTRASEÑA ────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Contraseña</h2>
                  <p className="text-gray-500 text-sm">Cambia tu contraseña de acceso.</p>
                </div>
                <button
                  onClick={() => { setEditandoPassword(v => !v); setErrorPassword(''); setMensajePassword('') }}
                  className={`px-4 py-2 rounded-2xl border text-sm font-bold transition-all hover:scale-[1.02] ${
                    editandoPassword
                      ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      : 'border-[#0F172A] text-[#0F172A] hover:bg-[#F8F5EF]'
                  }`}
                >
                  {editandoPassword ? 'Cancelar' : '🔑 Cambiar contraseña'}
                </button>
              </div>

              {!editandoPassword ? (
                <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100 text-sm text-gray-500">
                  🔒 Tu contraseña está protegida. Haz clic en "Cambiar contraseña" para modificarla.
                </div>
              ) : (
                <form onSubmit={cambiarPassword} className="space-y-4">
                  {errorPassword && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
                      ⚠️ {errorPassword}
                    </div>
                  )}
                  {mensajePassword && (
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#0F172A] rounded-2xl px-4 py-3 text-sm font-medium">
                      ✅ {mensajePassword}
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-400 font-semibold mb-1 block">🔒 Contraseña actual</label>
                    <input
                      type="password"
                      name="passwordActual"
                      value={formPassword.passwordActual}
                      onChange={handleChangePassword}
                      required
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F172A] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 font-semibold mb-1 block">🔑 Nueva contraseña</label>
                      <input
                        type="password"
                        name="passwordNueva"
                        value={formPassword.passwordNueva}
                        onChange={handleChangePassword}
                        required
                        placeholder="Mínimo 6 caracteres"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F172A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-semibold mb-1 block">🔑 Confirmar contraseña</label>
                      <input
                        type="password"
                        name="passwordConfirm"
                        value={formPassword.passwordConfirm}
                        onChange={handleChangePassword}
                        required
                        placeholder="Repite la nueva contraseña"
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F172A] transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={guardandoPassword}
                    className="bg-[#0F172A] hover:bg-[#1E3A5F] text-white px-5 py-3 rounded-2xl font-bold text-sm disabled:opacity-50 transition-all hover:scale-[1.02] shadow-md"
                  >
                    {guardandoPassword ? 'Guardando...' : 'Actualizar contraseña →'}
                  </button>
                </form>
              )}
            </div>

            {/* ── VERIFICACIÓN Y DOCUMENTOS ────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Verificación de identidad</h2>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold mb-5 ${badgeEstado(usuarioMostrado?.verificacionEstado)}`}>
                {textoEstado(usuarioMostrado?.verificacionEstado)}
              </div>

              {/* Info de administración */}
              {usuarioMostrado?.administracion && (
                <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100 mb-5 flex items-center gap-3">
                  <span className="text-2xl">
                    {usuarioMostrado.administracion === 'educacion' ? '🎓'
                      : usuarioMostrado.administracion === 'sanidad' ? '🩺'
                      : usuarioMostrado.administracion === 'justicia' ? '⚖️' : '🏛️'}
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Administración registrada</p>
                    <p className="font-bold text-gray-900 capitalize">{usuarioMostrado.administracion}</p>
                  </div>
                </div>
              )}

              {/* Documento subido */}
              <div className="space-y-3 mb-5">
                <p className="text-sm font-semibold text-gray-700">Documento aportado</p>

                {usuarioMostrado?.tipoDocumento ? (
                  <div className="flex items-center justify-between bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900 capitalize">
                          {usuarioMostrado.tipoDocumento === 'nomina' ? 'Nómina'
                            : usuarioMostrado.tipoDocumento === 'nombramiento' ? 'Nombramiento'
                            : usuarioMostrado.tipoDocumento === 'credencial' ? 'Credencial'
                            : 'Contrato'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Documento de verificación</p>
                      </div>
                    </div>
                    {usuarioMostrado?.urlDocumento ? (
                      <a
                        href={usuarioMostrado.urlDocumento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0F172A] text-white px-4 py-2 rounded-2xl text-xs font-bold hover:bg-[#1E3A5F] transition-all"
                      >
                        Ver documento
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">Sin URL</span>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100 text-sm text-gray-500">
                    📭 No has subido ningún documento todavía.
                  </div>
                )}
              </div>

              {/* Mensajes de estado */}
              {usuarioMostrado?.verificacionEstado === 'pendiente' && (
                <div className="bg-[#F8F5EF] border border-gray-200 rounded-2xl p-4 text-gray-700 text-sm">
                  🕐 Tu perfil está <strong>pendiente de revisión</strong>. Recibirás una notificación cuando sea revisado.
                </div>
              )}
              {usuarioMostrado?.verificacionEstado === 'verificado' && (
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4 text-[#0F172A] text-sm">
                  ✅ Tu cuenta está <strong>verificada</strong>. Ya puedes acceder a todas las funciones de la plataforma.
                </div>
              )}
              {usuarioMostrado?.verificacionEstado === 'rechazado' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 text-sm space-y-3">
                  <p className="font-bold">Tu verificación ha sido rechazada.</p>
                  <p>Motivo: {usuarioMostrado?.motivoRechazo || 'No se ha indicado un motivo.'}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => navigate('/verificacion-docente')}
                      className="bg-[#0F172A] text-white px-4 py-2 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all"
                    >
                      Volver a verificarme
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── MÁS INFORMACIÓN ──────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Más información</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'ID de usuario', valor: usuarioMostrado?._id || usuarioMostrado?.id || '—' },
                  {
                    label: 'Fecha de alta',
                    valor: usuarioMostrado?.createdAt
                      ? new Date(usuarioMostrado.createdAt).toLocaleDateString('es-ES')
                      : '—',
                  },
                  {
                    label: 'Última actualización',
                    valor: usuarioMostrado?.updatedAt
                      ? new Date(usuarioMostrado.updatedAt).toLocaleDateString('es-ES')
                      : '—',
                  },
                  { label: 'Nombre visible', valor: usuarioMostrado?.nombre || '—' },
                ].map(item => (
                  <div key={item.label} className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                    <p className="text-gray-400 text-xs font-semibold mb-1">{item.label}</p>
                    <p className="font-bold text-gray-900 truncate">{item.valor}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── COLUMNA LATERAL ───────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Avatar card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] text-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg">
                {usuarioMostrado?.nombre?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{usuarioMostrado?.nombre}</h2>
              <p className="text-gray-500 text-sm mt-1">{usuarioMostrado?.email}</p>
              <div className="mt-3 inline-flex items-center px-3 py-1.5 rounded-2xl bg-[#F8F5EF] border border-gray-100 text-gray-700 text-sm font-bold">
                {usuarioMostrado?.rol === 'propietario' ? '🏠 Propietario' : '🧑‍🏫 Interino'}
              </div>
              {usuarioMostrado?.administracion && (
                <div className="mt-2 inline-flex items-center px-3 py-1.5 rounded-2xl bg-[#0F172A] text-[#D4AF37] text-xs font-bold">
                  {usuarioMostrado.administracion === 'educacion' ? '🎓' 
                    : usuarioMostrado.administracion === 'sanidad' ? '🩺' 
                    : usuarioMostrado.administracion === 'justicia' ? '⚖️' : '🏛️'
                  } {usuarioMostrado.administracion.charAt(0).toUpperCase() + usuarioMostrado.administracion.slice(1)}
                </div>
              )}
            </div>

            {/* Estado verificación lateral */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Estado de cuenta</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Verificación</span>
                  <span className={`font-bold text-xs px-2 py-1 rounded-full ${badgeEstado(usuarioMostrado?.verificacionEstado)}`}>
                    {textoEstado(usuarioMostrado?.verificacionEstado)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Documento</span>
                  <span className="font-bold text-xs text-gray-700">
                    {usuarioMostrado?.tipoDocumento ? '📄 Subido' : '📭 Sin documento'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Sector</span>
                  <span className="font-bold text-xs text-gray-700 capitalize">
                    {usuarioMostrado?.administracion || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-gray-900 mb-4">Acciones rápidas</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
                >
                  📊 Ir a mi panel
                </button>
                <button
                  onClick={() => navigate('/mundo')}
                  className="w-full border border-[#0F172A] text-[#0F172A] py-3 rounded-2xl font-bold text-sm hover:bg-[#F8F5EF] transition-all"
                >
                  🌍 Espacio Mundo
                </button>
                <button
                  onClick={() => navigate('/pisos')}
                  className="w-full border border-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-sm hover:bg-[#F8F5EF] transition-all"
                >
                  🔍 Buscar pisos
                </button>
                {usuarioMostrado?.rol === 'propietario' && (
                  <button
                    onClick={() => navigate('/pisos/nuevo')}
                    className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
                  >
                    🏠 Publicar piso
                  </button>
                )}
                <button
                  onClick={cerrarSesion}
                  className="w-full border border-red-200 text-red-500 py-3 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all"
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-3xl p-6 text-white">
              <div className="text-3xl mb-3">💶</div>
              <h3 className="font-bold mb-1">Sin comisiones</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Plataforma gratuita para interinos y propietarios. Negociación directa sin intermediarios.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* CTA BANNER */}
      <section className="bg-[#0F172A] py-14 px-6 text-center text-white relative overflow-hidden mt-10">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
            backgroundSize: 'cover',
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            ¿Tienes un piso cerca de un hospital, colegio o juzgado?
          </h2>
          <p className="text-slate-100 mb-8 text-base md:text-lg">
            Únete a los propietarios que ya publican en MundoInterino. Publicación gratuita, inquilinos con nómina pública garantizada.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/pisos/nuevo"
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:scale-[1.02] shadow-lg inline-flex items-center justify-center"
            >
              Publicar mi piso gratis
            </Link>
            <Link
              to="/sobre-nosotros"
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all border border-white/20 inline-flex items-center justify-center backdrop-blur-md"
            >
              Saber más
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B1220] text-white py-10 px-6">
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