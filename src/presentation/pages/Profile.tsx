import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'
import { useAuth } from '../hooks/useAuth'
import { useUsers } from '../hooks/useUsers'
import type { User } from '../../domain/models'

const TRADUCCION_MOTIVO: Record<string, string> = {
  'OCR extraction failed, manual review required': 'No se pudo extraer la información del documento. Requiere revisión manual.',
  'Document is not readable or is of poor quality': 'El documento no es legible o tiene baja calidad. Por favor, sube una imagen más nítida.',
  'Document type does not match the selected category': 'El tipo de documento no coincide con la categoría seleccionada.',
  'Document appears to be expired or invalid': 'El documento parece estar caducado o no es válido.',
  'Multiple people detected in the document': 'Se ha detectado más de una persona en el documento.',
  'Document does not belong to the registered user': 'El documento no pertenece al usuario registrado.',
  'Manual review required - suspicious document': 'El documento requiere revisión manual por posibles irregularidades.',
}

function traducirMotivo(motivo?: string): string {
  if (!motivo) return 'No se ha indicado un motivo.'
  return TRADUCCION_MOTIVO[motivo] || motivo
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const { profile, loading, error, fetchProfile, updateProfile, changePassword, setError, deleteDocument, solicitarRevisionManual } = useUsers()

  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' })
  const [formPassword, setFormPassword] = useState({ passwordActual: '', passwordNueva: '', passwordConfirm: '' })
  const [editando, setEditando] = useState(false)
  const [editandoPassword, setEditandoPassword] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardandoPassword, setGuardandoPassword] = useState(false)
  const [errorPassword, setErrorPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mensajePassword, setMensajePassword] = useState('')
  const [eliminandoDoc, setEliminandoDoc] = useState(false)
  const [errorDoc, setErrorDoc] = useState('')
  const [mensajeDoc, setMensajeDoc] = useState('')
  const [solicitandoRevision, setSolicitandoRevision] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      setForm({
        nombre: profile.nombre || '',
        email: profile.email || '',
        telefono: profile.telefono || '',
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setFormPassword({ ...formPassword, [e.target.name]: e.target.value })

  const guardarCambios = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    setMensaje('')
    try {
      const updated = await updateProfile({ nombre: form.nombre, email: form.email, telefono: form.telefono })
      updateUser({ ...user!, nombre: updated.nombre, email: updated.email, telefono: updated.telefono })
      setEditando(false)
      setMensaje('Perfil actualizado correctamente')
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo actualizar el perfil')
    } finally {
      setGuardando(false)
    }
  }

  const cambiarPassword = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await changePassword({ passwordActual: formPassword.passwordActual, passwordNueva: formPassword.passwordNueva })
      setMensajePassword('Contraseña actualizada correctamente')
      setFormPassword({ passwordActual: '', passwordNueva: '', passwordConfirm: '' })
      setEditandoPassword(false)
    } catch (err: any) {
      setErrorPassword(err.response?.data?.error || 'No se pudo cambiar la contraseña')
    } finally {
      setGuardandoPassword(false)
    }
  }

  const cerrarSesion = () => {
    void logout()
  }

  const handleEliminarDocumento = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu documento de verificación?')) return
    setEliminandoDoc(true)
    setErrorDoc('')
    setMensajeDoc('')
    try {
      await deleteDocument()
      setMensajeDoc('Documento eliminado. Puedes subir uno nuevo desde la página de verificación.')
      fetchProfile()
    } catch (err: any) {
      setErrorDoc(err.response?.data?.error || 'Error al eliminar el documento')
    } finally {
      setEliminandoDoc(false)
    }
  }

  const handleSolicitarRevision = async () => {
    setSolicitandoRevision(true)
    setErrorDoc('')
    setMensajeDoc('')
    try {
      await solicitarRevisionManual()
      setMensajeDoc('Revisión manual solicitada. Un administrador revisará tu documento.')
      fetchProfile()
    } catch (err: any) {
      setErrorDoc(err.response?.data?.error || 'Error al solicitar revisión manual')
    } finally {
      setSolicitandoRevision(false)
    }
  }

  const badgeEstado = (estado: string) => {
    if (estado === 'verificado') return 'bg-accent-400/20 text-primary-900'
    if (estado === 'rechazado') return 'bg-red-100 text-red-700'
    if (estado === 'pendiente-revision-manual') return 'bg-orange-100 text-orange-700'
    if (estado === 'procesando') return 'bg-blue-100 text-blue-700'
    return 'bg-primary-50 text-gray-700 border border-gray-200'
  }

  const textoEstado = (estado: string) => {
    if (estado === 'verificado') return '✅ Verificado'
    if (estado === 'rechazado') return '❌ Rechazado'
    if (estado === 'pendiente-revision-manual') return '🔔 Revisión manual'
    if (estado === 'procesando') return '⚙️ Procesando'
    return '🕐 Pendiente'
  }

  const usuarioMostrado: any = profile || user

  if (!usuarioMostrado || loading) {
    return (
      <PageLayout showCTA={false}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="h-8 w-48 bg-gray-200 rounded-2xl animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-96 bg-white rounded-3xl animate-pulse" />
            <div className="h-96 bg-white rounded-3xl animate-pulse" />
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showCTA={false}>
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
        <div className="absolute inset-0 bg-primary-900/90" />
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-slate-300 hover:text-white mb-4 inline-flex items-center gap-1 transition-colors"
          >
            ← Volver al panel
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-400 text-primary-900 flex items-center justify-center text-2xl font-bold shadow-lg shrink-0">
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
          <div className="bg-accent-400/10 border border-accent-400/30 text-primary-900 rounded-2xl px-4 py-3 mb-6 text-sm font-medium">
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
                      : 'border-primary-900 text-primary-900 hover:bg-primary-50'
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
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 disabled:bg-primary-50 disabled:text-gray-500 focus:outline-none focus:border-primary-900 transition-colors"
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
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 disabled:bg-primary-50 disabled:text-gray-500 focus:outline-none focus:border-primary-900 transition-colors"
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
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 disabled:bg-primary-50 disabled:text-gray-500 focus:outline-none focus:border-primary-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1 block">🎭 Rol</label>
                  <input
                    type="text"
                    value={usuarioMostrado?.rol || ''}
                    disabled
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-primary-50 text-gray-500"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!editando || guardando}
                    className="bg-primary-900 hover:bg-primary-800 text-white px-5 py-3 rounded-2xl font-bold text-sm disabled:opacity-50 transition-all hover:scale-[1.02] shadow-md"
                  >
                    {guardando ? 'Guardando...' : 'Guardar cambios →'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="border border-gray-200 px-5 py-3 rounded-2xl font-bold text-sm text-gray-700 hover:bg-primary-50 transition-all"
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
                      : 'border-primary-900 text-primary-900 hover:bg-primary-50'
                  }`}
                >
                  {editandoPassword ? 'Cancelar' : '🔑 Cambiar contraseña'}
                </button>
              </div>

              {!editandoPassword ? (
                <div className="bg-primary-50 rounded-2xl p-4 border border-gray-100 text-sm text-gray-500">
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
                    <div className="bg-accent-400/10 border border-accent-400/30 text-primary-900 rounded-2xl px-4 py-3 text-sm font-medium">
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
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary-900 transition-colors"
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
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary-900 transition-colors"
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
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary-900 transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={guardandoPassword}
                    className="bg-primary-900 hover:bg-primary-800 text-white px-5 py-3 rounded-2xl font-bold text-sm disabled:opacity-50 transition-all hover:scale-[1.02] shadow-md"
                  >
                    {guardandoPassword ? 'Guardando...' : 'Actualizar contraseña →'}
                  </button>
                </form>
              )}
            </div>

            {/* ── VERIFICACIÓN Y DOCUMENTOS ────────────────────────────── */}
            {usuarioMostrado?.rol === 'docente' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Verificación de identidad</h2>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold mb-5 ${badgeEstado(usuarioMostrado?.verificacionEstado)}`}>
                {textoEstado(usuarioMostrado?.verificacionEstado)}
              </div>

              {/* Info de administración */}
              {usuarioMostrado?.administracion && (
                <div className="bg-primary-50 rounded-2xl p-4 border border-gray-100 mb-5 flex items-center gap-3">
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

                {errorDoc && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
                    ⚠️ {errorDoc}
                  </div>
                )}
                {mensajeDoc && (
                  <div className="bg-accent-400/10 border border-accent-400/30 text-primary-900 rounded-2xl px-4 py-3 text-sm font-medium">
                    ✅ {mensajeDoc}
                  </div>
                )}

                {usuarioMostrado?.tipoDocumento ? (
                  <div className="flex items-center justify-between bg-primary-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900 capitalize">
                          {usuarioMostrado.tipoDocumento === 'nomina' ? 'Nómina'
                            : usuarioMostrado.tipoDocumento === 'nombramiento' ? 'Nombramiento'
                            : usuarioMostrado.tipoDocumento === 'credencial' ? 'Credencial'
                            : usuarioMostrado.tipoDocumento === 'contrato' ? 'Contrato'
                            : usuarioMostrado.tipoDocumento === 'certificado_servicios' ? 'Certificado de servicios'
                            : usuarioMostrado.tipoDocumento === 'resolucion' ? 'Resolución'
                            : usuarioMostrado.tipoDocumento}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Documento de verificación</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {usuarioMostrado?.urlDocumento ? (
                        <a
                          href={usuarioMostrado.urlDocumento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary-900 text-white px-4 py-2 rounded-2xl text-xs font-bold hover:bg-primary-800 transition-all"
                        >
                          Ver documento
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">Sin URL</span>
                      )}
                      {(usuarioMostrado?.verificacionEstado !== 'rechazado' || usuarioMostrado?.manualReviewRequestedAt) && (
                        <button
                          onClick={handleEliminarDocumento}
                          disabled={eliminandoDoc}
                          className="border border-red-200 text-red-500 px-4 py-2 rounded-2xl text-xs font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                        >
                          {eliminandoDoc ? 'Eliminando...' : '🗑 Eliminar'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary-50 rounded-2xl p-4 border border-gray-100 text-sm text-gray-500">
                    📭 No has subido ningún documento todavía.
                  </div>
                )}

                {!usuarioMostrado?.tipoDocumento && (
                  <button
                    onClick={() => navigate('/verificacion-docente')}
                    className="w-full bg-primary-900 hover:bg-primary-800 text-white py-3 rounded-2xl font-bold text-sm transition-all"
                  >
                    📎 Subir documento de verificación
                  </button>
                )}
                {usuarioMostrado?.tipoDocumento && !mensajeDoc && (
                  <p className="text-xs text-gray-400 text-center">
                    Puedes eliminar y volver a subir un documento una vez al día.
                  </p>
                )}
              </div>

              {/* Mensajes de estado */}
              {usuarioMostrado?.verificacionEstado === 'procesando' && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-700 text-sm">
                  ⚙️ Tu documento está siendo <strong>procesado</strong>. Esto puede tardar unos segundos. Recibirás una notificación cuando se complete la verificación.
                </div>
              )}
              {usuarioMostrado?.verificacionEstado === 'pendiente' && (
                <div className="bg-primary-50 border border-gray-200 rounded-2xl p-4 text-gray-700 text-sm">
                  🕐 Tu perfil está <strong>pendiente de revisión</strong>. Recibirás una notificación cuando sea revisado.
                  {(usuarioMostrado?.verificationConfidence != null) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                      <p className="text-xs text-gray-400 font-semibold">Resultado verificación automática</p>
                      <p className="text-xs">Confianza: <strong>{usuarioMostrado.verificationConfidence}%</strong></p>
                      {usuarioMostrado.verificationNotes && (
                        <p className="text-xs">Notas: <strong>{usuarioMostrado.verificationNotes}</strong></p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {usuarioMostrado?.verificacionEstado === 'verificado' && (
                <div className="bg-accent-400/10 border border-accent-400/30 rounded-2xl p-4 text-primary-900 text-sm">
                  <p>✅ Tu cuenta está <strong>verificada</strong>. Ya puedes acceder a todas las funciones de la plataforma.</p>
                  {usuarioMostrado?.verificationDate && (
                    <p className="text-xs text-primary-900/70 mt-2">
                      Verificado el {new Date(usuarioMostrado.verificationDate).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
              )}
              {usuarioMostrado?.verificacionEstado === 'pendiente-revision-manual' && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-orange-700 text-sm">
                  🔔 Tu documento está en <strong>revisión manual</strong>. Un administrador revisará tu documentación. Recibirás una notificación cuando se complete.
                </div>
              )}
              {usuarioMostrado?.verificacionEstado === 'rechazado' && !usuarioMostrado?.manualReviewRequestedAt && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm space-y-4">
                  <div>
                    <p className="font-bold text-red-800">Tu verificación ha sido rechazada</p>
                    <p className="text-red-700 mt-1">{traducirMotivo(usuarioMostrado?.motivoRechazo)}</p>
                  </div>
                  {(usuarioMostrado?.verificationNotes || usuarioMostrado?.verificationConfidence != null) && (
                    <div className="pt-3 border-t border-red-200 space-y-1.5 text-xs text-red-600">
                      {usuarioMostrado?.verificationConfidence != null && (
                        <p>Puntuación de la verificación automática: <strong>{usuarioMostrado.verificationConfidence}%</strong></p>
                      )}
                      {usuarioMostrado.verificationNotes && (
                        <p>Detalles: {traducirMotivo(usuarioMostrado.verificationNotes)}</p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-red-500 leading-relaxed">
                    Si crees que es un error, puedes solicitar una revisión manual. Un administrador revisará tu documento personalmente.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      onClick={handleSolicitarRevision}
                      disabled={solicitandoRevision}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
                    >
                      {solicitandoRevision ? 'Solicitando...' : '🔔 Solicitar revisión manual'}
                    </button>
                  </div>
                </div>
              )}
              {usuarioMostrado?.verificacionEstado === 'rechazado' && usuarioMostrado?.manualReviewRequestedAt && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm space-y-4">
                  <div>
                    <p className="font-bold text-red-800">Tu verificación ha sido rechazada</p>
                    <p className="text-red-700 mt-1">{traducirMotivo(usuarioMostrado?.motivoRechazo)}</p>
                  </div>
                  <p className="text-xs text-red-500 leading-relaxed">
                    La revisión manual de tu documento ha sido rechazada. Puedes eliminar el documento actual y volver a intentarlo con uno nuevo.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      onClick={handleEliminarDocumento}
                      disabled={eliminandoDoc}
                      className="border border-red-200 text-red-500 px-4 py-2 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      {eliminandoDoc ? 'Eliminando...' : '🗑 Eliminar documento'}
                    </button>
                    <button
                      onClick={() => navigate('/verificacion-docente')}
                      disabled={eliminandoDoc}
                      className="bg-primary-900 text-white px-4 py-2 rounded-2xl font-bold text-sm hover:bg-primary-800 transition-all disabled:opacity-50"
                    >
                      Volver a verificarme
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* ── MÁS INFORMACIÓN ──────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Más información</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
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
                  <div key={item.label} className="bg-primary-50 rounded-2xl p-4 border border-gray-100">
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
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-800 text-accent-400 flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg">
                {usuarioMostrado?.nombre?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{usuarioMostrado?.nombre}</h2>
              <p className="text-gray-500 text-sm mt-1">{usuarioMostrado?.email}</p>
              <div className="mt-3 inline-flex items-center px-3 py-1.5 rounded-2xl bg-primary-50 border border-gray-100 text-gray-700 text-sm font-bold">
                {usuarioMostrado?.rol === 'propietario' ? '🏠 Propietario' : '🧑‍🏫 Interino'}
              </div>
              {usuarioMostrado?.administracion && (
                <div className="mt-2 inline-flex items-center px-3 py-1.5 rounded-2xl bg-primary-900 text-accent-400 text-xs font-bold">
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
                  className="w-full bg-primary-900 hover:bg-primary-800 text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
                >
                  📊 Ir a mi panel
                </button>
                <button
                  onClick={() => navigate('/pisos')}
                  className="w-full border border-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-sm hover:bg-primary-50 transition-all"
                >
                  🔍 Buscar pisos
                </button>
                {usuarioMostrado?.rol === 'propietario' && (
                  <button
                    onClick={() => navigate('/pisos/nuevo')}
                    className="w-full bg-accent-400 hover:bg-accent-600 text-primary-900 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
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
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-6 text-white">
              <div className="text-3xl mb-3">💶</div>
              <h3 className="font-bold mb-1">Sin comisiones</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Plataforma gratuita para interinos y propietarios. Negociación directa sin intermediarios.
              </p>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  )
}
