import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { Star } from "lucide-react";

registerLocale("es", es);

const formatearHora = (hora24) => {
  const parsed = parse(hora24, "HH:mm", new Date());
  return format(parsed, "hh:mm a");
};

const BusquedaAvanzadaPeluquerias = () => {
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("");
  const [peluquerias, setPeluquerias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ Declarado antes del useEffect

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const buscarDisponibles = async () => {
    if (!fecha || !hora) {
      setError("Debes seleccionar una fecha y una hora.");
      return;
    }

    setCargando(true);
    setError("");
    setPeluquerias([]);

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/peluquerias/buscar-disponibles/?fecha=${format(
          fecha,
          "yyyy-MM-dd"
        )}&hora=${hora}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPeluquerias(response.data);
    } catch (err) {
      console.error("Error al buscar peluquerías:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Error al buscar peluquerías disponibles.");
      }
    } finally {
      setCargando(false);
    }
  };

  const irAReservar = (peluqueriaId) => {
    navigate("/reservar", {
      state: {
        fecha: format(fecha, "yyyy-MM-dd"),
        hora,
        peluqueriaId,
      },
    });
  };

  const renderStars = (peluqueriaId, rating) => {
    const totalStars = 5;

    return (
      <div className="flex justify-center items-center">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          let fillPercentage = 0;

          if (starValue <= Math.floor(rating)) {
            fillPercentage = 100;
          } else if (starValue - 1 < rating && starValue > rating) {
            fillPercentage = (rating - (starValue - 1)) * 100;
          }

          return (
            <div key={index} className="relative w-5 h-5">
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
      <h1 className="text-3xl font-bold text-white text-center mb-6">
        Búsqueda Avanzada <span className="text-orange-500">de Peluquerías</span>
      </h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <DatePicker
          selected={fecha}
          onChange={setFecha}
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          locale="es"
          className="border border-gray-300 rounded px-4 py-2 text-black"
          placeholderText="Selecciona una fecha"
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-black"
        />
        <button
          onClick={buscarDisponibles}
          className="bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {cargando && <p className="text-center text-white">Buscando...</p>}

      {!cargando && peluquerias.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {peluquerias.map((peluqueria) => (
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
                  onClick={() => irAReservar(peluqueria.id)}
                  className="mt-4 bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded"
                >
                  Reservar
                </button>
                <hr className="border-t-2 border-orange-500 my-4" />

                <div className="flex flex-col items-center space-y-1">
                  {renderStars(peluqueria.id, peluqueria.promedio_calificaciones)}
                  <p className="text-yellow-400 font-bold">
                    {peluqueria.promedio_calificaciones?.toFixed(1)} / 5
                  </p>
                  <p className="text-sm text-gray-400">
                    ({peluqueria.total_calificaciones} reseñas)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && peluquerias.length === 0 && fecha && hora && (
        <p className="text-center text-orange-400 mt-6">
          No hay peluquerías disponibles en la fecha y hora seleccionadas.
        </p>
      )}
    </div>
  );
};

export default BusquedaAvanzadaPeluquerias;
