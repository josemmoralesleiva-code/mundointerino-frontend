import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 items-start">
        <div className="flex items-center gap-3 md:col-span-1">
          <img src="/img/logo.png" alt="MundoInterino" className="h-12 object-contain opacity-90" />
          <p className="text-slate-100 text-sm">© 2026 MundoInterino · Tu hogar donde te necesiten</p>
        </div>

        <nav aria-label="Mundointerino" className="text-sm text-slate-100 md:justify-self-center">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Mundointerino</p>
          <ul className="flex flex-col gap-1.5">
            <li><Link to="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            <li><Link to="/pisos/nuevo" className="hover:text-white transition-colors">Publicar piso</Link></li>
          </ul>
        </nav>

        <nav aria-label="Textos legales" className="text-sm text-slate-100 md:justify-self-end">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Legal</p>
          <ul className="flex flex-col gap-1.5">
            <li><Link to="/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link></li>
            <li><Link to="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            <li><Link to="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
            <li><Link to="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
