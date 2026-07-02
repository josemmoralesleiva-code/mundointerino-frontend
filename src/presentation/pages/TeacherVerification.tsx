import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { useUsers } from '../hooks/useUsers'
import Navbar from '../components/Navbar'

const ADMINISTRACIONES = [
  { valor: 'educacion', label: 'Educación', icono: '🎓', desc: 'Docentes, maestros, profesores interinos' },
  { valor: 'sanidad', label: 'Sanidad', icono: '🩺', desc: 'Médicos, enfermeros, técnicos sanitarios' },
  { valor: 'justicia', label: 'Justicia', icono: '⚖️', desc: 'Funcionarios de juzgados y tribunales' },
  { valor: 'otros', label: 'Otros', icono: '🧩', desc: 'Otras administraciones públicas' },
]

const TIPOS_DOC = [
  { valor: 'nomina', label: 'Nómina', icono: '💶' },
  { valor: 'nombramiento', label: 'Nombramiento', icono: '📄' },
  { valor: 'credencial', label: 'Credencial', icono: '🪪' },
  { valor: 'contrato', label: 'Contrato', icono: '📋' },
  { valor: 'certificado_servicios', label: 'Cert. servicios', icono: '📜' },
  { valor: 'resolucion', label: 'Resolución', icono: '📝' },
]

