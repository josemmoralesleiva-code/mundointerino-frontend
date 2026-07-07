import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { useAuth } from '../hooks/useAuth'
import { useUsers } from '../hooks/useUsers'
import { useAdmin } from '../hooks/useAdmin'
import { useAnuncios } from '../hooks/useAnuncios'
import ImpersonationBanner, { saveAdminSession } from '../components/ImpersonationBanner'
import type { User } from '../../domain/models'
import type { Anuncio } from '../../domain/models/Anuncio'
import type { LastRegisteredUser } from '../../infrastructure/dto/admin.dto'

const ADMINISTRACIONES: Record<string, { label: string; icono: string }> = {
  educacion: { label: 'Educación', icono: '🎓' },
  sanidad:   { label: 'Sanidad',   icono: '🩺' },
  justicia:  { label: 'Justicia',  icono: '⚖️' },
  otros:     { label: 'Otros',     icono: '🧩' },
}

const TIPOS_DOC: Record<string, { label: string; icono: string }> = {
  nomina:                { label: 'Nómina',                icono: '💶' },
  nombramiento:          { label: 'Nombramiento',          icono: '📄' },
  credencial:            { label: 'Credencial',            icono: '🪪' },
  contrato:              { label: 'Contrato',              icono: '📋' },
  certificado_servicios: { label: 'Cert. servicios',       icono: '📜' },
  resolucion:            { label: 'Resolución',            icono: '📝' },
}

const TIPOS_ANUNCIO: Record<string, { label: string; icono: string }> = {
  convocatoria:     { label: 'Convocatoria',     icono: '📢' },
  noticia:          { label: 'Noticia',          icono: '📰' },
  evento:           { label: 'Evento',           icono: '📅' },
  otro:             { label: 'Otro',             icono: '📌' },
}

const EMPTY_ANUNCIO_FORM = {
  titulo: '',
  descripcion: '',
  administracion: 'educacion',
  tipo: 'convocatoria',
  url: '',
  activo: true,
  destacado: false,
  fechaExpiracion: '',
}

