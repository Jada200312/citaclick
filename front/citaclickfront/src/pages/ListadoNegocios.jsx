import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";

const ListadoNegocios = () => {
  const [negocios, setNegocios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selectedRatings, setSelectedRatings] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentNegocio, setCurrentNegocio] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comentario, setComentario] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tipoSeleccionado = query.get("tipo");

  const fetchNegocios = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/negocios/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNegocios(res.data))
      .catch((err) => {
        if (err.response?.status === 401) navigate("/login");
      });
  };

  useEffect(() => {
    fetchNegocios();
  }, []);

  const negociosFiltrados = negocios
    .filter((n) => n.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .filter((n) => {
      if (!tipoSeleccionado) return true;
      const tipoId = typeof n.tipo === "object" ? n.tipo.id : n.tipo;
      return tipoId === parseInt(tipoSeleccionado);
    });

  const irABusquedaAvanzada = () => navigate("/busqueda-avanzada");
  const verRecursos = (id) => navigate(`/negocio/${id}/recursos`);

  const handleStarClick = (negocioId, rating) => {
    setCurrentNegocio(negocioId);
    setRatingValue(rating);
    setShowModal(true);
  };

  const enviarCalificacion = () => {
    const token = localStorage.getItem("access_token");

    axios
      .post(
        `http://localhost:8000/api/negocios/${currentNegocio}/calificar/`,
        { calificacion: ratingValue, comentario },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setSelectedRatings((prev) => ({
          ...prev,
          [currentNegocio]: ratingValue,
        }));
        setShowModal(false);
        setComentario("");
        fetchNegocios();
      })
      .catch((err) => {
        if (err.response?.data?.error?.includes("mes")) {
          alert("Solo puedes calificar una vez al mes este negocio.");
        } else {
          alert("Hubo un error al enviar tu calificación.");
        }
      });
  };

  const renderStars = (negocioId, rating) => {
    const totalStars = 5;
    const currentRating = selectedRatings[negocioId] ?? rating;

    return (
      <div className="flex justify-center items-center">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          let fillPercentage = 0;

          if (starValue <= Math.floor(currentRating)) fillPercentage = 100;
          else if (starValue - 1 < currentRating && starValue > currentRating)
            fillPercentage = (currentRating - (starValue - 1)) * 100;

          return (
            <div
              key={index}
              className="relative w-5 h-5"
              onClick={() => handleStarClick(negocioId, starValue)}
            >
              <Star className="w-5 h-5 text-gray-400 absolute top-0 left-0" />
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white text-center">
        Negocios <span className="text-orange-500">Disponibles</span>
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
        {negociosFiltrados.map((negocio) => (
          <div
            key={negocio.id}
            className="bg-zinc-900 text-white rounded-xl border border-gray-300 p-6 w-full max-w-xs mx-auto text-center space-y-4 shadow-md"
          >
            <h2 className="text-xl font-semibold">{negocio.nombre}</h2>
            <hr className="border-t-2 border-orange-500 my-4" />

            <div className="flex items-center justify-center text-white space-x-1">
              <p>{negocio.direccion}</p>
              <span>/</span>
              <p>{negocio.ciudad}</p>
            </div>

            {negocio.imagen ? (
              <img
                src={negocio.imagen}
                alt={negocio.nombre}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-white flex items-center justify-center text-black">
                Sin imagen
              </div>
            )}

            <div className="p-4">
              <button
                onClick={() => verRecursos(negocio.id)}
                className="mt-4 bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded"
              >
                Ver Recursos
              </button>
              <hr className="border-t-2 border-orange-500 my-4" />

              <div className="flex flex-col items-center space-y-1">
                {renderStars(negocio.id, negocio.promedio_calificaciones)}
                <p className="text-yellow-400 font-bold">
                  {negocio.promedio_calificaciones?.toFixed(1)} / 5
                </p>
                <p className="text-sm text-gray-400">
                  ({negocio.total_calificaciones} reseñas)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default ListadoNegocios;
