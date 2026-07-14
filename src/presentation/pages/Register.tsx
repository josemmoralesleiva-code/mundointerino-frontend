import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'
import { getPasswordRequirementsUseCase } from '../../application/useCases/auth'
import type { PasswordRule } from '../../infrastructure/dto/auth.dto'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'docente',
    telefono: '',
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const [passwordRules, setPasswordRules] = useState<Record<string, PasswordRule>>({
    minLength: { regex: '.{8,}', label: 'Al menos 8 caracteres' },
    uppercase: { regex: '[A-Z]', label: 'Al menos una mayúscula' },
    lowercase: { regex: '[a-z]', label: 'Al menos una minúscula' },
    number: { regex: '[0-9]', label: 'Al menos un número' },
    special: { regex: '[^A-Za-z0-9]', label: 'Al menos un carácter especial' },
  })
  const [fortalezaMinima, setFortalezaMinima] = useState(4)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    getPasswordRequirementsUseCase()
      .then((req) => {
        const rules: Record<string, PasswordRule> = {}
        for (const item of req.requisitos) {
          rules[item.clave] = { regex: item.regex, label: item.etiqueta }
        }
        setPasswordRules(rules)
        setFortalezaMinima(req.fortalezaMinima)
      })
      .catch(() => {
        fetchedRef.current = false
      })
  }, [])

  const passwordChecks = Object.entries(passwordRules).map(([key, rule]) => {
    try {
      return { key, label: rule.label, passed: new RegExp(rule.regex).test(form.password) }
    } catch {
      return { key, label: rule.label, passed: false }
    }
  })

  const passwordStrength = passwordChecks.length ? Math.round((passwordChecks.filter(c => c.passed).length / passwordChecks.length) * 100) : 0

  const barColor = passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 80 ? 'bg-yellow-500' : 'bg-green-500'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleRol = (rol: string) => setForm(prev => ({ ...prev, rol }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await register({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol: form.rol,
        telefono: form.telefono,
      })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setCargando(false)
    }
  }

  return (
    <PageLayout>
      <Navbar />

      {/* HERO BANNER */}
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
            Únete a{' '}
            <span className="text-[#D4AF37]">MundoInterino</span>
          </h1>
          <p className="text-slate-100 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Gratis para interinos y propietarios. Sin comisiones ocultas.
          </p>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* LADO IZQUIERDO */}
          <div className="hidden md:flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Todo en una sola plataforma
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Accede a favoritos, contacto directo con propietarios y verificación de perfil sin intermediarios.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: '🧑‍🏫', titulo: 'Interinos', texto: 'Encuentra piso cerca de tu destino. Educación, sanidad, justicia y más.' },
                { icon: '🏠', titulo: 'Propietarios', texto: 'Publica gratis y conecta con inquilinos con nómina pública garantizada.' },
                { icon: '📅', titulo: 'Estancia flexible', texto: 'Desde días hasta todo el curso o contrato. Tú decides la duración.' },
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
              <div className="text-3xl mb-2">✅</div>
              <p className="font-bold mb-1">+200 pisos publicados</p>
              <p className="text-white/80 text-sm">
                Aragón, Andalucía y más comunidades. Tu hogar donde te necesiten.
              </p>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 p-8 md:p-10 transition-all duration-300">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F8F5EF] mb-4 text-2xl">
                ✨
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Gratis para interinos y propietarios.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 mb-5 text-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* SELECTOR ROL */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRol('docente')}
                  className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all hover:scale-[1.02] ${
                    form.rol === 'docente'
                      ? 'border-[#0F172A] bg-[#F8F5EF] text-[#0F172A]'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  🧑‍💼 Soy interino
                </button>
                <button
                  type="button"
                  onClick={() => handleRol('propietario')}
                  className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all hover:scale-[1.02] ${
                    form.rol === 'propietario'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#0F172A]'
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  🏠 Soy propietario
                </button>
              </div>

              {/* NOMBRE */}
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">👤 Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0F172A] transition-colors placeholder:text-gray-300"
                />
              </div>

              {/* EMAIL */}
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

              {/* TELÉFONO */}
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">📱 Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="600 123 456"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0F172A] transition-colors placeholder:text-gray-300"
                />
              </div>

              {/* CONTRASEÑA */}
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">🔒 Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Crea una contraseña segura"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0F172A] transition-colors placeholder:text-gray-300"
                />

                {passwordChecks.length > 0 && (
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <ul className="mt-2 space-y-1">
                      {passwordChecks.map((check) => (
                        <li key={check.key} className="flex items-center gap-2 text-xs">
                          <span className={check.passed ? 'text-green-600' : 'text-gray-300'}>
                            {check.passed ? '✓' : '○'}
                          </span>
                          <span className={check.passed ? 'text-green-700' : 'text-gray-400'}>
                            {check.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* AVISO VERIFICACIÓN */}
              <div className="bg-[#F8F5EF] border border-gray-200 text-gray-600 rounded-2xl px-4 py-3 text-xs leading-relaxed">
                🕐 Tu cuenta quedará en estado <strong className="text-[#0F172A]">pendiente de verificación</strong> hasta que revisemos tu perfil. Te avisaremos pronto.
              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                disabled={cargando}
                className="bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md disabled:opacity-50 mt-1"
              >
                {cargando ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#0F172A] font-bold hover:underline"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
              {[
                { icon: '🧑‍🏫', texto: 'Interinos' },
                { icon: '🏠', texto: 'Propietarios' },
                { icon: '💶', texto: 'Sin comisiones' },
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
