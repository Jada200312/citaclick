import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavHome from '../assets/home.png';

function Navbar() {
  const location = useLocation();
  const ruta = location.pathname;

  
  const isActive = (path) => ruta === path;

  return (
    <nav className="bg-zinc-950 text-white flex justify-between items-center p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <img src={NavHome} alt="Logo" className="h-10" />
        <h1 className="text-xl font-bold">
          CITA <span className="text-orange-500">CLICK</span>
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className={`px-3 py-1 rounded-md transition ${
            isActive('/') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500 '
          }`}
        >
          Inicio
        </Link>

        <Link
          to="/registrar"
          className={`px-3 py-1 rounded-md transition ${
            isActive('/registrar') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500 '
          }`}
        >
          Registrar
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
