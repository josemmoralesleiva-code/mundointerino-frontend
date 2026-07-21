import LegalLayout from '../components/layout/LegalLayout'

export default function PoliticaCookies() {
  return (
    <LegalLayout
      title="Política de Cookies"
      subtitle="Información sobre el uso de cookies en el sitio web, conforme a la LSSI-CE y la Guía de la AEPD."
      lastUpdated="21 de julio de 2026"
    >
      <section>
        <h2 className="text-xl font-bold mb-2">1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que un sitio web envía al navegador del
          usuario y se almacenan en su dispositivo. Permiten reconocer al usuario durante una
          visita posterior (cookies persistentes) o dentro de una misma sesión (cookies de
          sesión), y facilitan la navegación y el funcionamiento del sitio.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">2. Consentimiento</h2>
        <p>
          Conforme al artículo 22.2 de la Ley 34/2002 (LSSI-CE) y la Guía sobre el uso de cookies
          de la Agencia Española de Protección de Datos, Mundointerino solicita el
          <strong> consentimiento previo, expreso e informado</strong> del usuario para el uso de
          cookies no exceptuadas.
        </p>
        <p className="mt-3">
          El usuario puede gestionar su consentimiento a través del banner que aparece en la
          primera visita al sitio web. La preferencia se conserva durante <strong>12 meses</strong>,
          transcurridos los cuales se solicita nuevamente. El usuario puede revocar el
          consentimiento en cualquier momento desde esta misma página (ver sección 6).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">3. Cookies utilizadas por Mundointerino</h2>
        <p>
          Mundointerino <strong>no utiliza cookies de publicidad ni cookies analíticas de
          terceros</strong>. Únicamente se utilizan cookies <strong>técnicas exceptuadas</strong>
          conforme a la Guía de la AEPD, que no requieren consentimiento.
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border border-gray-200 rounded-xl">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-2 border-b border-gray-200">Cookie</th>
                <th className="px-3 py-2 border-b border-gray-200">Tipo</th>
                <th className="px-3 py-2 border-b border-gray-200">Finalidad</th>
                <th className="px-3 py-2 border-b border-gray-200">Duración</th>
                <th className="px-3 py-2 border-b border-gray-200">Exceptuada</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b border-gray-100"><code>refresh_token</code></td>
                <td className="px-3 py-2 border-b border-gray-100">Técnica (httpOnly)</td>
                <td className="px-3 py-2 border-b border-gray-100">Mantener la sesión iniciada del usuario. No accesible desde JavaScript.</td>
                <td className="px-3 py-2 border-b border-gray-100">7 días</td>
                <td className="px-3 py-2 border-b border-gray-100">Sí</td>
              </tr>
              <tr>
                <td className="px-3 py-2"><code>mi_cookie_consent</code></td>
                <td className="px-3 py-2">Técnica (localStorage)</td>
                <td className="px-3 py-2">Recordar la preferencia de consentimiento de cookies del usuario.</td>
                <td className="px-3 py-2">12 meses</td>
                <td className="px-3 py-2">Sí</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Nota: las cookies httpOnly de autenticación están exceptuadas del deber de informar y
          recabar consentimiento por ser imprescindibles para el servicio solicitado por el
          usuario (art. 22.2.c LSSI-CE y Guía AEPD).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">4. Cookies de terceros</h2>
        <p>
          Mundointerino no incluye en el sitio web servicios de terceros que carguen cookies no
          exceptuadas (no se utiliza Google Analytics ni servicios de publicidad). Los
          proveedores externos (Cloudinary, Resend, Railway y Vercel) actúan como encargados del
          tratamiento y no introducen cookies en el navegador del usuario.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">5. Cómo gestionar las cookies desde el navegador</h2>
        <p>
          El usuario puede bloquear, permitir o eliminar las cookies instaladas a través de las
          opciones de configuración de su navegador. A continuación se incluyen los enlaces a las
          instrucciones oficiales de los navegadores más comunes:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#2F5DAA] underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noopener noreferrer" className="text-[#2F5DAA] underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#2F5DAA] underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-[#2F5DAA] underline">Microsoft Edge</a></li>
        </ul>
        <p className="mt-3">
          Si el usuario bloquea las cookies técnicas, es posible que algunas funcionalidades del
          sitio web (como iniciar sesión o mantener la sesión activa) no funcionen correctamente.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">6. Revocación del consentimiento</h2>
        <p>
          El usuario puede revocar su consentimiento y volver a mostrar el banner de cookies
          utilizando el siguiente botón:
        </p>
        <div className="mt-4">
          <RevokeConsentButton />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">7. Actualización de la Política de Cookies</h2>
        <p>
          Mundointerino se reserva el derecho de modificar la presente Política de Cookies para
          adaptarla a las novedades legislativas o a las prácticas de la industria. Se recomienda
          al usuario revisarla periódicamente.
        </p>
      </section>
    </LegalLayout>
  )
}

import { useCookieConsent } from '../hooks/useCookieConsent'

function RevokeConsentButton() {
  const { revoke, status } = useCookieConsent()
  if (!status) {
    return (
      <p className="text-sm text-gray-600">
        No hay consentimiento registrado. El banner aparecerá automáticamente en tu próxima visita.
      </p>
    )
  }
  return (
    <button
      onClick={revoke}
      className="bg-[#0F172A] text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#1E3A5F] transition-all"
    >
      Revocar consentimiento y mostrar banner de nuevo
    </button>
  )
}
