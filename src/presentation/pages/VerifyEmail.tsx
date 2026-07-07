import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'
import { useAuth } from '../hooks/useAuth'
import { translateVerifyEmailError } from '../../domain/utils/verifyEmailMessages'

type VerifyState =
  | { kind: 'verifying' }
  | { kind: 'success' }
  | { kind: 'error'; code?: string }

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const { verifyEmail } = useAuth()

  const [state, setState] = useState<VerifyState>({ kind: 'verifying' })
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    if (!token) {
      setState({ kind: 'error', code: 'token-invalido' })
      return
    }

    (async () => {
      const res = await verifyEmail(token)
      if (res.ok) {
        setState({ kind: 'success' })
      } else {
        setState({ kind: 'error', code: res.error })
      }
    })()
  }, [token, verifyEmail])

  return (
    <PageLayout>
      <Navbar />

      <section className="max-w-xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          {state.kind === 'verifying' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F8F5EF] mb-5">
                <div className="w-6 h-6 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando tu cuenta...</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Estamos confirmando tu correo electrónico. Esto solo tardará unos segundos.
              </p>
            </>
          )}

          {state.kind === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5 text-3xl">
                ✅
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Cuenta verificada</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Tu correo electrónico ha sido confirmado. Te estamos redirigiendo a tu panel...
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-[#0F172A] hover:bg-[#1E3A5F] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
              >
                Ir a mi panel →
              </button>
            </>
          )}

          {state.kind === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-5 text-3xl">
                ⚠️
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">No se pudo verificar</h1>
              <p className="text-red-600 text-sm leading-relaxed mb-6">
                {translateVerifyEmailError(state.code)}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/registro')}
                  className="bg-[#0F172A] hover:bg-[#1E3A5F] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
                >
                  Solicitar uno nuevo
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#0F172A] font-bold text-sm hover:underline"
                >
                  ← Volver al inicio de sesión
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
