import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export default function OwnerVerification() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">

        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🏠</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Bienvenido, {user?.nombre}!
        </h1>
        <p className="text-gray-500 mb-6">
          Tu cuenta de propietario ha sido creada correctamente.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-left">
          <p className="text-green-800 font-semibold text-sm mb-2">📋 Próximos pasos</p>
          <ul className="text-green-700 text-sm space-y-1">
            <li>✅ Cuenta creada</li>
            <li>⏳ Verificación de propietario pendiente</li>
            <li>🏠 Publica tu primer piso mientras tanto</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-700">
          Tu cuenta está <strong>pendiente de verificación</strong>. Puedes publicar pisos pero aparecerán como pendientes hasta que verifiquemos tu identidad.
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/pisos/nuevo')}
            className="bg-primary-700 text-white py-3 rounded-xl font-semibold hover:bg-primary-800 transition-all"
          >
            🏠 Publicar mi primer piso
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            Ir a mi panel
          </button>
        </div>
      </div>
    </div>
  )
}
