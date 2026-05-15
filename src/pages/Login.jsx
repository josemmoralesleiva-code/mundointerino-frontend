import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
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

        <h1 className="text-xl font-bold text-gray-800 mb-6">Iniciar sesión</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 mt-2"
          >
            {cargando ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <span
            onClick={() => navigate('/registro')}
            className="text-blue-700 font-medium cursor-pointer hover:underline"
          >
            Regístrate gratis
          </span>
        </p>

      </div>
    </div>
  )
}