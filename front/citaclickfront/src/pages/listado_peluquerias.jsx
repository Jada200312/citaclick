import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";

const ListadoPeluquerias = () => {
  const [peluquerias, setPeluquerias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedRatings, setSelectedRatings] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentPeluqueria, setCurrentPeluqueria] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comentario, setComentario] = useState("");

  const navigate = useNavigate();

  const fetchPeluquerias = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/peluquerias/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPeluquerias(res.data))
      .catch((err) => {
        console.error("Error cargando peluquerías:", err);
        if (err.response?.status === 401) navigate("/login");
      });
  };

  useEffect(() => {
    fetchPeluquerias();
  }, []);

  const peluqueriasFiltradas = peluquerias.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const irABusquedaAvanzada = () => navigate("/busqueda-avanzada");
  const verHorarios = (id) => navigate(`/peluqueria/${id}`);

  const handleStarClick = (peluqueriaId, rating) => {
    setCurrentPeluqueria(peluqueriaId);
    setRatingValue(rating);
    setShowModal(true);
  };

  const enviarCalificacion = () => {
    const token = localStorage.getItem("access_token");

    axios
      .post(
        `http://localhost:8000/api/peluquerias/${currentPeluqueria}/calificar/`,
        { calificacion: ratingValue, comentario },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setSelectedRatings((prev) => ({
          ...prev,
          [currentPeluqueria]: ratingValue,
        }));
        setShowModal(false);
        setComentario("");
        fetchPeluquerias();
      })
      .catch((err) => {
        console.error("Error al enviar calificación:", err);
        if (err.response?.data?.error?.includes("mes")) {
          alert("Solo puedes calificar una vez al mes esta peluquería.");
        } else {
          alert("Hubo un error al enviar tu calificación.");
        }
      });
  };

  const renderStars = (peluqueriaId, rating) => {
    const totalStars = 5;
    const currentRating = selectedRatings[peluqueriaId] ?? Math.floor(rating);
    return (
      <div className="flex justify-center items-center">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <Star
              key={index}
              onClick={() => handleStarClick(peluqueriaId, starValue)}
              className={`w-5 h-5 cursor-pointer ${
                starValue <= currentRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-400"
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white text-center">
        Peluquerías <span className="text-orange-500">Disponibles</span>
      </h1>
      <h1 className="text-3xl font-bold mb-4">Reservar una cita</h1>

      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-5xl mx-auto"
        />
        <button
          onClick={irABusquedaAvanzada}
          className="ml-4 bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded"
        >
          Búsqueda Avanzada
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {peluqueriasFiltradas.map((peluqueria) => (
          <div
            key={peluqueria.id}
            className="bg-zinc-900 text-white rounded-xl border border-gray-300 p-6 w-full max-w-xs mx-auto text-center space-y-4 shadow-md"
          >
            <h2 className="text-xl font-semibold">{peluqueria.nombre}</h2>
            <hr className="border-t-2 border-orange-500 my-4" />

            <div className="flex items-center justify-center text-white space-x-1">
              <p>{peluqueria.direccion}</p>
              <span>/</span>
              <p>{peluqueria.ciudad}</p>
            </div>

            {peluqueria.imagen ? (
              <img
                src={peluqueria.imagen}
                alt={peluqueria.nombre}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-white flex items-center justify-center text-black">
                Sin imagen
              </div>
            )}

            <div className="p-4">
              <button
                onClick={() => verHorarios(peluqueria.id)}
                className="mt-4 bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded"
              >
                Ver Horarios
              </button>
              <hr className="border-t-2 border-orange-500 my-4" />

              {/* Calificación movida debajo del segundo HR */}
              <div className="flex flex-col items-center space-y-1">
                {renderStars(
                  peluqueria.id,
                  peluqueria.promedio_calificaciones
                )}
                <p className="text-yellow-400 font-bold">
                  {peluqueria.promedio_calificaciones} / 5
                </p>
                <p className="text-sm text-gray-400">
                  ({peluqueria.total_calificaciones} reseñas)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Escribe tu reseña
            </h2>
            <p className="mb-2 text-center">
              Tu calificación:{" "}
              <span className="font-bold text-yellow-500">
                {ratingValue} / 5
              </span>
            </p>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows="4"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={enviarCalificacion}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListadoPeluquerias;
