import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import NewProperty from '../pages/NewProperty'
import Properties from '../pages/Properties'
import PropertyDetail from '../pages/PropertyDetail'
import EditProperty from '../pages/EditProperty'
import TeacherVerification from '../pages/TeacherVerification'
import OwnerVerification from '../pages/OwnerVerification'
import Admin from '../pages/Admin'
import Profile from '../pages/Profile'
import Zones from '../pages/Zones'
import Region from '../pages/Region'
import Province from '../pages/Province'
import ZoneDetail from '../pages/ZoneDetail'
import Contact from '../pages/Contact'
import AboutUs from '../pages/AboutUs'
import Community from '../pages/Community'
import Education from '../pages/Education'
import Health from '../pages/Health'
import Justice from '../pages/Justice'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/pisos" element={<Properties />} />
      <Route
        path="/pisos/nuevo"
        element={
          <PrivateRoute>
            <NewProperty />
          </PrivateRoute>
        }
      />
      <Route path="/pisos/:id" element={<PropertyDetail />} />
      <Route
        path="/pisos/:id/editar"
        element={
          <PrivateRoute>
            <EditProperty />
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
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="/verificacion-docente" element={<TeacherVerification />} />
      <Route path="/verificacion-propietario" element={<OwnerVerification />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route path="/zonas" element={<Zones />} />
      <Route path="/zonas/:comunidad" element={<Region />} />
      <Route path="/zonas/:comunidad/:provincia" element={<Province />} />
      <Route path="/zonas/:comunidad/:provincia/:ciudad" element={<ZoneDetail />} />
      <Route path="/sobre-nosotros" element={<AboutUs />} />
      <Route path="/contacto" element={<Contact />} />

      <Route
        path="/mundo"
        element={
          <PrivateRoute>
            <Community />
          </PrivateRoute>
        }
      />
      <Route
        path="/mundo/educacion"
        element={
          <PrivateRoute administracion="educacion">
            <Education />
          </PrivateRoute>
        }
      />
      <Route
        path="/mundo/sanidad"
        element={
          <PrivateRoute administracion="sanidad">
            <Health />
          </PrivateRoute>
        }
      />
      <Route
        path="/mundo/justicia"
        element={
          <PrivateRoute administracion="justicia">
            <Justice />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
