import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCookieConsent } from '../../hooks/useCookieConsent'

export default function CookieBanner() {
  const { shouldShowBanner, accept, reject } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)

  if (!shouldShowBanner) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 md:p-6"
    >
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-2xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1 text-sm text-gray-700">
            <p>
              <span className="font-bold text-[#0F172A]">🍪 Uso de cookies:</span>{' '}
              Mundointerino solo utiliza <strong>cookies técnicas exceptuadas</strong> (sesión y
              preferencia de consentimiento), necesarias para el funcionamiento del sitio. No
              usamos cookies publicitarias ni analíticas. Consulta nuestra{' '}
              <Link to="/cookies" className="text-[#2F5DAA] underline">
                Política de Cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={reject}
              className="border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Rechazar
            </button>
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="border border-gray-200 text-gray-700 bg-white px-4 py-2 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all"
            >
              Configurar
            </button>
            <button
              onClick={accept}
              className="bg-[#0F172A] text-white px-5 py-2 rounded-2xl text-sm font-bold hover:bg-[#1E3A5F] transition-all"
            >
              Aceptar
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-5 pt-5 border-t border-gray-100 text-sm text-gray-700">
            <p className="mb-2">
              <strong>Detalle de cookies utilizadas:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <code className="bg-gray-100 px-1 rounded">refresh_token</code> (httpOnly, 7 días):
                mantiene la sesión iniciada. Exceptuada por ser imprescindible para el servicio.
              </li>
              <li>
                <code className="bg-gray-100 px-1 rounded">mi_cookie_consent</code> (localStorage, 12 meses):
                recuerda tu preferencia. Exceptuada por ser estrictamente necesaria.
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Al no existir cookies no exceptuadas, "Aceptar" y "Rechazar" tienen el mismo efecto
              sobre el funcionamiento de la web (que se mantendrá idéntico). La preferencia se
              conserva 12 meses y puedes revocarla en cualquier momento desde la{' '}
              <Link to="/cookies" className="text-[#2F5DAA] underline">Política de Cookies</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
