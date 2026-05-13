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
    rol: 'interino'
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
      const res = await axios.post(`${API}/api/auth/registro`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

        <div
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-blue-700 text-center mb-8 cursor-pointer"
        >
          🏠 Profinter
        </div>

        <h1 className="text-xl font-bold text-gray-800 mb-2">Crear cuenta</h1>
        <p className="text-gray-500 text-sm mb-6">Gratis para docentes y propietarios</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* ROL */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, rol: 'interino' })}
              className={`py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                form.rol === 'interino'
                  ? 'border-blue-700 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-500'
              }`}
            >
              👨‍🏫 Soy docente
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, rol: 'propietario' })}
              className={`py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                form.rol === 'propietario'
                  ? 'border-blue-700 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-500'
              }`}
            >
              🏠 Soy propietario
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 mt-2"
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-700 font-medium cursor-pointer hover:underline"
          >
            Iniciar sesión
          </span>
        </p>

      </div>
    </div>
  )
}