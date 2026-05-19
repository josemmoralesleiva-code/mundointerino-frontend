import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'docente',
    telefono: '',
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRol = rol => {
    setForm(prev => ({ ...prev, rol }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol: form.rol,
        telefono: form.telefono,
        verificacionEstado: 'pendiente',
      }

      const res = await axios.post(`${API}/api/auth/registro`, payload)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario))

      if (res.data.usuario?.rol === 'propietario') {
        navigate('/verificacion-propietario')
        return
      }

      navigate('/verificacion-docente')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center">
            {/* ✏️ CAMBIO: alt + tamaño */}
            <img src="/img/logo.png" alt="MundoInterino" className="h-14" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="border border-primary-700 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 font-medium transition-all text-sm"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('/publicar')}
              className="bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 font-medium transition-all text-sm"
            >
              Publicar piso
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
                  Crea tu cuenta
                  {/* ✏️ CAMBIO: marca */}
                  <span className="text-accent-400 block">en MundoInterino</span>
                </h1>
                <p className="text-primary-100 text-lg max-w-md">
                  Accede a favoritos, chats, anuncios y verificación en una sola plataforma.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Crear cuenta</h2>
              {/* ✏️ CAMBIO: texto más alineado con el proyecto */}
              <p className="text-gray-500 mt-2">
                Gratis para interinos y propietarios.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRol('docente')}
                  className={`py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    form.rol === 'docente'
                      ? 'border-primary-700 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  🧑‍💼 Soy interino
                </button>
                <button
                  type="button"
                  onClick={() => handleRol('propietario')}
                  className={`py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    form.rol === 'propietario'
                      ? 'border-primary-700 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  🏠 Soy propietario
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
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
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="600 123 456"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm">
                Tu cuenta quedará en estado <strong>pendiente de verificación</strong> hasta revisar tu perfil.
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="bg-primary-700 text-white py-3 rounded-xl font-semibold hover:bg-primary-800 disabled:opacity-50 mt-2 transition-all hover:scale-[1.01]"
              >
                {cargando ? 'Creando cuenta...' : 'Crear cuenta gratis'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary-700 font-medium hover:underline"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
              <div className="bg-gray-50 rounded-xl py-3">Interinos</div>
              <div className="bg-gray-50 rounded-xl py-3">Propietarios</div>
              <div className="bg-gray-50 rounded-xl py-3">Sin comisiones</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}