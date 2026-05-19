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
    <nav className="bg-white shadow-sm px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO + LINKS */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center">
            {/* ✏️ CAMBIO: alt actualizado a Repla */}
            <img src="/img/logo.png" alt="Repla" className="h-10" />
          </a>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate('/pisos')}
              className="text-gray-700 hover:text-primary-700 font-medium transition-colors text-sm border-b-2 border-transparent hover:border-primary-700 pb-1">
              Buscar piso
            </button>

            <div className="relative" ref={refProp}>
              <button onClick={() => { setMenuPropietarios(!menuPropietarios); setMenuUsuario(false) }}
                className={`flex items-center gap-1 font-medium transition-colors text-sm pb-1 border-b-2 ${
                  menuPropietarios ? 'text-primary-700 border-primary-700' : 'text-gray-700 hover:text-primary-700 border-transparent hover:border-primary-700'
                }`}>
                Propietarios
                <svg className={`w-4 h-4 transition-transform ${menuPropietarios ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuPropietarios && (
                <div className="absolute top-10 left-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-48 z-50">
                  <button onClick={() => { navigate('/pisos/nuevo'); setMenuPropietarios(false) }}
                    className="w-full text-left text-sm text-gray-700 hover:text-primary-700 py-2 px-2 rounded-lg hover:bg-gray-50">
                    Publicar mi piso
                  </button>
                  <button onClick={() => { navigate('/dashboard'); setMenuPropietarios(false) }}
                    className="w-full text-left text-sm text-gray-700 hover:text-primary-700 py-2 px-2 rounded-lg hover:bg-gray-50">
                    Gestionar anuncios
                  </button>
                </div>
              )}
            </div>

            {/* BOTÓN ADMIN — solo visible si rol === 'admin' */}
            {usuario?.rol === 'admin' && (
              <button onClick={() => navigate('/admin')}
                className="flex items-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                🛡️ Admin
              </button>
            )}
          </div>
        </div>

        {/* DERECHA — usuario o botones auth */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="relative" ref={refUser}>
              <button onClick={() => setMenuUsuario(!menuUsuario)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-xl transition-colors">
                <div className="w-7 h-7 bg-primary-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {usuario?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">{usuario?.nombre}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${menuUsuario ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuUsuario && (
                <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 w-48 z-50">
                  <button onClick={() => { navigate('/dashboard'); setMenuUsuario(false) }}
                    className="w-full text-left text-sm text-gray-700 hover:text-primary-700 py-2 px-3 rounded-lg hover:bg-gray-50">
                    Mi panel
                  </button>
                  {/* ✏️ FIX: "Mi perfil" movido aquí dentro, donde tiene sentido */}
                  <button onClick={() => { navigate('/perfil'); setMenuUsuario(false) }}
                    className="w-full text-left text-sm text-gray-700 hover:text-primary-700 py-2 px-3 rounded-lg hover:bg-gray-50">
                    Mi perfil
                  </button>
                  {usuario?.rol === 'admin' && (
                    <button onClick={() => { navigate('/admin'); setMenuUsuario(false) }}
                      className="w-full text-left text-sm text-red-600 hover:text-red-700 py-2 px-3 rounded-lg hover:bg-red-50 font-semibold">
                      🛡️ Panel admin
                    </button>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={cerrarSesion}
                    className="w-full text-left text-sm text-red-500 hover:text-red-700 py-2 px-3 rounded-lg hover:bg-red-50">
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                className="border border-primary-700 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 font-medium transition-all text-sm">
                Iniciar sesión
              </button>
              <button onClick={() => navigate('/registro')}
                className="bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 font-medium transition-all text-sm">
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}