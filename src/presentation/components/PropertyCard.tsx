import { useNavigate } from 'react-router-dom'
import type { Property } from '../../domain/models'

interface PropertyCardProps {
  property: Property
  variant?: 'grid' | 'list'
}

export default function PropertyCard({ property, variant = 'grid' }: PropertyCardProps) {
  const navigate = useNavigate()

  if (variant === 'list') {
    return (
      <div
        onClick={() => navigate(`/pisos/${property.id}`)}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex group"
      >
        <div className="w-56 shrink-0 relative overflow-hidden">
          {property.fotos?.[0] ? (
            <img
              src={property.fotos[0]}
              alt={property.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50">🏠</div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              property.tipoEstancia === 'corta'
                ? 'bg-[#D4AF37] text-[#0F172A]'
                : 'bg-[#1E3A5F] text-white'
            }`}>
              {property.tipoEstancia === 'corta' ? '⚡ Corta' : '📅 Larga'}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#0F172A] leading-snug">
              {property.titulo}
            </h3>
            <p className="text-gray-500 text-sm mb-2">📍 {property.ciudad}</p>
            <div className="flex gap-3 text-xs text-gray-400">
              <span>🛏 {property.habitaciones} hab.</span>
              {property.metros && <span>📐 {property.metros} m²</span>}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[#0F172A] font-bold text-xl">
              {property.precio}€
              <span className="text-sm font-normal text-gray-400">
                {property.tipoEstancia === 'corta' ? '/noche' : '/mes'}
              </span>
            </span>
            <span className="text-xs text-[#2F5DAA] font-semibold">Ver detalles →</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/pisos/${property.id}`)}
      className="bg-white rounded-3xl shadow-sm hover:shadow-2xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="h-52 overflow-hidden relative">
        {property.fotos?.[0] ? (
          <img
            src={property.fotos[0]}
            alt={property.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-50">🏠</div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            property.tipoEstancia === 'corta'
              ? 'bg-[#D4AF37] text-[#0F172A]'
              : 'bg-[#1E3A5F] text-white'
          }`}>
            {property.tipoEstancia === 'corta' ? '⚡ Corta' : '📅 Larga'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1 leading-snug group-hover:text-[#0F172A] transition-colors">
          {property.titulo}
        </h3>
        <p className="text-gray-500 text-sm mb-3">📍 {property.ciudad}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#0F172A] font-bold text-lg">
            {property.precio}€
            <span className="text-sm font-normal text-gray-400">
              {property.tipoEstancia === 'corta' ? '/noche' : '/mes'}
            </span>
          </span>
          <span className="text-xs bg-[#F8F5EF] text-gray-600 px-2 py-1 rounded-full">
            🛏 {property.habitaciones} hab.
          </span>
        </div>
      </div>
    </div>
  )
}
