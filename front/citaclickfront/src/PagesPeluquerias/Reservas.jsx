import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, addDays, isBefore, parse } from "date-fns";
import { useParams } from "react-router-dom"; 

const formatearHora = (hora24) => {
  const parsed = parse(hora24, "HH:mm", new Date());
  return format(parsed, "hh:mm a");
};

const Reservas = () => {
  const { id } = useParams();              
  const peluqueriaId = id;                 

  const [diaActivo, setDiaActivo] = useState(0); // 0 = hoy, 1 = mañana, 2 = pasado
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const fechas = [0, 1, 2].map((offset) => addDays(new Date(), offset));
  const fechaSeleccionada = fechas[diaActivo];

  useEffect(() => {
    const fetchHorarios = async () => {
      setCargando(true);
      setHorarios([]);
      setError("");

      try {
        const response = await axios.get(
          `http://localhost:8000/api/peluquerias/horarios-disponibles/?fecha=${format(
            fechaSeleccionada,
            "yyyy-MM-dd"
          )}&peluqueria_id=${peluqueriaId}`
        );

        setHorarios(
          Array.isArray(response.data.horarios_disponibles)
            ? response.data.horarios_disponibles
            : []
        );
      } catch (err) {
        setError("No se pudieron cargar los horarios.");
      } finally {
        setCargando(false);
      }
    };

    if (peluqueriaId) fetchHorarios();
  }, [diaActivo, peluqueriaId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black text-white min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-6">
        Horarios <span className="text-orange-500">Disponibles</span>
      </h2>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {fechas.map((fecha, index) => (
          <button
            key={index}
            onClick={() => setDiaActivo(index)}
            className={`px-4 py-2 rounded font-semibold ${
              diaActivo === index
                ? "bg-orange-500 text-white"
                : "bg-white text-black hover:bg-orange-100"
            }`}
          >
            {format(fecha, "dd/MM/yyyy")}
          </button>
        ))}
      </div>

      <h3 className="text-lg text-center font-semibold mb-4">
        Horarios para el{" "}
        <span className="text-orange-500">
          {format(fechaSeleccionada, "dd/MM/yyyy")}
        </span>
      </h3>

      {cargando && (
        <p className="text-center text-zinc-400">Cargando horarios...</p>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && horarios.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-950 px-4 py-6 my-6 mx-4 rounded-lg">
          {horarios.map((hora) => {
            const ahora = new Date();
            const horaCompleta = parse(
              hora.hora,
              "HH:mm",
              fechaSeleccionada
            );

            const esHoy =
              format(fechaSeleccionada, "yyyy-MM-dd") ===
              format(ahora, "yyyy-MM-dd");
            const esPasada = esHoy && isBefore(horaCompleta, ahora);

            const estaDisponible = hora.disponible && !esPasada;

            return (
              <div
                key={hora.hora}
                className={`rounded-xl p-4 text-center text-sm font-semibold shadow flex flex-col items-center transition duration-300 ${
                  estaDisponible
                    ? "bg-white text-zinc-950 border border-zinc-800"
                    : "bg-gray-300 text-orange-600 border border-gray-700 cursor-not-allowed"
                }`}
              >
                <span className="text-xl">🕒</span>
                {formatearHora(hora.hora)}
              </div>
            );
          })}
        </div>
      )}

      {!cargando && horarios.length === 0 && !error && (
        <p className="text-center text-zinc-400">No hay horarios disponibles.</p>
      )}
    </div>
  );
};

export default Reservas;
