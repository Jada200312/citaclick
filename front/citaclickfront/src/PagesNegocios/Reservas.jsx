import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarioReservas from "../components/CalendarioReservas";

const Reservas = () => {
  const navigate = useNavigate();

  const rolId = localStorage.getItem("rol");
  const negocioId = localStorage.getItem("negocio_id");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) navigate("/login");
    if (rolId === "cliente") navigate("/");
  }, [navigate, rolId]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black text-white min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-6">
        Reservas <span className="text-orange-500">Del Negocio</span>
      </h2>

      <CalendarioReservas negocioId={negocioId} />
    </div>
  );
};

export default Reservas;
