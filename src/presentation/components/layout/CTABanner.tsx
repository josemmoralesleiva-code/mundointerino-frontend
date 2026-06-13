import { Link } from 'react-router-dom'

export default function CTABanner() {
  return (
    <section className="bg-[#0F172A] py-14 px-6 text-center text-white relative overflow-hidden mt-10">
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
  )
}
