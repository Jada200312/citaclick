import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RecursosCliente = () => {
  const { id: negocioId } = useParams(); // ID del negocio desde la URL
  const [recursos, setRecursos] = useState([]);
  const [negocio, setNegocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecurso, setSelectedRecurso] = useState(null);

  useEffect(() => {
    if (!negocioId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Traer info del negocio
        const negocioRes = await axios.get(
          `http://localhost:8000/api/negocios/${negocioId}/`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setNegocio(negocioRes.data);

        // Traer recursos del negocio (solo lectura)
        const recursosRes = await axios.get(
          `http://localhost:8000/api/negocios/recursos/cliente/?negocio_id=${negocioId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setRecursos(recursosRes.data);
      } catch (error) {
        console.error("Error al cargar negocio o recursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [negocioId]);

  const openModal = (recurso) => {
    setSelectedRecurso(recurso);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecurso(null);
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
        {recursos
          .filter((recurso) => recurso.horario && recurso.activo) // Solo recursos válidos
          .map((recurso) => (
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
                  onClick={() => openModal(recurso)}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
                >
                  Ver horario
                </button>
              </div>
              <span className="mt-4 text-sm font-medium px-2 py-1 rounded-full w-fit bg-green-600">
                Activo
              </span>
            </div>
          ))}
      </div>

      {/* Modal solo lectura */}
      {modalOpen && selectedRecurso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-950 p-6 rounded-lg w-80 relative">
            <h2 className="text-xl font-bold mb-4 text-white">
              Horario de {selectedRecurso.nombre}
            </h2>
            <p className="text-white mb-2">
              {`${selectedRecurso.horario.horaInicio} - ${selectedRecurso.horario.horaFin} (Intervalo: ${selectedRecurso.horario.intervalo_tiempo} min)`}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 w-full px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 transition-colors text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecursosCliente;
