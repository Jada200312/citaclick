// src/components/MenuPrincipal.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ganancias from "../assets/ganancias.png";
import reservas from "../assets/Reservas.png";
import suscripciones from "../assets/Suscripcion.png";
import gestionservice from "../assets/servicios.png";

const MenuPrincipal = ({ peluqueriaId }) => {
  const navigate = useNavigate();

  // 🔹 Obtener ID usuario desde token JWT
  const obtenerUsuarioDesdeToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id || payload.user || payload.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const usuarioId = obtenerUsuarioDesdeToken();
  const esPeluqueria = localStorage.getItem("es_peluqueria") === "true"; // o ajusta según tu backend

  // 🔹 Validar acceso
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !usuarioId) {
      navigate("/login"); // No autenticado
    } else if (!esPeluqueria) {
      navigate("/"); // No es peluquería → fuera
    }
  }, [navigate, usuarioId, esPeluqueria]);

  const opciones = [
    { nombre: "Ganancias", imagen: ganancias, ruta: "/ganancias" },
    { nombre: "Reservas", imagen: reservas, ruta: `/Reservas` }, // dinámico
    { nombre: "Suscripción", imagen: suscripciones, ruta: "/Suscripcion" },
    { nombre: "Gestionar Servicio", imagen: gestionservice, ruta: "/servicios" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 bg-black py-10">
      {opciones.map((opcion) => (
        <div
          key={opcion.nombre}
          className="bg-orange-500 w-64 h-64 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:scale-105 transition"
          onClick={() => navigate(opcion.ruta)}
        >
          <img
            src={opcion.imagen}
            alt={opcion.nombre}
            className="w-24 h-24 mb-4"
          />
          <p className="text-white text-lg font-semibold">{opcion.nombre}</p>
        </div>
      ))}
    </div>
  );
};

export default MenuPrincipal;
