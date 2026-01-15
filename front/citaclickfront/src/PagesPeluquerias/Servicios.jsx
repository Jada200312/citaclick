// src/pages/Servicios.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import agregar from '../assets/agregar.png';
import editar from '../assets/editar.png';

const Servicios = () => {
  const navigate = useNavigate();

  // 🔹 Obtener ID usuario desde token JWT (sin recursión)
  const obtenerUsuarioDesdeToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id || payload.user || payload.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const usuarioId = obtenerUsuarioDesdeToken();
  const rolId = localStorage.getItem("rol_id");

  // 🔹 Validar acceso
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token || !usuarioId) {
      navigate("/login");
    } else if (rolId!=="2") {
      navigate("/");
    }
  }, [navigate, usuarioId, rolId]);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-4xl font-bold mb-10 text-center">
        Página de <span className="text-orange-500">Servicios</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-12 items-center">
        {/* Botón completo: Agregar */}
        <button
          onClick={() => navigate('/agregar')}
          className="w-[28rem] h-96 bg-[#fd6f01] p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition hover:scale-105"
        >
          <img
            src={agregar}
            alt="Agregar"
            className="max-w-[150px] h-auto mb-6"
          />
          <span className="text-white text-xl font-bold">Agregar</span>
        </button>

        {/* Botón completo: Editar */}
        <button
          onClick={() => navigate('/editaroeliminar')}
          className="w-[28rem] h-96 bg-[#fd6f01] p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition hover:scale-105"
        >
          <img
            src={editar}
            alt="Editar"
            className="max-w-[150px] h-auto mb-6"
          />
          <span className="text-white text-xl font-bold">Editar</span>
        </button>
      </div>
    </div>
  );
};

export default Servicios;
