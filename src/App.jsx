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
import Zonas from './pages/Zonas'
import Comunidad from './pages/Comunidad'
import Provincia from './pages/Provincia'
import ZonaDetalle from './pages/ZonaDetalle'
import Contacto from './pages/Contacto'
import SobreNosotros from './pages/SobreNosotros'
import Mundo from './pages/Mundo'
import Educacion from './pages/Educacion'
import Sanidad from './pages/Sanidad'
import Justicia from './pages/Justicia'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/pisos" element={<Pisos />} />
        <Route
          path="/pisos/nuevo"
          element={
            <PrivateRoute>
              <NuevoPiso />
            </PrivateRoute>
          }
        />
        <Route path="/pisos/:id" element={<DetallePiso />} />
        <Route
          path="/pisos/:id/editar"
          element={
            <PrivateRoute>
              <EditarPiso />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route path="/verificacion-docente" element={<VerificacionDocente />} />
        <Route path="/verificacion-propietario" element={<VerificacionPropietario />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="/zonas" element={<Zonas />} />
        <Route path="/zonas/:comunidad" element={<Comunidad />} />
        <Route path="/zonas/:comunidad/:provincia" element={<Provincia />} />
        <Route path="/zonas/:comunidad/:provincia/:ciudad" element={<ZonaDetalle />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Mundo */}
        <Route
          path="/mundo"
          element={
            <PrivateRoute>
              <Mundo />
            </PrivateRoute>
          }
        />
        <Route
          path="/mundo/educacion"
          element={
            <PrivateRoute administracion="educacion">
              <Educacion />
            </PrivateRoute>
          }
        />
        <Route
          path="/mundo/sanidad"
          element={
            <PrivateRoute administracion="sanidad">
              <Sanidad />
            </PrivateRoute>
          }
        />
        <Route
          path="/mundo/justicia"
          element={
            <PrivateRoute administracion="justicia">
              <Justicia />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}