import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const [ciudad, setCiudad] = useState('')
  const [fechaEntrada, setFechaEntrada] = useState('')
  const [fechaSalida, setFechaSalida] = useState('')

  const handleBuscar = () => {
    navigate(`/pisos?ciudad=${ciudad}&entrada=${fechaEntrada}&salida=${fechaSalida}`)
  }

  const ciudades = [
    { nombre: 'Zaragoza', emoji: '🏛️', pisos: 124 },
    { nombre: 'Huesca', emoji: '🏔️', pisos: 48 },
    { nombre: 'Teruel', emoji: '🌟', pisos: 35 },
    { nombre: 'Calatayud', emoji: '🏰', pisos: 12 },
    { nombre: 'Jaca', emoji: '⛷️', pisos: 19 },
    { nombre: 'Alcañiz', emoji: '🏁', pisos: 8 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-700">🏠 Profinter</div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-700 font-medium hover:underline"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/registro')}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
          >
            Publicar piso
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-blue-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">
          Alquiler para docentes interinos en Aragón
        </h1>
        <p className="text-blue-100 text-lg mb-10">
          Encuentra piso cerca de tu destino. Estancias cortas y largas.
        </p>

        {/* BUSCADOR */}
        <div className="bg-white rounded-2xl p-4 max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="¿A qué ciudad vas? (Zaragoza, Huesca...)"
            value={ciudad}
            onChange={e => setCiudad(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-400"
          />
          <input
            type="date"
            value={fechaEntrada}
            onChange={e => setFechaEntrada(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-400"
          />
          <input
            type="date"
            value={fechaSalida}
            onChange={e => setFechaSalida(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleBuscar}
            className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* CIUDADES */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Destinos más buscados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ciudades.map(c => (
            <div
              key={c.nombre}
              onClick={() => navigate(`/pisos?ciudad=${c.nombre}`)}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer border border-gray-100 hover:border-blue-200 transition-all"
            >
              <div className="text-3xl mb-2">{c.emoji}</div>
              <div className="font-semibold text-gray-800">{c.nombre}</div>
              <div className="text-sm text-gray-500">{c.pisos} pisos disponibles</div>
            </div>
          ))}
        </div>
      </div>

      {/* PARA PROPIETARIOS */}
      <div className="bg-blue-50 py-12 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          ¿Tienes un piso en Aragón?
        </h2>
        <p className="text-gray-600 mb-6">
          Publica gratis y llega a miles de docentes interinos cada curso.
        </p>
        <button
          onClick={() => navigate('/registro')}
          className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800"
        >
          Publicar mi piso gratis
        </button>
      </div>

    </div>
  )
}
