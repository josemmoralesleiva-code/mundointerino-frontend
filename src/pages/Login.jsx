import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    rol: 'docente',
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      const res = await axios.post(`${API}/api/auth/login`, form)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario))

      const usuario = res.data.usuario

      if (usuario.rol === 'propietario') {
        if (usuario.verificacionEstado === 'pendiente') {
          navigate('/verificacion-pendiente')
          return
        }

        if (usuario.verificacionEstado === 'rechazado') {
          navigate('/verificacion-rechazada')
          return
        }

        navigate('/dashboard-propietario')
        return
      }

      if (usuario.rol === 'docente') {
        if (usuario.verificacionEstado === 'pendiente') {
          navigate('/verificacion-docente')
          return
        }

        navigate('/dashboard')
        return
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center">
            <img src="/img/logo.png" alt="Profinter" className="h-10" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/publicar')}
              className="hidden md:inline-flex border border-primary-700 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 font-medium transition-all text-sm"
            >
              Publicar piso
            </button>
            <button
              onClick={() => navigate('/registro')}
              className="bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 font-medium transition-all text-sm"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block">
            <div
              className="rounded-3xl overflow-hidden min-h-[540px] relative shadow-2xl"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-primary-900/80"></div>
              <div className="relative h-full flex flex-col justify-end p-10 text-white">
                <h1 className="text-4xl font-bold leading-tight mb-4">
                  Accede a tu espacio
                  <span className="text-accent-400 block">
                    como docente o propietario
                  </span>
                </h1>
                <p className="text-primary-100 text-lg max-w-md">
                  Gestiona tus favoritos, tus anuncios, tus conversaciones y tu verificación desde un solo lugar.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Iniciar sesión</h2>
              <p className="text-gray-500 mt-2">
                Entra en tu cuenta para gestionar tu perfil y tu actividad en Profinter.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Soy...
                </label>
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors bg-white"
                >
                  <option value="docente">Docente interino</option>
                  <option value="propietario">Propietario</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="bg-primary-700 text-white py-3 rounded-xl font-semibold hover:bg-primary-800 disabled:opacity-50 mt-2 transition-all hover:scale-[1.01]"
              >
                {cargando ? 'Entrando...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/registro')}
                  className="text-primary-700 font-medium hover:underline"
                >
                  Regístrate gratis
                </button>
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
              <div className="bg-gray-50 rounded-xl py-3">Verificación</div>
              <div className="bg-gray-50 rounded-xl py-3">Acceso seguro</div>
              <div className="bg-gray-50 rounded-xl py-3">Panel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}