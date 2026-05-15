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
      </Routes>
    </BrowserRouter>
  )
}