import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Admin() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const token = localStorage.getItem('token')

  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState('pendiente')
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [rechazandoId, setRechazandoId] = useState(null)

  useEffect(() => {
    if (usuario.rol !== 'admin') { navigate('/'); return }
    cargarUsuarios()
  }, [filtro])

  const cargarUsuarios = async () => {
    setCargando(true)
    try {
      const res = await axios.get(`${API}/api/usuarios?estado=${filtro}`, {
        headers: { Authorization: `Bearer ${token}` }
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
      const res = await axios.patch(`${API}/api/usuarios/${id}/verificar`,
        { verificacionEstado: estado, motivoRechazo: motivo },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUsuarios(prev => prev.map(u => u._id === id ? res.data : u))
      setRechazandoId(null)
      setMotivoRechazo('')
    } catch (err) {
      alert(err.response?.data?.error || 'Error al verificar')
    }
  }

  const stats = {
    pendientes: usuarios.filter(u => u.verificacionEstado === 'pendiente').length,
    verificados: usuarios.filter(u => u.verificacionEstado === 'verificado').length,
    rechazados: usuarios.filter(u => u.verificacionEstado === 'rechazado').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center">
            {/* ✏️ CAMBIO: alt actualizado a MundoInterino + tamaño consistente */}
            <img src="/img/logo.png" alt="MundoInterino" className="h-14" />
          </button>
          <div className="flex items-center gap-3">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">ADMIN</span>
            <button onClick={() => { localStorage.clear(); navigate('/login') }}
              className="text-sm text-red-500 hover:text-red-700 font-medium">
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Panel de administración</h1>
          {/* ✏️ CAMBIO: descripción más inclusiva */}
          <p className="text-gray-400 text-sm">Gestiona verificaciones de usuarios y propietarios.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pendientes', valor: stats.pendientes, color: 'bg-amber-50 text-amber-700', icono: '⏳' },
            { label: 'Verificados', valor: stats.verificados, color: 'bg-green-50 text-green-700', icono: '✅' },
            { label: 'Rechazados', valor: stats.rechazados, color: 'bg-red-50 text-red-600', icono: '❌' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-2 ${s.color}`}>
                {s.icono}
              </div>
              <p className="text-2xl font-bold text-gray-800">{s.valor}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Usuarios registrados</h2>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {[
                ['pendiente', '⏳ Pendientes'],
                ['verificado', '✅ Verificados'],
                ['rechazado', '❌ Rechazados'],
                ['', '👥 Todos'],
              ].map(([val, label]) => (
                <button key={val} onClick={() => setFiltro(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filtro === val ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {cargando ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">👥</div>
              <p>No hay usuarios en esta categoría.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {usuarios.map(u => (
                <div key={u._id} className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl font-bold text-primary-700">
                        {u.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800">{u.nombre}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            u.rol === 'docente' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {/* ✏️ CAMBIO: etiqueta más inclusiva */}
                            {u.rol === 'docente' ? '🧑‍💼 Interino' : '🏠 Propietario'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            u.verificacionEstado === 'pendiente' ? 'bg-amber-100 text-amber-700'
                            : u.verificacionEstado === 'verificado' ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                          }`}>
                            {u.verificacionEstado === 'pendiente' ? '⏳ Pendiente'
                              : u.verificacionEstado === 'verificado' ? '✅ Verificado'
                              : '❌ Rechazado'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">{u.email} · {u.telefono || 'Sin teléfono'}</p>
                        <p className="text-gray-400 text-xs">
                          Registrado: {new Date(u.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    {/* ACCIONES */}
                    {u.verificacionEstado === 'pendiente' && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => verificar(u._id, 'verificado')}
                          className="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                          ✅ Verificar
                        </button>
                        <button onClick={() => setRechazandoId(u._id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                          ❌ Rechazar
                        </button>
                      </div>
                    )}
                    {u.verificacionEstado === 'verificado' && (
                      <button onClick={() => verificar(u._id, 'rechazado')}
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0">
                        Revocar verificación
                      </button>
                    )}
                    {u.verificacionEstado === 'rechazado' && (
                      <button onClick={() => verificar(u._id, 'verificado')}
                        className="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0">
                        ✅ Verificar igualmente
                      </button>
                    )}
                  </div>

                  {/* MODAL MOTIVO RECHAZO */}
                  {rechazandoId === u._id && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-red-700 mb-2">Motivo del rechazo (opcional)</p>
                      <textarea
                        value={motivoRechazo}
                        onChange={e => setMotivoRechazo(e.target.value)}
                        placeholder="Ej: Documentación insuficiente, información incorrecta..."
                        rows={2}
                        className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none mb-3"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => verificar(u._id, 'rechazado', motivoRechazo)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                          Confirmar rechazo
                        </button>
                        <button onClick={() => { setRechazandoId(null); setMotivoRechazo('') }}
                          className="bg-white text-gray-600 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
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
    </div>
  )
}