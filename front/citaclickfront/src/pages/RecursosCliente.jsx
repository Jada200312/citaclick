import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const RecursosCliente = () => {
  const { id: negocioId } = useParams(); // ID del negocio desde la URL
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState([]);
  const [negocio, setNegocio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!negocioId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Traer info del negocio
        const negocioRes = await axios.get(
          `http://localhost:8000/api/negocios/${negocioId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNegocio(negocioRes.data);

        // Traer recursos del negocio (solo lectura)
        const recursosRes = await axios.get(
          `http://localhost:8000/api/negocios/recursos/cliente/?negocio_id=${negocioId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Filtrar solo recursos activos y con horario asignado
        const recursosValidos = recursosRes.data.filter(
          (recurso) => recurso.horario && recurso.activo
        );
        setRecursos(recursosValidos);
      } catch (error) {
        console.error("Error al cargar negocio o recursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [negocioId]);

  const irAVerHorarios = (recursoId) => {
  navigate(`/negocio/${negocioId}/ver_horarios/${recursoId}`);
};


  if (loading) return <p className="text-white">Cargando recursos...</p>;
  if (!recursos.length)
    return <p className="text-white">No hay recursos disponibles.</p>;

  return (
    <div className="bg-black min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Recursos de {negocio?.nombre || "este negocio"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recursos.map((recurso) => (
          <div
            key={recurso.id}
            className="bg-zinc-950 text-white rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">{recurso.nombre}</h2>
              <p className="text-sm text-gray-300 mb-2">
                {`${recurso.horario.horaInicio} - ${recurso.horario.horaFin}`}
              </p>
              <button
                onClick={() => irAVerHorarios(recurso.id)}
                className="bg-orange-600 hover:bg-orange-500 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
              >
                Ver horarios
              </button>
            </div>
            <span className="mt-4 text-sm font-medium px-2 py-1 rounded-full w-fit bg-green-600">
              Activo
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecursosCliente;
