import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Nav';
import { AuthProvider } from './context/AuthContext.jsx';
import Inicio from './pages/Inicio';
import Login from './pages/login.jsx'
import RegistrarUser from './pages/RegistrarUser';
import RegistroPeluqueria from './pages/RegistroPeluqueria';
import Reservar from './pages/reservar';
import Footer from'./components/Footer'
import './index.css';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<RegistrarUser />} />
        <Route path="/peluqueria" element={<RegistroPeluqueria />} />
        <Route path="/reserva" element={<Reservar />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;
