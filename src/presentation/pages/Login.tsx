import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await login({ email: form.email, password: form.password })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <PageLayout>
      <Navbar />

      {/* HERO BANNER — igual que Home */}
      <section
        className="relative text-white py-10 px-6 text-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#111827]/90" />
        <div className="relative max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight drop-shadow-lg">
            Bienvenido de nuevo a{' '}
            <span className="text-[#D4AF37]">MundoInterino</span>
          </h1>
          <p className="text-slate-100 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Accede a tu cuenta para gestionar pisos, guardar favoritos y mucho más.
          </p>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LADO IZQUIERDO — info */}
          <div className="hidden md:flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tu espacio en la administración pública
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Entra con tu cuenta y accederemos automáticamente a tu perfil: interino o propietario.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: '🧑‍🏫', titulo: 'Interinos', texto: 'Busca y guarda pisos cerca de tu destino.' },
                { icon: '🏠', titulo: 'Propietarios', texto: 'Gestiona tus anuncios y contacta inquilinos.' },
              ].map(v => (
                <div
                  key={v.titulo}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="text-3xl">{v.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{v.titulo}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{v.texto}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-3xl p-6 text-white">
              <div className="text-3xl mb-2">💶</div>
              <p className="font-bold mb-1">Sin comisiones ocultas</p>
              <p className="text-white/80 text-sm">
                Publicación gratuita, negociación directa entre propietario e interino.
              </p>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 p-8 md:p-10 transition-all duration-300">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F8F5EF] mb-4 text-2xl">
                🔐
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Te redirigiremos automáticamente según tu perfil.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 mb-5 text-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">📧 Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0F172A] transition-colors placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">🔒 Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0F172A] transition-colors placeholder:text-gray-300"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md disabled:opacity-50 mt-1"
              >
                {cargando ? 'Entrando...' : 'Iniciar sesión →'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/registro')}
                  className="text-[#0F172A] font-bold hover:underline"
                >
                  Regístrate gratis
                </button>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
              {[
                { icon: '✅', texto: 'Verificación' },
                { icon: '🔒', texto: 'Acceso seguro' },
                { icon: '📋', texto: 'Tu panel' },
              ].map(b => (
                <div key={b.texto} className="bg-[#F8F5EF] rounded-2xl py-3 border border-gray-100">
                  <div>{b.icon}</div>
                  <div className="mt-1">{b.texto}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </PageLayout>
  )
}
