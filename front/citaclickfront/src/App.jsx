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
import PanelPeluqueria from './PagesPeluquerias/PanelPeluqueria.jsx';
import Ganancias from './PagesPeluquerias/Ganancias.jsx';
import Reservas from './PagesPeluquerias/Reservas.jsx';
import Suscripcion from './PagesPeluquerias/Suscripcion.jsx';
import Servicios from './PagesPeluquerias/Servicios.jsx';
import Perfil from './pages/Perfil.jsx';


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
        <Route path="/Perfil" element={<Perfil/>} />
        <Route path="/PanelPeluqueria" element={<PanelPeluqueria />} />
        <Route path="/Ganancias" element={<Ganancias />} />
        <Route path="/Reservas" element={<Reservas />} />
        <Route path="/Suscripcion" element={<Suscripcion />} />
        <Route path="/Servicios" element={<Servicios />} />

      </Routes>
      <Footer/>
    </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;
