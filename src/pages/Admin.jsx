import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const ADMINISTRACIONES = {
  educacion: { label: 'Educación', icono: '🎓' },
  sanidad:   { label: 'Sanidad',   icono: '🩺' },
  justicia:  { label: 'Justicia',  icono: '⚖️' },
  otros:     { label: 'Otros',     icono: '🧩' },
}

const TIPOS_DOC = {
  nomina:        { label: 'Nómina',        icono: '💶' },
  nombramiento:  { label: 'Nombramiento',  icono: '📄' },
  credencial:    { label: 'Credencial',    icono: '🪪' },
  contrato:      { label: 'Contrato',      icono: '📋' },
}

export default function Admin() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const token = localStorage.getItem('token')

  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState('pendiente')
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [rechazandoId, setRechazandoId] = useState(null)
  const [usuarioDetalle, setUsuarioDetalle] = useState(null) // modal detalle
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (usuario.rol !== 'admin') { navigate('/'); return }
    cargarUsuarios()
  }, [filtro])

  const cargarUsuarios = async () => {
    setCargando(true)
    try {
      const res = await axios.get(`${API}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsuarios(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const verificar = async (id, estado, motivo = '') => {
    try {
      const res = await axios.patch(
        `${API}/api/usuarios/${id}/verificar`,
        { estado, motivoRechazo: motivo },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUsuarios(prev => prev.map(u => u._id === id ? res.data : u))
      if (usuarioDetalle?._id === id) setUsuarioDetalle(res.data)
      setRechazandoId(null)
      setMotivoRechazo('')
    } catch (err) {
      alert(err.response?.data?.error || 'Error al verificar')
    }
  }

  // Filtrado: pendientes NO muestra verificados ni rechazados
  const usuariosFiltrados = usuarios.filter(u => {
    const matchFiltro = filtro === '' ? true : u.verificacionEstado === filtro
    const matchBusqueda = busqueda === ''
      ? true
      : u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase())
    return matchFiltro && matchBusqueda
  })

  const stats = {
    total:      usuarios.length,
    pendientes: usuarios.filter(u => u.verificacionEstado === 'pendiente').length,
    verificados: usuarios.filter(u => u.verificacionEstado === 'verificado').length,
    rechazados: usuarios.filter(u => u.verificacionEstado === 'rechazado').length,
  }

  const isPDF = url => url?.toLowerCase().includes('.pdf') || url?.toLowerCase().includes('raw/upload')

  return (
    <div className="min-h-screen bg-[#F8F5EF]">

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
              onClick={() => { localStorage.clear(); navigate('/login') }}
              className="text-sm text-slate-700 hover:text-[#0F172A] font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-[#0F172A] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Panel de administración</h1>
          <p className="text-slate-300 text-sm">Gestiona verificaciones de usuarios, documentación y accesos.</p>
          <div className="flex flex-wrap gap-6 mt-4 text-xs text-slate-300">
            <span>👥 {stats.total} usuarios registrados</span>
            <span>⏳ {stats.pendientes} pendientes de revisión</span>
            <span>✅ {stats.verificados} verificados</span>
            <span>❌ {stats.rechazados} rechazados</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',       valor: stats.total,       color: 'bg-[#F8F5EF] text-[#0F172A] border-gray-200',     icono: '👥' },
            { label: 'Pendientes',  valor: stats.pendientes,  color: 'bg-amber-50 text-amber-700 border-amber-100',     icono: '⏳' },
            { label: 'Verificados', valor: stats.verificados, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icono: '✅' },
            { label: 'Rechazados',  valor: stats.rechazados,  color: 'bg-rose-50 text-rose-600 border-rose-100',        icono: '❌' },
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

        {/* TABLA */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Usuarios registrados</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Buscador */}
              <input
                type="text"
                placeholder="🔍 Buscar por nombre o email..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-[#0F172A] transition-colors w-full sm:w-56"
              />
              {/* Filtros */}
              <div className="flex gap-1 bg-[#F8F5EF] rounded-2xl p-1 border border-gray-100">
                {[
                  ['pendiente', '⏳ Pendientes'],
                  ['verificado', '✅ Verificados'],
                  ['rechazado', '❌ Rechazados'],
                  ['', '👥 Todos'],
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

          {cargando ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">👥</div>
              <p>No hay usuarios en esta categoría.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {usuariosFiltrados.map(u => (
                <div key={u._id} className="bg-[#F8F5EF] rounded-3xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Info usuario */}
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
                            u.verificacionEstado === 'pendiente'  ? 'bg-amber-100 text-amber-700'   :
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
                          Alta: {new Date(u.createdAt).toLocaleDateString('es-ES')}
                          {u.tipoDocumento && (
                            <span className="ml-2">
                              · Doc: {TIPOS_DOC[u.tipoDocumento]?.icono} {TIPOS_DOC[u.tipoDocumento]?.label}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 shrink-0 flex-wrap">
                      {/* Botón Ver detalle — siempre visible */}
                      <button
                        onClick={() => setUsuarioDetalle(u)}
                        className="bg-white border border-gray-200 text-[#0F172A] hover:bg-[#F8F5EF] px-4 py-2 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02]"
                      >
                        👁 Ver detalle
                      </button>

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

                  {/* Panel rechazo inline */}
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
          )}
        </div>
      </div>

      {/* ── MODAL DETALLE USUARIO ── */}
      {usuarioDetalle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setUsuarioDetalle(null) }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">

            {/* Header modal */}
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

              {/* Datos básicos */}
              <div>
                <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Datos personales</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Nombre',    valor: usuarioDetalle.nombre },
                    { label: 'Email',     valor: usuarioDetalle.email },
                    { label: 'Teléfono', valor: usuarioDetalle.telefono || '—' },
                    { label: 'Rol',       valor: usuarioDetalle.rol === 'docente' ? '🧑‍🏫 Interino' : '🏠 Propietario' },
                    { label: 'ID',        valor: usuarioDetalle._id },
                    {
                      label: 'Alta',
                      valor: new Date(usuarioDetalle.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })
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
                </div>
              </div>

              {/* Documento */}
              {usuarioDetalle.urlDocumento && (
                <div>
                  <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Documento adjunto</h4>
                  <div className="bg-[#F8F5EF] rounded-2xl border border-gray-200 overflow-hidden">
                    {isPDF(usuarioDetalle.urlDocumento) ? (
                      <div className="p-6 text-center">
                        <div className="text-5xl mb-3">📄</div>
                        <p className="text-gray-600 text-sm font-medium mb-4">Documento PDF</p>
                        <a
                          href={usuarioDetalle.urlDocumento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0F172A] text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all hover:scale-[1.02] inline-block"
                        >
                          📎 Abrir documento
                        </a>
                      </div>
                    ) : (
                      <div>
                        <img
                          src={usuarioDetalle.urlDocumento}
                          alt="Documento de verificación"
                          className="w-full max-h-80 object-contain p-4"
                        />
                        <div className="border-t border-gray-100 p-4 flex justify-center">
                          <a
                            href={usuarioDetalle.urlDocumento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#0F172A] text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all hover:scale-[1.02] inline-block"
                          >
                            🔍 Ver imagen completa
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!usuarioDetalle.urlDocumento && (
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
                  <button
                    onClick={() => verificar(usuarioDetalle._id, 'rechazado')}
                    className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 py-3 rounded-2xl font-bold text-sm transition-all"
                  >
                    Revocar verificación
                  </button>
                )}
                {usuarioDetalle.verificacionEstado === 'rechazado' && (
                  <button
                    onClick={() => verificar(usuarioDetalle._id, 'verificado')}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3 rounded-2xl font-bold text-sm transition-all"
                  >
                    ✅ Verificar igualmente
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}