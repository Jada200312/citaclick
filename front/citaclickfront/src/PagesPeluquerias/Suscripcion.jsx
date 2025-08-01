// src/pages/Suscripcion.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Suscripcion = () => {
  const [planes, setPlanes] = useState([]);
  const navigate = useNavigate();

  // 🔹 Obtener ID usuario desde token JWT
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
  const esPeluqueria = localStorage.getItem("es_peluqueria") === "true"; // o ajusta según backend

  // 🔹 Validar acceso
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token || !usuarioId) {
      navigate("/login"); // No autenticado
      return;
    }
    if (!esPeluqueria) {
      navigate("/"); // No es peluquería → fuera
      return;
    }

    // 🔹 Si pasa validación → cargar planes
    const fetchPlanes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/peluquerias/planes/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPlanes(response.data);
      } catch (error) {
        console.error('Error al obtener los planes:', error);
      }
    };

    fetchPlanes();
  }, [navigate, usuarioId, esPeluqueria]);

  const handleSeleccionar = (planId) => {
    navigate(`/activar/${planId}`);
  };

  return (
    <div className="bg-black min-h-screen text-white py-20 px-6">
      <h2 className="text-5xl font-extrabold mb-16 text-center">
        Elige tu <span className="text-orange-500">Plan</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className="bg-white text-black rounded-3xl shadow-lg p-10 flex flex-col justify-between text-center min-h-[450px] hover:shadow-2xl transition-shadow duration-300"
          >
            <div>
              <div className="bg-orange-500 text-white text-sm font-bold px-6 py-1 rounded-full mb-6 inline-block">
                {plan.nombre.toUpperCase()}
              </div>

              <div className="text-4xl font-bold mb-2">${Number(plan.precio).toFixed(2)}</div>
              <div className="text-sm font-medium text-gray-500 mb-8">COP</div>

              <p className="text-base mb-8">{plan.descripcion}</p>

              <ul className="text-sm text-gray-700 space-y-3 mb-8">
                <li><strong>Límite de Reservas:</strong> {plan.limite_reservas}</li>
                <li><strong>Comisión:</strong> {Number(plan.comision).toFixed(2)}%</li>
              </ul>
            </div>

            <button
              onClick={() => handleSeleccionar(plan.id)}
              className="mt-auto border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition px-8 py-3 rounded-md font-semibold text-sm"
            >
              Adquirir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suscripcion;
