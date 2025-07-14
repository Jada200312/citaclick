import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NavHome from '../assets/home.png'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const ruta = location.pathname

  const isActive = (path) => ruta === path

  const isAuthenticated = !!localStorage.getItem('access_token')

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/')
  }

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

        {!isAuthenticated && ruta === '/login' &&(
    <Link
      to="/registrar"
      className={`px-3 py-1 rounded-md transition ${
        isActive('/registrar') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500 '
      }`}
    >
      Registrar
    </Link>
  )}

        {!isAuthenticated ? (
          <Link
            to="/login"
            className={`px-3 py-1 rounded-md transition ${
              isActive('/login') ? 'bg-orange-500 text-white' : 'hover:bg-orange-500 '
            }`}
          >
            Iniciar sesión
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md transition hover:bg-red-600 bg-red-500"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
