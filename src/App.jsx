import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import NuevoPiso from './pages/NuevoPiso'
import Pisos from './pages/Pisos'
import DetallePiso from './pages/DetallePiso'
import EditarPiso from './pages/EditarPiso'
import VerificacionDocente from './pages/VerificacionDocente'
import VerificacionPropietario from './pages/VerificacionPropietario'
import Admin from './pages/Admin'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/pisos" element={<Pisos />} />
        <Route path="/pisos/nuevo" element={
          <PrivateRoute>
            <NuevoPiso />
          </PrivateRoute>
        } />
        <Route path="/pisos/:id" element={<DetallePiso />} />
        <Route path="/pisos/:id/editar" element={
          <PrivateRoute>
            <EditarPiso />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/perfil" element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        } />
        <Route path="/verificacion-docente" element={<VerificacionDocente />} />
        <Route path="/verificacion-propietario" element={<VerificacionPropietario />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}