export default function TeacherVerification() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { verifyTeacher, loading, error, setError } = useUsers()

  const [paso, setPaso] = useState(1)
  const [administracion, setAdministracion] = useState('')
  const [tipoDoc, setTipoDoc] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [preview, setPreview] = useState(null)

  const rechazado = user?.verificacionEstado === 'rechazado'
  const traducirMotivo = () => {
    const m = user?.motivoRechazo
    if (!m) return 'No se ha indicado un motivo.'
    const mapa: Record<string, string> = {
      'OCR extraction failed, manual review required': 'No se pudo extraer la información del documento. Requiere revisión manual.',
      'Document is not readable or is of poor quality': 'El documento no es legible o tiene baja calidad. Por favor, sube una imagen más nítida.',
      'Document type does not match the selected category': 'El tipo de documento no coincide con la categoría seleccionada.',
      'Document appears to be expired or invalid': 'El documento parece estar caducado o no es válido.',
      'Multiple people detected in the document': 'Se ha detectado más de una persona en el documento.',
      'Document does not belong to the registered user': 'El documento no pertenece al usuario registrado.',
      'Manual review required - suspicious document': 'El documento requiere revisión manual por posibles irregularidades.',
    }
    return mapa[m] || m
  }

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (!file) return
    setArchivo(file)
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  const handleEnviar = async () => {
    if (!archivo) { setError('Por favor adjunta un documento'); return }
    try {
      const formData = new FormData()
      formData.append('documento', archivo)
      formData.append('tipoDocumento', tipoDoc)
      formData.append('administracion', administracion)

      await verifyTeacher(formData)
      setPaso(3)
    } catch {
      // error ya seteado por el hook
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <Navbar />

      {/* HERO */}
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
          <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
            Bienvenido, <span className="text-[#D4AF37]">{user?.nombre}</span> 👋
          </h1>
          <p className="text-slate-100 text-sm max-w-xl mx-auto leading-relaxed">
            Completa tu verificación para acceder a todas las funciones de MundoInterino.
          </p>

          {/* STEPPER */}
          {paso < 3 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              {['Tu administración', 'Tu documento', 'Listo'].map((label, i) => {
                const num = i + 1
                const activo = paso === num
                const completado = paso > num
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      completado ? 'bg-[#D4AF37] text-[#0F172A]'
                      : activo ? 'bg-white text-[#0F172A]'
                      : 'bg-white/20 text-white/60'
                    }`}>
                      <span>{completado ? '✓' : num}</span>
                      <span className="hidden sm:inline">{label}</span>
                    </div>
                    {i < 2 && <span className="text-white/30 text-xs">→</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-2xl mx-auto px-6 py-12">

        {/* ── RECHAZADO ── */}
        {rechazado && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-sm mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="space-y-3 flex-1">
                <p className="font-bold text-red-800 text-base">Tu verificación anterior fue rechazada</p>
                <p className="text-red-700">{traducirMotivo()}</p>
                <p className="text-xs text-red-500 leading-relaxed">
                  Puedes corregir el problema y volver a enviar tu documentación. Si crees que es un error, contacta con soporte.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── PASO 1: ADMINISTRACIÓN ── */}
        {paso === 1 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F8F5EF] mb-4 text-2xl">
                🏛️
              </div>
              <h2 className="text-xl font-bold text-gray-900">¿A qué administración perteneces?</h2>
              <p className="text-gray-500 text-sm mt-1">
                Selecciona tu sector para personalizar tu experiencia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {ADMINISTRACIONES.map(adm => (
                <button
                  key={adm.valor}
                  onClick={() => setAdministracion(adm.valor)}
                  className={`rounded-3xl border-2 p-5 text-left transition-all duration-200 hover:scale-[1.02] ${
                    administracion === adm.valor
                      ? 'border-[#0F172A] bg-[#F8F5EF] shadow-md'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="text-3xl mb-2">{adm.icono}</div>
                  <p className={`font-bold text-sm mb-1 ${administracion === adm.valor ? 'text-[#0F172A]' : 'text-gray-900'}`}>
                    {adm.label}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">{adm.desc}</p>
                  {administracion === adm.valor && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#0F172A] bg-[#D4AF37]/20 px-2 py-0.5 rounded-full">
                      ✓ Seleccionado
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => { if (administracion) setPaso(2) }}
              disabled={!administracion}
              className="w-full bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar →
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                Completar más tarde
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: DOCUMENTO ── */}
        {paso === 2 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F8F5EF] mb-4 text-2xl">
                📎
              </div>
              <h2 className="text-xl font-bold text-gray-900">Adjunta tu documento</h2>
              <p className="text-gray-500 text-sm mt-1">
                Necesitamos verificar que eres interino de <strong className="text-[#0F172A]">
                  {ADMINISTRACIONES.find(a => a.valor === administracion)?.label}
                </strong>.
              </p>
            </div>

            {/* Tipo de documento */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 font-semibold mb-3">📋 ¿Qué documento vas a subir?</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIPOS_DOC.map(t => (
                  <button
                    key={t.valor}
                    onClick={() => setTipoDoc(t.valor)}
                    className={`rounded-2xl border-2 py-3 px-2 text-center text-xs font-bold transition-all hover:scale-[1.02] ${
                      tipoDoc === t.valor
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#0F172A]'
                        : 'border-gray-100 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <div className="text-xl mb-1">{t.icono}</div>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zona de subida */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 font-semibold mb-3">📁 Sube tu archivo</p>
              <label
                htmlFor="doc-upload"
                className={`flex flex-col items-center justify-center w-full rounded-3xl border-2 border-dashed p-8 cursor-pointer transition-all ${
                  archivo
                    ? 'border-[#0F172A] bg-[#F8F5EF]'
                    : 'border-gray-200 bg-[#F8F5EF] hover:border-[#0F172A] hover:bg-gray-50'
                }`}
              >
                {preview ? (
                  <img src={preview} alt="preview" className="max-h-40 rounded-2xl object-contain mb-3" />
                ) : (
                  <div className="text-4xl mb-3">{archivo ? '📄' : '⬆️'}</div>
                )}
                {archivo ? (
                  <>
                    <p className="font-bold text-gray-900 text-sm">{archivo.name}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {(archivo.size / 1024 / 1024).toFixed(2)} MB · Haz clic para cambiar
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-gray-700 text-sm">Arrastra o haz clic para subir</p>
                    <p className="text-gray-400 text-xs mt-1">PDF, JPG o PNG · Máx. 10 MB</p>
                  </>
                )}
                <input
                  id="doc-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleArchivo}
                  className="hidden"
                />
              </label>
            </div>

            {/* Info */}
            <div className="bg-[#F8F5EF] border border-gray-200 rounded-2xl px-4 py-3 text-xs text-gray-600 leading-relaxed mb-6">
              🔒 Tu documento es <strong className="text-[#0F172A]">confidencial</strong>. Se verificará automáticamente al enviarlo. Solo se almacena de forma segura en nuestros servidores.
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 mb-4 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setPaso(1)}
                className="border border-gray-200 text-gray-600 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-[#F8F5EF] transition-all"
              >
                ← Atrás
              </button>
              <button
                onClick={handleEnviar}
                disabled={!archivo || !tipoDoc || loading}
                className="flex-1 bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : '📤 Enviar verificación'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                Completar más tarde
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: CONFIRMACIÓN ── */}
        {paso === 3 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] text-[#D4AF37] flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg">
              ✅
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Documentación enviada!</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Tu documento está en <strong className="text-[#0F172A]">proceso de verificación</strong>.
              Si cumple los requisitos, tu cuenta se verificará al instante.
            </p>

            <div className="bg-[#F8F5EF] border border-gray-100 rounded-2xl p-5 mb-8 text-left space-y-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Resumen</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-xl">{ADMINISTRACIONES.find(a => a.valor === administracion)?.icono}</span>
                <div>
                  <p className="font-bold text-gray-900">{ADMINISTRACIONES.find(a => a.valor === administracion)?.label}</p>
                  <p className="text-gray-400 text-xs">Administración seleccionada</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-xl">{TIPOS_DOC.find(t => t.valor === tipoDoc)?.icono}</span>
                <div>
                  <p className="font-bold text-gray-900">{TIPOS_DOC.find(t => t.valor === tipoDoc)?.label}</p>
                  <p className="text-gray-400 text-xs">Tipo de documento</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-xl">📁</span>
                <div>
                  <p className="font-bold text-gray-900 truncate">{archivo?.name}</p>
                  <p className="text-gray-400 text-xs">Archivo adjunto</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/pisos')}
                className="bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
              >
                🔍 Buscar pisos ahora
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="border border-gray-200 text-gray-600 py-3 rounded-2xl font-bold text-sm hover:bg-[#F8F5EF] transition-all"
              >
                Ir a mi panel
              </button>
            </div>
          </div>
        )}

        {/* INFO CARDS abajo */}
        {paso < 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { icon: '🔒', texto: 'Documento confidencial' },
              { icon: '⚡', texto: 'Verificación automática' },
              { icon: '🔍', texto: 'Puedes buscar mientras tanto' },
            ].map(b => (
              <div key={b.texto} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm text-xs text-gray-500">
                <div className="text-xl mb-1">{b.icon}</div>
                {b.texto}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#0F172A] py-14 px-6 text-center text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80)',
            backgroundSize: 'cover',
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            ¿Tienes un piso cerca de un hospital, colegio o juzgado?
          </h2>
          <p className="text-slate-100 mb-8 text-base md:text-lg">
            Únete a los propietarios que ya publican en MundoInterino. Publicación gratuita, inquilinos con nómina pública garantizada.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/pisos/nuevo"
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#0F172A] font-bold px-10 py-4 rounded-2xl text-lg transition-all hover:scale-[1.02] shadow-lg inline-flex items-center justify-center"
            >
              Publicar mi piso gratis
            </Link>
            <Link
              to="/sobre-nosotros"
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all border border-white/20 inline-flex items-center justify-center backdrop-blur-md"
            >
              Saber más
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B1220] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="MundoInterino" className="h-12 object-contain opacity-90" />
            <p className="text-slate-100 text-sm">© 2026 MundoInterino · Tu hogar donde te necesiten</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-100">
            <Link to="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link>
            <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
            <Link to="/pisos/nuevo" className="hover:text-white transition-colors">Publicar piso</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
