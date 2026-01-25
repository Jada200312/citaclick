import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SeleccionTipo = () => {
  const [tiposNegocio, setTiposNegocio] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/negocios/tipos-negocio/")
      .then((res) => {
        setTiposNegocio(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando tipos de negocio:", err);
        setCargando(false);
      });
  }, []);

  const seleccionarTipo = (tipoId) => {
    navigate(`/listado_negocios?tipo=${tipoId}`);
  };

  if (cargando) {
    return (
      <div className="text-center text-white mt-20 text-xl">
        Cargando tipos de negocio...
      </div>
    );
  }

  if (tiposNegocio.length === 0) {
    return (
      <div className="text-center text-white mt-20 text-xl">
        No hay tipos de negocio disponibles.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Selecciona el tipo de negocio
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tiposNegocio.map((tipo) => (
          <div
            key={tipo.id}
            onClick={() => seleccionarTipo(tipo.id)}
            className="cursor-pointer bg-zinc-900 text-white rounded-xl border border-gray-300 p-6 text-center shadow-md hover:bg-orange-600 transition"
          >
            <h2 className="text-xl font-semibold">{tipo.nombre}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeleccionTipo;
