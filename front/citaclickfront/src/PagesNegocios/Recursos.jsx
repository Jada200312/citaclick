import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Recursos = () => {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecurso, setSelectedRecurso] = useState(null);
  const [formData, setFormData] = useState({
    horaInicio: "",
    horaFin: "",
    intervalo_tiempo: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/negocios/recursos/",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setRecursos(response.data);
      } catch (error) {
        console.error("Error al cargar recursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecursos();
  }, []);

  const openModal = (recurso) => {
    setSelectedRecurso(recurso);
    setFormData({
      horaInicio: recurso.horario ? recurso.horario.horaInicio : "",
      horaFin: recurso.horario ? recurso.horario.horaFin : "",
      intervalo_tiempo: recurso.horario ? recurso.horario.intervalo_tiempo : "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecurso(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRecurso) return;

    try {
      const token = localStorage.getItem("access_token");
      let horarioId = null;

      if (selectedRecurso.horario) {
        horarioId = selectedRecurso.horario.id;

        await axios.put(
          `http://localhost:8000/api/negocios/horarios-recurso/${horarioId}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        await axios.patch(
          `http://localhost:8000/api/negocios/recursos/${selectedRecurso.id}/`,
          { horario_id: horarioId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/negocios/horarios-recurso/",
          { ...formData, recurso: selectedRecurso.id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        horarioId = response.data.id;

        await axios.patch(
          `http://localhost:8000/api/negocios/recursos/${selectedRecurso.id}/`,
          { horario_id: horarioId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      const response = await axios.get(
        "http://localhost:8000/api/negocios/recursos/",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRecursos(response.data);
      closeModal();
    } catch (error) {
      console.error("Error al guardar horario:", error);
    }
  };

  if (loading) return <p className="text-white">Cargando recursos...</p>;
  if (recursos.length === 0)
    return <p className="text-white">No hay recursos disponibles.</p>;

  return (
    <div className="bg-black min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Recursos de tu negocio
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recursos.map((recurso) => (
          <div
            key={recurso.id}
            className="bg-zinc-950 text-white rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">{recurso.nombre}</h2>

              <p className="text-sm text-gray-300 mb-3">
                {recurso.horario
                  ? `${recurso.horario.horaInicio} - ${recurso.horario.horaFin}`
                  : "No has asignado horario aún"}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(recurso)}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
                >
                  {recurso.horario ? "Editar horario" : "Asignar horario"}
                </button>

                {/* 👉 Nuevo botón bloquear horarios */}
                <button
                  onClick={() =>
                    navigate("/bloquear-horarios", {
                      state: {
                        negocioId: recurso.negocio,
                        recursoId: recurso.id,
                      },
                    })
                  }
                  className="bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1 rounded transition-colors duration-200"
                >
                  Bloquear horarios
                </button>
              </div>
            </div>

            <span
              className={`mt-4 text-sm font-medium px-2 py-1 rounded-full w-fit ${
                recurso.activo ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {recurso.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-950 p-6 rounded-lg w-80 relative">
            <h2 className="text-xl font-bold mb-4 text-white">
              {selectedRecurso?.horario ? "Editar Horario" : "Asignar Horario"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-white text-sm">Hora Inicio</label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm">Hora Fin</label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm">
                  Intervalo de tiempo (minutos)
                </label>
                <input
                  type="number"
                  name="intervalo_tiempo"
                  value={formData.intervalo_tiempo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 transition-colors text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-orange-600 rounded hover:bg-orange-500 transition-colors text-white"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recursos;
