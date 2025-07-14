import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Nav';
import IniciarSesion from './pages/Inicio';
import RegistrarUser from './pages/RegistrarUser';
import RegistroPeluqueria from './pages/registroPeluqueria';
import Footer from'./components/Footer'
import './index.css';




function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/registrar" element={<RegistrarUser />} />
        <Route path="/peluqueria" element={<RegistroPeluqueria />} />
     
      </Routes>
      <Footer/>
    </BrowserRouter>
    
  );
}

export default App;
