import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isBefore, startOfToday, parse } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import axios from "axios";

registerLocale("es", es);

const formatearHora = (hora24) => {
  const parsed = parse(hora24, "HH:mm", new Date());
  return format(parsed, "hh:mm a");
};

const CalendarioHorarios = ({ peluqueriaId }) => {
  const [fecha, setFecha] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const manejarCambioFecha = (fechaSeleccionada) => {
    setFecha(fechaSeleccionada);
  };

  useEffect(() => {
    if (!fecha) return;

    const fetchHorarios = async () => {
      setCargando(true);
      setHorarios([]);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/peluquerias/horarios-disponibles/?fecha=${format(
            fecha,
            "yyyy-MM-dd"
          )}&peluqueria_id=${peluqueriaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHorarios(
          Array.isArray(response.data.horarios_disponibles)
            ? response.data.horarios_disponibles
            : []
        );
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login");
        } else {
          setError("No se pudieron cargar los horarios.");
        }
      } finally {
        setCargando(false);
      }
    };

    fetchHorarios();
  }, [fecha, peluqueriaId, navigate]);

  const manejarClick = (horaSeleccionada) => {
    navigate("/reservar", {
      state: {
        fecha: format(fecha, "yyyy-MM-dd"),
        hora: horaSeleccionada,
        peluqueriaId,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Selecciona una fecha
      </h2>

      <div className="flex justify-center mb-6">
        <DatePicker
          selected={fecha}
          onChange={manejarCambioFecha}
          minDate={startOfToday()}
          dateFormat="dd/MM/yyyy"
          locale="es"
          className="border border-gray-300 rounded px-4 py-2 text-center w-full sm:w-auto"
          placeholderText="Haz clic para seleccionar"
        />
      </div>

      {fecha && (
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">
          Horarios disponibles para el {format(fecha, "dd/MM/yyyy")}
        </h3>
      )}

      {cargando && (
        <p className="text-center text-gray-500">Cargando horarios...</p>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && horarios.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {horarios.map((hora) => {
            const ahora = new Date();
            const fechaSeleccionada = new Date(fecha);
            const horaCompleta = parse(hora.hora, "HH:mm", fechaSeleccionada);

            const esHoy =
              format(fechaSeleccionada, "yyyy-MM-dd") ===
              format(ahora, "yyyy-MM-dd");
            const esPasada = esHoy && isBefore(horaCompleta, ahora);

            const estaDisponible = hora.disponible && !esPasada;

            return (
              <div
                key={hora.hora}
                onClick={() =>
                  estaDisponible ? manejarClick(hora.hora) : null
                }
                className={`rounded-xl p-4 text-center text-sm font-semibold shadow flex flex-col items-center transition duration-300 ${
                  estaDisponible
                    ? "bg-white border border-green-500 text-green-700 hover:bg-green-50 cursor-pointer"
                    : "bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed"
                }`}
              >
                <span className="text-xl">🕒</span>
                {formatearHora(hora.hora)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarioHorarios;
