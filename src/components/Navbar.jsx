import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const token = localStorage.getItem('token')

  const [menuPropietarios, setMenuPropietarios] = useState(false)
  const [menuUsuario, setMenuUsuario] = useState(false)
  const refProp = useRef(null)
  const refUser = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (refProp.current && !refProp.current.contains(e.target)) setMenuPropietarios(false)
      if (refUser.current && !refUser.current.contains(e.target)) setMenuUsuario(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#F8F5EF]/95 backdrop-blur-xl text-[#0F172A] border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3"
          >
            <img
              src="/img/logo.png"
              alt="MundoInterino"
              className="h-16 w-auto object-contain"
            />
            <span className="hidden sm:block text-xl font-bold tracking-tight">
              <span className="text-[#0F172A]">Mundo</span>
              <span className="text-[#2F5DAA]">Interino</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate('/pisos')}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-[#0F172A] hover:bg-black/5 transition-all"
            >
              Buscar piso
            </button>

            <button
              onClick={() => navigate('/mundointerino')}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-[#0F172A] hover:bg-black/5 transition-all"
            >
              Mundo
            </button>

            <div className="relative" ref={refProp}>
              <button
                onClick={() => {
                  setMenuPropietarios(!menuPropietarios)
                  setMenuUsuario(false)
                }}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  menuPropietarios
                    ? 'bg-black/5 text-[#0F172A]'
                    : 'text-slate-700 hover:text-[#0F172A] hover:bg-black/5'
                }`}
              >
                Propietarios
                <svg
                  className={`w-4 h-4 transition-transform ${menuPropietarios ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuPropietarios && (
                <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 w-56 z-50 text-slate-900 overflow-hidden">
                  <button
                    onClick={() => {
                      navigate('/pisos/nuevo')
                      setMenuPropietarios(false)
                    }}
                    className="w-full text-left text-sm text-slate-700 hover:text-[#0F172A] py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Publicar mi piso
                  </button>
                  <button
                    onClick={() => {
                      navigate('/dashboard')
                      setMenuPropietarios(false)
                    }}
                    className="w-full text-left text-sm text-slate-700 hover:text-[#0F172A] py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Gestionar anuncios
                  </button>
                </div>
              )}
            </div>

            {usuario?.rol === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1 bg-[#D4AF37]/15 text-[#8A6510] hover:bg-[#D4AF37]/20 px-3 py-2 rounded-xl text-sm font-semibold transition-colors border border-[#D4AF37]/20"
              >
                🛡️ Admin
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <div className="relative" ref={refUser}>
              <button
                onClick={() => {
                  setMenuUsuario(!menuUsuario)
                  setMenuPropietarios(false)
                }}
                className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl transition-all shadow-sm"
              >
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0F172A] text-xs font-bold shadow-sm">
                  {usuario?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden md:block">
                  {usuario?.nombre}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${menuUsuario ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuUsuario && (
                <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 w-56 z-50 text-slate-900 overflow-hidden">
                  <button
                    onClick={() => {
                      navigate('/dashboard')
                      setMenuUsuario(false)
                    }}
                    className="w-full text-left text-sm text-slate-700 hover:text-[#0F172A] py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Mi panel
                  </button>
                  <button
                    onClick={() => {
                      navigate('/perfil')
                      setMenuUsuario(false)
                    }}
                    className="w-full text-left text-sm text-slate-700 hover:text-[#0F172A] py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Mi perfil
                  </button>
                  <button
                    onClick={() => {
                      navigate('/mundointerino')
                      setMenuUsuario(false)
                    }}
                    className="w-full text-left text-sm text-slate-700 hover:text-[#0F172A] py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Mundo
                  </button>
                  {usuario?.rol === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('/admin')
                        setMenuUsuario(false)
                      }}
                      className="w-full text-left text-sm text-[#8A6510] hover:text-[#6B4E00] py-3 px-3 rounded-xl hover:bg-amber-50 transition-colors font-semibold"
                    >
                      🛡️ Panel admin
                    </button>
                  )}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={cerrarSesion}
                    className="w-full text-left text-sm text-rose-600 hover:text-rose-700 py-3 px-3 rounded-xl hover:bg-rose-50 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 font-medium transition-all text-sm"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="bg-[#D4AF37] text-[#0F172A] px-4 py-2 rounded-xl hover:bg-[#B8860B] font-semibold transition-all text-sm shadow-lg"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}