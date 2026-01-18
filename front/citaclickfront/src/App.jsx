import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Nav';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext.jsx';

import Inicio from './pages/Inicio';
import Login from './pages/login.jsx';
import RegistrarUser from './pages/RegistrarUser';
import RegistroNegocio from './pages/RegistroNegocio.jsx';
import ListadoNegocios from './pages/ListadoNegocios.jsx';
import RecursosCliente from './pages/RecursosCliente.jsx';
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
import BusquedaAvanzadaPeluquerias from './pages/BusquedaAvanzadaPeluquerias.jsx';
import Recursos from "./PagesPeluquerias/Recursos";


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
          <Route path="/registrar_negocio" element={<RegistroNegocio />} />
          <Route path="/negocio/:id/recursos" element={<RecursosCliente />} />
          <Route path="/listado_negocios" element={<ListadoNegocios />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/negocio/:negocioId/ver_horarios/:recursoId" element={<VerHorarios />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/busqueda-avanzada" element={<BusquedaAvanzadaPeluquerias />} />
          {/* Panel Negocios */}
          <Route path="/panelpeluqueria" element={<PanelPeluqueria />} />
          <Route path="/ganancias" element={<Ganancias />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/suscripcion" element={<Suscripcion />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/agregar" element={<Agregar />} />
          <Route path="/editaroeliminar" element={<EditarOEliminar />} />
          <Route path="/editar/:id" element={<Editar />} />
          <Route path="/recursos" element={<Recursos />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
