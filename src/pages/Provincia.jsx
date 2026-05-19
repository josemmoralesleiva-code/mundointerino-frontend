import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

const DATA = {
  aragon: {
    zaragoza: ['Zaragoza', 'Calatayud', 'Ejea de los Caballeros', 'Tarazona'],
    huesca: ['Huesca', 'Jaca', 'Fraga', 'Monzón'],
    teruel: ['Teruel', 'Alcañiz', 'Andorra', 'Bajo Aragón'],
  },
  andalucia: {
    sevilla: ['Sevilla', 'Écija', 'Utrera', 'Carmona'],
    malaga: ['Málaga', 'Marbella', 'Vélez-Málaga', 'Antequera'],
    granada: ['Granada', 'Motril', 'Baza', 'Guadix'],
    cordoba: ['Córdoba', 'Lucena', 'Puente Genil', 'Priego de Córdoba'],
    cadiz: ['Cádiz', 'Jerez de la Frontera', 'Algeciras', 'San Fernando'],
    huelva: ['Huelva', 'Lepe', 'Moguer', 'Isla Cristina'],
    jaen: ['Jaén', 'Linares', 'Úbeda', 'Andújar'],
    almeria: ['Almería', 'El Ejido', 'Roquetas de Mar', 'Níjar'],
  },
}

const NOMBRES = {
  aragon: 'Aragón',
  andalucia: 'Andalucía',
}

const PROVINCIA_NAMES = {
  zaragoza: 'Zaragoza',
  huesca: 'Huesca',
  teruel: 'Teruel',
  sevilla: 'Sevilla',
  malaga: 'Málaga',
  granada: 'Granada',
  cordoba: 'Córdoba',
  cadiz: 'Cádiz',
  huelva: 'Huelva',
  jaen: 'Jaén',
  almeria: 'Almería',
}

export default function Provincia() {
  const navigate = useNavigate()
  const { comunidad, provincia } = useParams()

  const ciudades = DATA[comunidad]?.[provincia] || []

  if (!ciudades.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Provincia no encontrada</h1>
          <button
            onClick={() => navigate(`/zonas/${comunidad}`)}
            className="mt-6 bg-primary-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Volver a la comunidad
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(`/zonas/${comunidad}`)} className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver a {NOMBRES[comunidad] || 'la comunidad'}
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">{PROVINCIA_NAMES[provincia] || provincia}</h1>
          {/* ✏️ CAMBIO: texto más inclusivo */}
          <p className="text-gray-500 mt-2">Selecciona una ciudad o pueblo para ver pisos disponibles para interinos.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ciudades.map(ciudad => (
            <button
              key={ciudad}
              onClick={() => navigate(`/zonas/${comunidad}/${provincia}/${encodeURIComponent(ciudad)}`)}
              className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-lg transition-all"
            >
              <h2 className="text-lg font-bold text-gray-800">{ciudad}</h2>
              <p className="text-gray-500 text-sm mt-1">Ver pisos en esta zona</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}