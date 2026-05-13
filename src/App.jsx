import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Pisos from './pages/Pisos'
import Piso from './pages/Piso'
import Login from './pages/Login'
import Registro from './pages/Registro'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pisos" element={<Pisos />} />
        <Route path="/pisos/:id" element={<Piso />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App