export default function Admin() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { users, loading: usersLoading, setUsers, fetchAll, verifyUser, reVerifyUser } = useUsers()
  const { stats, usuariosPage, loading: adminLoading, error: adminError, fetchStats, fetchUsuarios, updateUsuario, impersonate } = useAdmin()
  const { anunciosPage, loading: anunciosLoading, error: anunciosError, fetchAll: fetchAnuncios, create: createAnuncio, update: updateAnuncio, remove: deleteAnuncio } = useAnuncios()

  const [tab, setTab] = useState<'dashboard' | 'usuarios' | 'anuncios'>('dashboard')
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Users state
  const [filtro, setFiltro] = useState('todos')
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [rechazandoId, setRechazandoId] = useState<string | null>(null)
  const [usuarioDetalle, setUsuarioDetalle] = useState<User | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [usuarioEditando, setUsuarioEditando] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ rol: '', verificacionEstado: '' })

  // Anuncios state
  const [filtroAdmin, setFiltroAdmin] = useState('')
  const [filtroTipoAnuncio, setFiltroTipoAnuncio] = useState('')
  const [paginaAnuncios, setPaginaAnuncios] = useState(1)
  const [anuncioForm, setAnuncioForm] = useState(EMPTY_ANUNCIO_FORM)
  const [mostrarFormAnuncio, setMostrarFormAnuncio] = useState(false)
  const [editandoAnuncioId, setEditandoAnuncioId] = useState<string | null>(null)
  const [anuncioAEliminar, setAnuncioAEliminar] = useState<Anuncio | null>(null)

  // Auth guard
  useEffect(() => {
    if (user?.rol !== 'admin') { navigate('/'); return }
  }, [])

  // Fetch stats on mount
  useEffect(() => { fetchStats() }, [])

  // Fetch users when tab or filter changes
  useEffect(() => {
    if (tab === 'usuarios') {
      fetchUsuarios({ pagina, limite: 10, filtro, search: busqueda || undefined })
    }
  }, [tab, filtro, busqueda, pagina])

  // Fetch anuncios when tab or filter changes
  useEffect(() => {
    if (tab === 'anuncios') {
      fetchAnuncios({ administracion: filtroAdmin || undefined, tipo: filtroTipoAnuncio || undefined, pagina: paginaAnuncios, limite: 10 })
    }
  }, [tab, filtroAdmin, filtroTipoAnuncio, paginaAnuncios])

  // Reset pagination when filters change
  useEffect(() => { setPagina(1) }, [filtro, busqueda])
  useEffect(() => { setPaginaAnuncios(1) }, [filtroAdmin, filtroTipoAnuncio])

  const verificar = async (id: string, estado: string, motivo = '') => {
    try {
      const updated = await verifyUser(id, { estado, motivoRechazo: motivo })
      if (usuarioDetalle?._id === id) setUsuarioDetalle(updated)
      setRechazandoId(null)
      setMotivoRechazo('')
      fetchUsuarios({ pagina, limite: 10, filtro, search: busqueda || undefined })
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al verificar')
    }
  }

  const reVerificar = async (id: string) => {
    try {
      const updated = await reVerifyUser(id)
      if (usuarioDetalle?._id === id) setUsuarioDetalle(updated)
      fetchUsuarios({ pagina, limite: 10, filtro, search: busqueda || undefined })
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al re-verificar')
    }
  }

  const suplantar = async (u: User) => {
    try {
      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        saveAdminSession(currentUser)
      }
      const res = await impersonate(u._id)
      useAuthStore.getState().login(res.usuario)
      navigate('/dashboard')
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al suplantar usuario')
    }
  }

  const abrirEditar = (u: User) => {
    setUsuarioEditando(u)
    setEditForm({ rol: u.rol, verificacionEstado: u.verificacionEstado })
  }

  const guardarEdicion = async () => {
    if (!usuarioEditando) return
    try {
      const updated = await updateUsuario(usuarioEditando._id, editForm)
      setUsuarioEditando(null)
      fetchUsuarios({ pagina, limite: 10, filtro, search: busqueda || undefined })
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al actualizar usuario')
    }
  }

  const isPDF = (url: string) =>
    url?.includes('/raw/upload/') ||
    url?.toLowerCase().endsWith('.pdf') ||
    url?.toLowerCase().includes('.pdf')

  // ── ANUNCIOS HANDLERS ──
  const abrirCrearAnuncio = () => {
    setEditandoAnuncioId(null)
    setAnuncioForm(EMPTY_ANUNCIO_FORM)
    setMostrarFormAnuncio(true)
  }

  const abrirEditarAnuncio = (a: Anuncio) => {
    setEditandoAnuncioId(a._id)
    setAnuncioForm({
      titulo: a.titulo,
      descripcion: a.descripcion,
      administracion: a.administracion,
      tipo: a.tipo,
      url: a.url || '',
      activo: a.activo,
      destacado: a.destacado,
      fechaExpiracion: a.fechaExpiracion ? a.fechaExpiracion.slice(0, 10) : '',
    })
    setMostrarFormAnuncio(true)
  }

  const guardarAnuncio = async () => {
    try {
      const data = {
        ...anuncioForm,
        url: anuncioForm.url || undefined,
        fechaExpiracion: anuncioForm.fechaExpiracion || undefined,
      }
      if (editandoAnuncioId) {
        await updateAnuncio(editandoAnuncioId, data)
      } else {
        await createAnuncio(data)
      }
      setMostrarFormAnuncio(false)
      setEditandoAnuncioId(null)
      fetchAnuncios({ administracion: filtroAdmin || undefined, tipo: filtroTipoAnuncio || undefined, pagina: paginaAnuncios, limite: 10 })
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al guardar anuncio')
    }
  }

  const confirmarEliminarAnuncio = async () => {
    if (!anuncioAEliminar) return
    try {
      await deleteAnuncio(anuncioAEliminar._id)
      setAnuncioAEliminar(null)
      fetchAnuncios({ administracion: filtroAdmin || undefined, tipo: filtroTipoAnuncio || undefined, pagina: paginaAnuncios, limite: 10 })
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al eliminar anuncio')
    }
  }

  const usuariosList = usuariosPage?.usuarios || []
  const anunciosList = anunciosPage?.anuncios || []
  const usuariosTotal = usuariosPage?.total || 0
  const usuariosTotalPages = usuariosPage?.totalPaginas || 1
  const anunciosTotalPages = anunciosPage?.totalPaginas || 1

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <ImpersonationBanner />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#F8F5EF]/95 backdrop-blur-xl text-[#0F172A] border-b border-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <img src="/img/logo.png" alt="MundoInterino" className="h-16 w-auto object-contain" />
            <span className="hidden sm:block text-xl font-bold tracking-tight">
              <span className="text-[#0F172A]">Mundo</span>
              <span className="text-[#2F5DAA]">Interino</span>
            </span>
          </button>
          <div className="flex items-center gap-3">
            <span className="bg-[#D4AF37]/15 text-[#8A6510] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/20">
              ADMIN
            </span>
            <button
              onClick={() => { void logout() }}
              className="hidden md:block text-sm text-slate-700 hover:text-[#0F172A] font-medium"
            >
              Cerrar sesión
            </button>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-black/5 transition-colors"
              aria-label="Abrir menú"
              aria-expanded={menuAbierto}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {menuAbierto && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {[
              { key: 'dashboard' as const, label: '📊 Dashboard' },
              { key: 'usuarios' as const, label: '👥 Usuarios' },
              { key: 'anuncios' as const, label: '📢 Anuncios' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setMenuAbierto(false) }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? 'bg-[#0F172A] text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
            <div className="my-2 border-t border-slate-100" />
            <button
              onClick={() => { setMenuAbierto(false); void logout() }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="bg-[#0F172A] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Panel de administración</h1>
          <p className="text-slate-300 text-sm">Gestiona verificaciones de usuarios, documentación y accesos.</p>
          {stats && (
            <div className="flex flex-wrap gap-6 mt-4 text-xs text-slate-300">
              <span>👥 {stats.usuarios.total} usuarios registrados</span>
              <span>⏳ {stats.usuarios.pendientes} pendientes de revisión</span>
              <span>✅ {stats.usuarios.verificados} verificados</span>
              <span>❌ {stats.usuarios.rechazados} rechazados</span>
            </div>
          )}
        </div>
      </section>

      {/* ERROR BANNER */}
      {(adminError || anunciosError) && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm">
            <p className="font-bold mb-1">No hay conexión con el servicio</p>
            <p>{adminError || anunciosError}</p>
            <p className="text-xs text-amber-600 mt-1">
              Algunas funciones pueden no estar disponibles. Inténtalo de nuevo en unos momentos.
            </p>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-white rounded-3xl p-1.5 border border-gray-100 shadow-sm">
          {[
            { key: 'dashboard' as const, label: '📊 Dashboard' },
            { key: 'usuarios' as const, label: '👥 Usuarios' },
            { key: 'anuncios' as const, label: '📢 Anuncios' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                tab === t.key
                  ? 'bg-[#0F172A] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0F172A] hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ──────────────────────────────────── DASHBOARD ──────────────────────────────────── */}
        {tab === 'dashboard' && (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total usuarios', valor: stats?.usuarios.total || 0, icono: '👥', color: 'bg-[#F8F5EF] text-[#0F172A] border-gray-200' },
                { label: 'Docentes', valor: stats?.usuarios.porRol?.docente || 0, icono: '🧑‍🏫', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { label: 'Propietarios', valor: stats?.usuarios.porRol?.propietario || 0, icono: '🏠', color: 'bg-purple-50 text-purple-700 border-purple-100' },
                { label: 'Pendientes', valor: stats?.usuarios.pendientes || 0, icono: '⏳', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                { label: 'Nuevos este mes', valor: stats?.usuarios.nuevosUltimoMes || 0, icono: '✨', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-2 border ${s.color}`}>
                    {s.icono}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.valor}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* ÚLTIMOS REGISTRADOS */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Últimos usuarios registrados</h2>
              {adminLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {(stats?.ultimosRegistrados || []).map((u: LastRegisteredUser) => (
                    <div key={u._id} className="bg-[#F8F5EF] rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-xl flex items-center justify-center text-sm font-bold text-[#D4AF37] shrink-0">
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{u.nombre}</p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.rol === 'docente' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {u.rol === 'docente' ? '🧑‍🏫 Interino' : '🏠 Propietario'}
                        </span>
                        <span className="text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  ))}
                  {(!stats?.ultimosRegistrados || stats.ultimosRegistrados.length === 0) && (
                    <p className="text-gray-400 text-center py-8">No hay registros recientes.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* ──────────────────────────────────── USUARIOS ──────────────────────────────────── */}
        {tab === 'usuarios' && (
          <>
            {/* STATS RESUMEN */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total',       valor: stats?.usuarios.total || 0, color: 'bg-[#F8F5EF] text-[#0F172A] border-gray-200', icono: '👥' },
                { label: 'Pendientes',  valor: stats?.usuarios.pendientes || 0, color: 'bg-amber-50 text-amber-700 border-amber-100', icono: '⏳' },
                { label: 'Verificados', valor: stats?.usuarios.verificados || 0, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icono: '✅' },
                { label: 'Rechazados',  valor: stats?.usuarios.rechazados || 0, color: 'bg-rose-50 text-rose-600 border-rose-100', icono: '❌' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-2 border ${s.color}`}>
                    {s.icono}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.valor}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* LISTA */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Usuarios registrados</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o email..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-[#0F172A] transition-colors w-full sm:w-56"
                  />
                  <div className="flex gap-1 bg-[#F8F5EF] rounded-2xl p-1 border border-gray-100">
                    {[
                      ['pendiente', '⏳ Pendientes'],
                      ['verificado', '✅ Verificados'],
                      ['rechazado', '❌ Rechazados'],
                      ['todos', '👥 Todos'],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setFiltro(val)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                          filtro === val
                            ? 'bg-white text-[#0F172A] shadow-sm font-bold'
                            : 'text-slate-600 hover:text-[#0F172A]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {adminLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
              ) : usuariosList.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">👥</div>
                  <p>No hay usuarios en esta categoría.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {usuariosList.map(u => (
                      <div key={u._id} className="bg-[#F8F5EF] rounded-3xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-2xl flex items-center justify-center text-lg font-bold text-[#D4AF37] shrink-0">
                              {u.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-gray-900">{u.nombre}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  u.rol === 'docente' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {u.rol === 'docente' ? '🧑‍🏫 Interino' : '🏠 Propietario'}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  u.verificacionEstado === 'pendiente'  ? 'bg-amber-100 text-amber-700'    :
                                  u.verificacionEstado === 'verificado' ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-rose-100 text-rose-600'
                                }`}>
                                  {u.verificacionEstado === 'pendiente'  ? '⏳ Pendiente'  :
                                   u.verificacionEstado === 'verificado' ? '✅ Verificado' : '❌ Rechazado'}
                                </span>
                                {u.administracion && (
                                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#0F172A]/10 text-[#0F172A]">
                                    {ADMINISTRACIONES[u.administracion]?.icono} {ADMINISTRACIONES[u.administracion]?.label}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-500 text-sm">{u.email} · {u.telefono || 'Sin teléfono'}</p>
                              <p className="text-gray-400 text-xs mt-0.5">
                                Alta: {new Date(u.createdAt!).toLocaleDateString('es-ES')}
                                {u.tipoDocumento && (
                                  <span className="ml-2">
                                    · Doc: {TIPOS_DOC[u.tipoDocumento]?.icono} {TIPOS_DOC[u.tipoDocumento]?.label}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0 flex-wrap">
                            <button
                              onClick={() => setUsuarioDetalle(u)}
                              className="bg-white border border-gray-200 text-[#0F172A] hover:bg-[#F8F5EF] px-4 py-2 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02]"
                            >
                              👁 Ver detalle
                            </button>
                            <button
                              onClick={() => abrirEditar(u)}
                              className="bg-[#0F172A] text-white hover:bg-[#1E3A5F] px-4 py-2 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02]"
                            >
                              ✏️ Editar
                            </button>
                            {u._id !== user?.id && (
                              <button
                                onClick={() => suplantar(u)}
                                className="bg-amber-500 text-amber-900 hover:bg-amber-600 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                              >
                                🎭 Suplantar
                              </button>
                            )}
                            {u.verificacionEstado === 'pendiente' && (
                              <>
                                <button
                                  onClick={() => verificar(u._id, 'verificado')}
                                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                                >
                                  ✅ Verificar
                                </button>
                                <button
                                  onClick={() => setRechazandoId(u._id)}
                                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                                >
                                  ❌ Rechazar
                                </button>
                              </>
                            )}
                            {u.verificacionEstado === 'verificado' && (
                              <button
                                onClick={() => verificar(u._id, 'rechazado')}
                                className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                              >
                                Revocar
                              </button>
                            )}
                            {u.verificacionEstado === 'rechazado' && (
                              <button
                                onClick={() => verificar(u._id, 'verificado')}
                                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                              >
                                ✅ Verificar igualmente
                              </button>
                            )}
                          </div>
                        </div>

                        {rechazandoId === u._id && (
                          <div className="mt-4 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                            <p className="text-sm font-bold text-rose-700 mb-2">Motivo del rechazo (opcional)</p>
                            <textarea
                              value={motivoRechazo}
                              onChange={e => setMotivoRechazo(e.target.value)}
                              placeholder="Ej: Documentación insuficiente, información incorrecta..."
                              rows={2}
                              className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400 resize-none mb-3"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => verificar(u._id, 'rechazado', motivoRechazo)}
                                className="bg-[#0F172A] text-white px-4 py-2 rounded-2xl text-sm font-bold hover:bg-[#1E3A5F] transition-all"
                              >
                                Confirmar rechazo
                              </button>
                              <button
                                onClick={() => { setRechazandoId(null); setMotivoRechazo('') }}
                                className="bg-white text-gray-600 px-4 py-2 rounded-2xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* PAGINACIÓN USUARIOS */}
                  {usuariosTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        disabled={pagina === 1}
                        onClick={() => setPagina(p => p - 1)}
                        className="px-3 py-1.5 rounded-xl text-sm font-bold border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"
                      >
                        ← Anterior
                      </button>
                      <span className="text-sm text-gray-500">
                        Página {pagina} de {usuariosTotalPages}
                      </span>
                      <button
                        disabled={pagina === usuariosTotalPages}
                        onClick={() => setPagina(p => p + 1)}
                        className="px-3 py-1.5 rounded-xl text-sm font-bold border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* ──────────────────────────────────── ANUNCIOS ──────────────────────────────────── */}
        {tab === 'anuncios' && (
          <>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Anuncios</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={filtroAdmin}
                    onChange={e => setFiltroAdmin(e.target.value)}
                    className="border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A] transition-colors"
                  >
                    <option value="">Todas las administraciones</option>
                    {Object.entries(ADMINISTRACIONES).map(([val, inf]) => (
                      <option key={val} value={val}>{inf.icono} {inf.label}</option>
                    ))}
                  </select>
                  <select
                    value={filtroTipoAnuncio}
                    onChange={e => setFiltroTipoAnuncio(e.target.value)}
                    className="border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A] transition-colors"
                  >
                    <option value="">Todos los tipos</option>
                    {Object.entries(TIPOS_ANUNCIO).map(([val, inf]) => (
                      <option key={val} value={val}>{inf.icono} {inf.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={abrirCrearAnuncio}
                    className="bg-[#0F172A] text-white px-5 py-2 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all hover:scale-[1.02] shadow-md"
                  >
                    + Nuevo anuncio
                  </button>
                </div>
              </div>

              {anunciosLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
              ) : anunciosList.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">📢</div>
                  <p>No hay anuncios.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {anunciosList.map(a => (
                      <div key={a._id} className="bg-[#F8F5EF] rounded-3xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-gray-900">{a.titulo}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                a.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
                              }`}>
                                {a.activo ? '✅ Activo' : '⏸ Inactivo'}
                              </span>
                              {a.destacado && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#D4AF37]/20 text-[#8A6510]">
                                  ⭐ Destacado
                                </span>
                              )}
                            </div>
                            <p className="text-gray-500 text-sm">{a.descripcion}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {ADMINISTRACIONES[a.administracion]?.icono} {ADMINISTRACIONES[a.administracion]?.label}
                              {' · '}
                              {TIPOS_ANUNCIO[a.tipo]?.icono} {TIPOS_ANUNCIO[a.tipo]?.label}
                              {a.fechaExpiracion && (
                                <span> · Expira: {new Date(a.fechaExpiracion).toLocaleDateString('es-ES')}</span>
                              )}
                              {a.url && <span> · <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-[#2F5DAA] underline">Enlace</a></span>}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => abrirEditarAnuncio(a)}
                              className="bg-white border border-gray-200 text-[#0F172A] hover:bg-[#F8F5EF] px-4 py-2 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02]"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => setAnuncioAEliminar(a)}
                              className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                            >
                              🗑 Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PAGINACIÓN ANUNCIOS */}
                  {anunciosTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        disabled={paginaAnuncios === 1}
                        onClick={() => setPaginaAnuncios(p => p - 1)}
                        className="px-3 py-1.5 rounded-xl text-sm font-bold border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"
                      >
                        ← Anterior
                      </button>
                      <span className="text-sm text-gray-500">
                        Página {paginaAnuncios} de {anunciosTotalPages}
                      </span>
                      <button
                        disabled={paginaAnuncios === anunciosTotalPages}
                        onClick={() => setPaginaAnuncios(p => p + 1)}
                        className="px-3 py-1.5 rounded-xl text-sm font-bold border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all"
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* ──────────────────────────────────── MODAL DETALLE USUARIO ──────────────────────────────────── */}
      {usuarioDetalle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setUsuarioDetalle(null) }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">

            <div className="bg-[#0F172A] rounded-t-3xl px-8 py-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-[#0F172A] flex items-center justify-center text-2xl font-bold">
                  {usuarioDetalle.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{usuarioDetalle.nombre}</h3>
                  <p className="text-slate-300 text-sm">{usuarioDetalle.email}</p>
                </div>
              </div>
              <button
                onClick={() => setUsuarioDetalle(null)}
                className="text-white/60 hover:text-white text-2xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6">

              {/* Datos personales */}
              <div>
                <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Datos personales</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Nombre',   valor: usuarioDetalle.nombre },
                    { label: 'Email',    valor: usuarioDetalle.email },
                    { label: 'Teléfono', valor: usuarioDetalle.telefono || '—' },
                    { label: 'Rol',      valor: usuarioDetalle.rol === 'docente' ? '🧑‍🏫 Interino' : '🏠 Propietario' },
                    { label: 'ID',       valor: usuarioDetalle._id },
                    {
                      label: 'Alta',
                      valor: new Date(usuarioDetalle.createdAt!).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      }),
                    },
                  ].map(item => (
                    <div key={item.label} className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-1">{item.label}</p>
                      <p className="font-bold text-gray-900 text-sm truncate">{item.valor}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verificación */}
              <div>
                <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Verificación</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold mb-1">Estado</p>
                    <span className={`inline-flex items-center text-sm font-bold px-3 py-1 rounded-full ${
                      usuarioDetalle.verificacionEstado === 'verificado' ? 'bg-emerald-100 text-emerald-700' :
                      usuarioDetalle.verificacionEstado === 'rechazado'  ? 'bg-rose-100 text-rose-600'       :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {usuarioDetalle.verificacionEstado === 'verificado' ? '✅ Verificado' :
                       usuarioDetalle.verificacionEstado === 'rechazado'  ? '❌ Rechazado'  : '⏳ Pendiente'}
                    </span>
                  </div>
                  <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold mb-1">Administración</p>
                    <p className="font-bold text-gray-900 text-sm">
                      {usuarioDetalle.administracion
                        ? `${ADMINISTRACIONES[usuarioDetalle.administracion]?.icono} ${ADMINISTRACIONES[usuarioDetalle.administracion]?.label}`
                        : '—'}
                    </p>
                  </div>
                  <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold mb-1">Tipo documento</p>
                    <p className="font-bold text-gray-900 text-sm">
                      {usuarioDetalle.tipoDocumento
                        ? `${TIPOS_DOC[usuarioDetalle.tipoDocumento]?.icono} ${TIPOS_DOC[usuarioDetalle.tipoDocumento]?.label}`
                        : '—'}
                    </p>
                  </div>
                  {usuarioDetalle.motivoRechazo && (
                    <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 col-span-2">
                      <p className="text-xs text-rose-400 font-semibold mb-1">Motivo de rechazo</p>
                      <p className="text-rose-700 text-sm font-medium">{usuarioDetalle.motivoRechazo}</p>
                    </div>
                  )}
                  {usuarioDetalle.verificationConfidence != null && (
                    <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Confianza OCR</p>
                      <p className="font-bold text-gray-900 text-sm">{usuarioDetalle.verificationConfidence}%</p>
                    </div>
                  )}
                  {usuarioDetalle.verificationNotes && (
                    <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Notas verificación</p>
                      <p className="font-bold text-gray-900 text-sm">{usuarioDetalle.verificationNotes}</p>
                    </div>
                  )}
                  {usuarioDetalle.verificationDate && (
                    <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Fecha verificación</p>
                      <p className="font-bold text-gray-900 text-sm">
                        {new Date(usuarioDetalle.verificationDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                  {usuarioDetalle.verificationType && (
                    <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Tipo verificación</p>
                      <p className="font-bold text-gray-900 text-sm capitalize">{usuarioDetalle.verificationType}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* DOCUMENTO */}
              {usuarioDetalle.urlDocumento ? (
                <div>
                  <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Documento adjunto</h4>
                  <div className="bg-[#F8F5EF] rounded-2xl border border-gray-200 overflow-hidden">
                    {isPDF(usuarioDetalle.urlDocumento) ? (
                      <div className="p-6 text-center space-y-4">
                        <div className="text-5xl">📄</div>
                        <p className="text-gray-600 text-sm font-medium">Documento PDF</p>
                        <div className="flex gap-3 justify-center flex-wrap">
                          <a
                            href={usuarioDetalle.urlDocumento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#0F172A] text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all hover:scale-[1.02] inline-block"
                          >
                            📎 Abrir en nueva pestaña
                          </a>
                          <a
                            href={usuarioDetalle.urlDocumento}
                            download
                            className="border border-gray-200 text-gray-700 bg-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all inline-block"
                          >
                            ⬇️ Descargar
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <img
                          src={usuarioDetalle.urlDocumento}
                          alt="Documento de verificación"
                          className="w-full max-h-80 object-contain p-4"
                        />
                        <div className="border-t border-gray-100 p-4 flex gap-3 justify-center">
                          <a
                            href={usuarioDetalle.urlDocumento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#0F172A] text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all hover:scale-[1.02] inline-block"
                          >
                            🔍 Ver imagen completa
                          </a>
                          <a
                            href={usuarioDetalle.urlDocumento}
                            download
                            className="border border-gray-200 text-gray-700 bg-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all inline-block"
                          >
                            ⬇️ Descargar
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-700 text-sm text-center">
                  ⚠️ Este usuario aún no ha subido documentación de verificación.
                </div>
              )}

              {/* Acciones en modal */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Acción de verificación</h4>
                {usuarioDetalle.verificacionEstado === 'pendiente' && (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => verificar(usuarioDetalle._id, 'verificado')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.01]"
                      >
                        ✅ Verificar usuario
                      </button>
                      <button
                        onClick={() => setRechazandoId(usuarioDetalle._id === rechazandoId ? null : usuarioDetalle._id)}
                        className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 py-3 rounded-2xl font-bold text-sm border border-rose-200 transition-all"
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                    {usuarioDetalle.administracion && (
                      <button
                        onClick={() => reVerificar(usuarioDetalle._id)}
                        className="w-full bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all"
                      >
                        🔄 Re-verificar automáticamente
                      </button>
                    )}
                    {rechazandoId === usuarioDetalle._id && (
                      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                        <textarea
                          value={motivoRechazo}
                          onChange={e => setMotivoRechazo(e.target.value)}
                          placeholder="Motivo del rechazo (opcional)..."
                          rows={2}
                          className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none mb-3"
                        />
                        <button
                          onClick={() => verificar(usuarioDetalle._id, 'rechazado', motivoRechazo)}
                          className="bg-[#0F172A] text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all w-full"
                        >
                          Confirmar rechazo
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {usuarioDetalle.verificacionEstado === 'verificado' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => verificar(usuarioDetalle._id, 'rechazado')}
                      className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 py-3 rounded-2xl font-bold text-sm transition-all"
                    >
                      Revocar verificación
                    </button>
                    <button
                      onClick={() => reVerificar(usuarioDetalle._id)}
                      className="w-full bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all"
                    >
                      🔄 Re-verificar automáticamente
                    </button>
                  </div>
                )}
                {usuarioDetalle.verificacionEstado === 'rechazado' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => verificar(usuarioDetalle._id, 'verificado')}
                      className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 rounded-2xl font-bold text-sm transition-all"
                    >
                      ✅ Verificar igualmente
                    </button>
                    <button
                      onClick={() => reVerificar(usuarioDetalle._id)}
                      className="w-full bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all"
                    >
                      🔄 Re-verificar automáticamente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────── MODAL EDITAR USUARIO ──────────────────────────────────── */}
      {usuarioEditando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setUsuarioEditando(null) }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="bg-[#0F172A] rounded-t-3xl px-6 py-5 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">Editar usuario</h3>
              <button onClick={() => setUsuarioEditando(null)} className="text-white/60 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">{usuarioEditando.nombre}</p>
                <p className="text-xs text-gray-400">{usuarioEditando.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Rol</label>
                <select
                  value={editForm.rol}
                  onChange={e => setEditForm(f => ({ ...f, rol: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                >
                  <option value="docente">🧑‍🏫 Interino (docente)</option>
                  <option value="propietario">🏠 Propietario</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Estado verificación</label>
                <select
                  value={editForm.verificacionEstado}
                  onChange={e => setEditForm(f => ({ ...f, verificacionEstado: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                >
                  <option value="pendiente">⏳ Pendiente</option>
                  <option value="verificado">✅ Verificado</option>
                  <option value="rechazado">❌ Rechazado</option>
                </select>
              </div>
              <button
                onClick={guardarEdicion}
                className="w-full bg-[#0F172A] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────── MODAL FORMULARIO ANUNCIO ──────────────────────────────────── */}
      {mostrarFormAnuncio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setMostrarFormAnuncio(false) }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="bg-[#0F172A] rounded-t-3xl px-6 py-5 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">{editandoAnuncioId ? 'Editar anuncio' : 'Nuevo anuncio'}</h3>
              <button onClick={() => setMostrarFormAnuncio(false)} className="text-white/60 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Título *</label>
                <input
                  type="text"
                  value={anuncioForm.titulo}
                  onChange={e => setAnuncioForm(f => ({ ...f, titulo: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                  placeholder="Título del anuncio"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Descripción *</label>
                <textarea
                  value={anuncioForm.descripcion}
                  onChange={e => setAnuncioForm(f => ({ ...f, descripcion: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A] resize-none"
                  placeholder="Descripción del anuncio"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-1">Administración</label>
                  <select
                    value={anuncioForm.administracion}
                    onChange={e => setAnuncioForm(f => ({ ...f, administracion: e.target.value }))}
                    className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                  >
                    {Object.entries(ADMINISTRACIONES).map(([val, inf]) => (
                      <option key={val} value={val}>{inf.icono} {inf.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-1">Tipo</label>
                  <select
                    value={anuncioForm.tipo}
                    onChange={e => setAnuncioForm(f => ({ ...f, tipo: e.target.value }))}
                    className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                  >
                    {Object.entries(TIPOS_ANUNCIO).map(([val, inf]) => (
                      <option key={val} value={val}>{inf.icono} {inf.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">URL (opcional)</label>
                <input
                  type="text"
                  value={anuncioForm.url}
                  onChange={e => setAnuncioForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Fecha de expiración (opcional)</label>
                <input
                  type="date"
                  value={anuncioForm.fechaExpiracion}
                  onChange={e => setAnuncioForm(f => ({ ...f, fechaExpiracion: e.target.value }))}
                  className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A] [color-scheme:light]"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={anuncioForm.activo}
                    onChange={e => setAnuncioForm(f => ({ ...f, activo: e.target.checked }))}
                    className="w-4 h-4 rounded accent-[#0F172A]"
                  />
                  <span className="text-gray-700">Activo</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={anuncioForm.destacado}
                    onChange={e => setAnuncioForm(f => ({ ...f, destacado: e.target.checked }))}
                    className="w-4 h-4 rounded accent-[#D4AF37]"
                  />
                  <span className="text-gray-700">Destacado</span>
                </label>
              </div>
              <button
                onClick={guardarAnuncio}
                disabled={!anuncioForm.titulo || !anuncioForm.descripcion}
                className="w-full bg-[#0F172A] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editandoAnuncioId ? 'Guardar cambios' : 'Crear anuncio'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────── MODAL CONFIRMAR ELIMINAR ANUNCIO ──────────────────────────────────── */}
      {anuncioAEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setAnuncioAEliminar(null) }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-4">🗑</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar anuncio?</h3>
            <p className="text-gray-500 text-sm mb-2">{anuncioAEliminar.titulo}</p>
            <p className="text-gray-400 text-xs mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAnuncioAEliminar(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarAnuncio}
                className="flex-1 bg-rose-600 text-white py-2.5 rounded-2xl font-bold text-sm hover:bg-rose-700 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
