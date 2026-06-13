import { Link } from 'react-router-dom'

export default function Footer() {
  return (
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
  )
}
