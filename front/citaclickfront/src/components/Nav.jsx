import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavHome from '../assets/home.png';
import IconMenu from '../assets/acordeon.png'; 

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const ruta = location.pathname;

  const isActive = (path) => ruta === path;
  const isAuthenticated = !!localStorage.getItem('access_token');
  const esPeluqueria = localStorage.getItem('es_peluqueria') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('es_peluqueria');
    navigate('/');
  };

  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (
        menuAbierto &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !toggleRef.current.contains(e.target)
      ) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('click', handleClickFuera);
    return () => document.removeEventListener('click', handleClickFuera);
  }, [menuAbierto]);

  return (
    <nav className="bg-zinc-950 text-white p-4 rounded-lg shadow-md flex justify-between items-center relative">
      
      <div className="flex items-center space-x-2">
        <img src={NavHome} alt="Logo" className="h-10" />
        <h1 className="text-xl font-bold">
          CITA <span className="text-orange-500">CLICK</span>
        </h1>
      </div>

     
      <button
        ref={toggleRef}
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="md:hidden ml-4"
      >
        <img src={IconMenu} alt="Menú" className="h-8 w-8" />
      </button>

      
      <div
        ref={menuRef}
        className={`absolute top-full right-4 z-50 bg-zinc-900 p-4 rounded-lg mt-2 w-48 md:w-auto md:static md:bg-transparent md:flex md:items-center md:space-x-4 ${
          menuAbierto ? 'block' : 'hidden'
        } md:block`}
      >
        <Link
          to="/"
          className={`block px-3 py-1 rounded-md transition ${
            isActive('/') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
          }`}
        >
          Inicio
        </Link>

        {!isAuthenticated && ruta === '/login' && (
          <Link
            to="/registrar"
            className={`block px-3 py-1 rounded-md transition ${
              isActive('/registrar') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
            }`}
          >
            Registrar
          </Link>
        )} 

        {!isAuthenticated ? (
          <Link
            to="/login"
            className={`block px-3 py-1 rounded-md transition ${
              isActive('/login') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
            }`}
          >
            Iniciar sesión
          </Link>
        ) : (
          <>
          
            {esPeluqueria && (
              <Link
                to="/PanelPeluqueria"
                className={`block px-3 py-1 rounded-md transition ${
                  isActive('/PanelPeluqueria') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
                }`}
              >
                Panel 
              </Link>
            )}
            
            <Link
              to="/Perfil"
              className={`block px-3 py-1 rounded-md transition ${
                isActive('/Perfil') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
              }`}
            >
              Perfil
            </Link>

            <Link
              to="/reserva"
              className={`block px-3 py-1 rounded-md transition ${
                isActive('/reserva') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500'
              }`}
            >
              Reservar
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-1 rounded-md transition hover:bg-orange-500"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
