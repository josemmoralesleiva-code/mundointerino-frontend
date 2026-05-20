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
    if (usuario.rol !== 'admin') {
      navigate('/')
      return
    }
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
      const res = await axios.patch(
        `${API}/api/usuarios/${id}/verificar`,
        { verificacionEstado: estado, motivoRechazo: motivo },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUsuarios(prev => prev.map(u => (u._id === id ? res.data : u)))
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
    <div className="min-h-screen bg-[#F8F5EF]">
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
              onClick={() => {
                localStorage.clear()
                navigate('/login')
              }}
              className="text-sm text-slate-700 hover:text-[#0F172A] font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-[#0F172A] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Panel de administración</h1>
          <p className="text-slate-300 text-sm">Gestiona verificaciones de usuarios y propietarios.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pendientes', valor: stats.pendientes, color: 'bg-amber-50 text-amber-700 border-amber-100', icono: '⏳' },
            { label: 'Verificados', valor: stats.verificados, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icono: '✅' },
            { label: 'Rechazados', valor: stats.rechazados, color: 'bg-rose-50 text-rose-600 border-rose-100', icono: '❌' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 text-center">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-2 border ${s.color}`}>
                {s.icono}
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.valor}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Usuarios registrados</h2>
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    filtro === val
                      ? 'bg-white text-[#0F172A] shadow-sm'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {cargando ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">👥</div>
              <p>No hay usuarios en esta categoría.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {usuarios.map(u => (
                <div key={u._id} className="bg-[#F8F5EF] rounded-3xl border border-gray-100 p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0F172A] rounded-full flex items-center justify-center text-xl font-bold text-white">
                        {u.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{u.nombre}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              u.rol === 'docente'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {u.rol === 'docente' ? '🧑‍💼 Interino' : '🏠 Propietario'}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              u.verificacionEstado === 'pendiente'
                                ? 'bg-amber-100 text-amber-700'
                                : u.verificacionEstado === 'verificado'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-600'
                            }`}
                          >
                            {u.verificacionEstado === 'pendiente'
                              ? '⏳ Pendiente'
                              : u.verificacionEstado === 'verificado'
                              ? '✅ Verificado'
                              : '❌ Rechazado'}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">{u.email} · {u.telefono || 'Sin teléfono'}</p>
                        <p className="text-gray-400 text-xs">
                          Registrado: {new Date(u.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    {u.verificacionEstado === 'pendiente' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => verificar(u._id, 'verificado')}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          ✅ Verificar
                        </button>
                        <button
                          onClick={() => setRechazandoId(u._id)}
                          className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    )}

                    {u.verificacionEstado === 'verificado' && (
                      <button
                        onClick={() => verificar(u._id, 'rechazado')}
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0"
                      >
                        Revocar verificación
                      </button>
                    )}

                    {u.verificacionEstado === 'rechazado' && (
                      <button
                        onClick={() => verificar(u._id, 'verificado')}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors shrink-0"
                      >
                        ✅ Verificar igualmente
                      </button>
                    )}
                  </div>

                  {rechazandoId === u._id && (
                    <div className="mt-4 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                      <p className="text-sm font-medium text-rose-700 mb-2">Motivo del rechazo (opcional)</p>
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
                          className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors"
                        >
                          Confirmar rechazo
                        </button>
                        <button
                          onClick={() => {
                            setRechazandoId(null)
                            setMotivoRechazo('')
                          }}
                          className="bg-white text-gray-600 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
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
    </div>
  )
}