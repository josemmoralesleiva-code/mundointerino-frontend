import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/auth.store'
import { storage } from '../../infrastructure/storage/localStorage'
import { getMenuItems } from '../../domain/constants/menu'
import type { MenuContext } from '../../domain/constants/menu'

export default function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const storeUser = useAuthStore((s) => s.user)
  const storeIsAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const cached = storage.getUser()
  const user = storeUser ?? cached
  const isAuthenticated = storeIsAuthenticated || cached !== null

  const [menuUsuario, setMenuUsuario] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const refUser = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (refUser.current && !refUser.current.contains(e.target as Node)) setMenuUsuario(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const context: MenuContext = (user?.rol as MenuContext | undefined) ?? 'anon'
  const isVerified = user?.verificacionEstado === 'verificado'
  const items = getMenuItems(context, isVerified)

  const goTo = (to: string) => {
    setMenuAbierto(false)
    setMenuUsuario(false)
    navigate(to)
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
            {items.map((item) => {
              if (item.id === 'buscar-pisos') {
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(item.to)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-[#0F172A] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 transition-all border border-[#D4AF37]/20"
                  >
                    {item.label}
                  </button>
                )
              }
              if (item.id === 'panel-admin') {
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(item.to)}
                    className="flex items-center gap-1 bg-[#D4AF37]/15 text-[#8A6510] hover:bg-[#D4AF37]/20 px-3 py-2 rounded-xl text-sm font-semibold transition-colors border border-[#D4AF37]/20"
                  >
                    🛡️ {item.label}
                  </button>
                )
              }
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-[#0F172A] hover:bg-black/5 transition-all"
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={refUser}>
              <button
                onClick={() => {
                  setMenuUsuario(!menuUsuario)
                }}
                className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl transition-all shadow-sm"
              >
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0F172A] text-xs font-bold shadow-sm">
                  {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden md:block">
                  {user?.nombre}
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
                    onClick={() => goTo('/dashboard')}
                    className="w-full text-left text-sm text-slate-700 hover:text-[#0F172A] py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Mi panel
                  </button>
                  <button
                    onClick={() => goTo('/perfil')}
                    className="w-full text-left text-sm text-slate-700 hover:text-[#0F172A] py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Mi perfil
                  </button>
                  {user?.rol === 'admin' && (
                    <button
                      onClick={() => goTo('/admin')}
                      className="w-full text-left text-sm text-[#8A6510] hover:text-[#6B4E00] py-3 px-3 rounded-xl hover:bg-amber-50 transition-colors font-semibold"
                    >
                      🛡️ Panel admin
                    </button>
                  )}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => { void logout() }}
                    className="w-full text-left text-sm text-rose-600 hover:text-rose-700 py-3 px-3 rounded-xl hover:bg-rose-50 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
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
            </div>
          )}

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

      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => setMenuAbierto(false)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.id === 'buscar-pisos'
                    ? 'bg-[#D4AF37]/15 text-[#0F172A] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.id === 'panel-admin' ? `🛡️ ${item.label}` : item.label}
              </Link>
            ))}

            <div className="my-2 border-t border-slate-100" />

            {isAuthenticated ? (
              <>
                <Link
                  to="/perfil"
                  onClick={() => setMenuAbierto(false)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  👤 Mi perfil
                </Link>
                <button
                  onClick={() => { setMenuAbierto(false); void logout() }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMenuAbierto(false); navigate('/login') }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => { setMenuAbierto(false); navigate('/registro') }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-[#0F172A] bg-[#D4AF37] hover:bg-[#B8860B] transition-colors"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}