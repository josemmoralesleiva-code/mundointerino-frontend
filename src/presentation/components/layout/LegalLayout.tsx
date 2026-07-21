import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'

interface LegalLayoutProps {
  title: string
  subtitle?: string
  lastUpdated?: string
  children: ReactNode
}

export default function LegalLayout({ title, subtitle, lastUpdated, children }: LegalLayoutProps) {
  return (
    <PageLayout showCTA={false}>
      <article className="max-w-3xl mx-auto px-6 py-12 text-[#0F172A]">
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-600 text-sm md:text-base">{subtitle}</p>}
          {lastUpdated && (
            <p className="mt-3 text-xs text-gray-400">Última actualización: {lastUpdated}</p>
          )}
        </header>

        <div className="prose-legal space-y-6 text-[15px] leading-relaxed text-gray-800">
          {children}
        </div>

        <nav className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p className="font-semibold mb-3 text-gray-700">Documentos legales</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link to="/aviso-legal" className="hover:text-[#0F172A] underline-offset-2 hover:underline">Aviso Legal</Link></li>
            <li><Link to="/privacidad" className="hover:text-[#0F172A] underline-offset-2 hover:underline">Política de Privacidad</Link></li>
            <li><Link to="/cookies" className="hover:text-[#0F172A] underline-offset-2 hover:underline">Política de Cookies</Link></li>
            <li><Link to="/terminos" className="hover:text-[#0F172A] underline-offset-2 hover:underline">Términos y Condiciones</Link></li>
          </ul>
        </nav>
      </article>
    </PageLayout>
  )
}
