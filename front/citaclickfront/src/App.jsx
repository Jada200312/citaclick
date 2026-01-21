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
import BusquedaAvanzadaNegocios from './pages/BusquedaAvanzadaNegocios.jsx';
import MenuPrincipal from './PagesNegocios/PanelNegocio.jsx';
import Ganancias from './PagesNegocios/Ganancias.jsx';
import Reservas from './PagesNegocios/Reservas.jsx';
import Suscripcion from './PagesNegocios/Suscripcion.jsx';
import Servicios from './PagesNegocios/Servicios.jsx';
import Agregar from './PagesNegocios/Agregar';
import EditarOEliminar from './PagesNegocios/EditarOEliminar.jsx';
import Editar from './PagesNegocios/Editar.jsx';
import Recursos from "./PagesNegocios/Recursos";


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
          <Route path="/busqueda-avanzada" element={<BusquedaAvanzadaNegocios />} />
          {/* Panel Negocios */}
          <Route path="/panelNegocio" element={<MenuPrincipal />} />
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
