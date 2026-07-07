import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageLayout from '../components/layout/PageLayout'
import { useAuth } from '../hooks/useAuth'
import { translateVerifyEmailError } from '../../domain/utils/verifyEmailMessages'

const COOLDOWN_SECONDS = 30

type ResendState =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

export default function VerifyEmailPending() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const { resendVerification } = useAuth()

  const [state, setState] = useState<ResendState>({ kind: 'idle' })
  const [cooldown, setCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
    }
  }, [])

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS)
    if (cooldownRef.current) clearInterval(cooldownRef.current)
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current)
          cooldownRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (!email || state.kind === 'sending' || cooldown > 0) return
    setState({ kind: 'sending' })
    const res = await resendVerification(email)
    if (res.ok) {
      setState({ kind: 'sent' })
      startCooldown()
    } else {
      setState({ kind: 'error', message: translateVerifyEmailError(res.error) })
    }
  }

  const buttonLabel = () => {
    if (state.kind === 'sending') return 'Enviando...'
    if (cooldown > 0) return `Reintentar en ${cooldown}s`
    if (state.kind === 'sent') return 'Reenviado ✓'
    return 'Reenviar correo'
  }

  const disabled = state.kind === 'sending' || cooldown > 0

  return (
    <PageLayout>
      <Navbar />

      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] text-white py-14 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-3">✉️</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Revisa tu correo</h1>
          <p className="text-slate-100 text-sm md:text-base leading-relaxed">
            {email
              ? <>Te hemos enviado un enlace de confirmación a <strong className="text-[#D4AF37] break-all">{email}</strong>.</>
              : 'Te hemos enviado un enlace de confirmación a tu correo electrónico.'}
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Pulsa el enlace del correo para activar tu cuenta. Si no lo encuentras, revisa la carpeta de spam o correo no deseado.
          </p>

          <button
            onClick={handleResend}
            disabled={disabled || !email}
            className="w-full bg-[#0F172A] hover:bg-[#1E3A5F] text-white py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:hover:scale-100"
          >
            {buttonLabel()}
          </button>

          {!email && (
            <p className="mt-3 text-xs text-gray-400">
              No podemos reenviar el correo porque falta tu email. Vuelve al registro e inténtalo de nuevo.
            </p>
          )}

          {state.kind === 'sent' && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 text-sm">
              ✓ Hemos reenviado el correo. Revisa tu bandeja de entrada.
            </div>
          )}

          {state.kind === 'error' && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
              ⚠️ {state.message}
            </div>
          )}

          <div className="mt-8">
            <Link to="/login" className="text-[#0F172A] font-bold text-sm hover:underline">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
