import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Nav';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext.jsx';

import Inicio from './pages/Inicio';
import Login from './pages/Login.jsx';
import RegistrarUser from './pages/RegistrarUser';
import RegistroPeluqueria from './pages/RegistroPeluqueria';
import ListadoPeluquerias from './pages/listado_peluquerias';
import Perfil from './pages/Perfil.jsx';
import VerHorarios from './pages/Ver_Horarios.jsx';
import Reservar from './pages/Reservar.jsx';
import PanelPeluqueria from './PagesPeluquerias/PanelPeluqueria.jsx';
import Ganancias from './PagesPeluquerias/Ganancias.jsx';
import Reservas from './PagesPeluquerias/Reservas.jsx';
import Suscripcion from './PagesPeluquerias/Suscripcion.jsx';
import Servicios from './PagesPeluquerias/Servicios.jsx';
import Agregar from './PagesPeluquerias/Agregar';
import EditarOEliminar from './PagesPeluquerias/EditarOEliminar.jsx';
import Editar from './PagesPeluquerias/Editar.jsx';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<RegistrarUser />} />
          <Route path="/peluqueria" element={<RegistroPeluqueria />} />
          <Route path="/listado_peluquerias" element={<ListadoPeluquerias />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/peluqueria/:id" element={<VerHorarios />} />
          <Route path="/reservar" element={<Reservar />} />

          {/* Panel Peluquería */}
          <Route path="/panelpeluqueria" element={<PanelPeluqueria />} />
          <Route path="/ganancias" element={<Ganancias />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/suscripcion" element={<Suscripcion />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/agregar" element={<Agregar />} />
          <Route path="/editaroeliminar" element={<EditarOEliminar />} />
          <Route path="/editar/:id" element={<Editar />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
