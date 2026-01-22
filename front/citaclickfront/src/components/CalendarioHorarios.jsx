import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isBefore, startOfToday, parse, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import axios from "axios";

registerLocale("es", es);

// Formatear hora 24h → 12h
const formatearHora = (hora24) => {
  const parsed = parse(hora24, "HH:mm", new Date());
  return format(parsed, "hh:mm a");
};

const CalendarioHorarios = ({ negocioId, recursoId }) => {
  const [fecha, setFecha] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [diasBloqueados, setDiasBloqueados] = useState([]);
  const [bloquesBloqueados, setBloquesBloqueados] = useState([]);
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================
  // Rol del usuario
  // =========================
  const rolId = localStorage.getItem("rol");
  const esPropietario = rolId === "propietario"; // ajusta según tu valor real

  // =========================
  // Cargar días bloqueados
  // =========================
  useEffect(() => {
    if (!negocioId) return;

    const fetchDiasBloqueados = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");

      try {
        const response = await axios.get(
          `http://localhost:8000/api/negocios/dias-no-disponibles/?negocio=${negocioId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const fechas = response.data.map(
          (d) => new Date(d.fecha + "T00:00:00"),
        );
        setDiasBloqueados(fechas);
      } catch {
        console.log("No se pudieron cargar días bloqueados");
      }
    };

    fetchDiasBloqueados();
  }, [negocioId, navigate]);

  // =========================
  // Cambio de fecha
  // =========================
  const manejarCambioFecha = (fechaSeleccionada) => {
    setFecha(fechaSeleccionada);
    setBloquesSeleccionados([]); // Limpiar selección al cambiar de día
  };

  // =========================
  // Cargar horarios + bloques bloqueados
  // =========================
  useEffect(() => {
    if (!fecha || !recursoId) return;

    const fetchHorarios = async () => {
      setCargando(true);
      setHorarios([]);
      setError("");

      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");

      const fechaStr = format(fecha, "yyyy-MM-dd");

      // 🔒 Validar día bloqueado
      const estaBloqueada = diasBloqueados.some(
        (d) => format(d, "yyyy-MM-dd") === fechaStr,
      );

      if (estaBloqueada) {
        setError("Este día no está disponible.");
        setCargando(false);
        return;
      }

      try {
        // Horarios generados por backend
        const response = await axios.get(
          `http://localhost:8000/api/negocios/recursos/horarios-disponibles/?fecha=${fechaStr}&recurso_id=${recursoId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // Bloques bloqueados manualmente
        const bloquesResponse = await axios.get(
          `http://localhost:8000/api/negocios/bloques-no-disponibles/?negocio=${negocioId}&fecha=${fechaStr}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setBloquesBloqueados(bloquesResponse.data || []);

        if (response.data.horarios_disponibles) {
          setHorarios(response.data.horarios_disponibles);
        } else {
          setHorarios([]);
          setError(response.data.error || "No hay horarios disponibles.");
        }
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
  }, [fecha, recursoId, diasBloqueados, negocioId, navigate]);

  // =========================
  // Validar si bloque está bloqueado
  // =========================
  const bloqueEstaBloqueado = (hora) => {
    return bloquesBloqueados.some((b) => b.hora_inicio === hora);
  };

  // =========================
  // Click en hora
  // =========================
  const manejarClick = (hora) => {
    if (esPropietario) {
      // Seleccionar/desseleccionar bloque
      if (bloquesSeleccionados.includes(hora)) {
        setBloquesSeleccionados(bloquesSeleccionados.filter((h) => h !== hora));
      } else if (!bloqueEstaBloqueado(hora)) {
        setBloquesSeleccionados([...bloquesSeleccionados, hora]);
      }
    } else {
      // Redirigir al flujo de reserva normal para clientes
      navigate("/reservar", {
        state: {
          fecha: format(fecha, "yyyy-MM-dd"),
          hora,
          negocioId,
          recursoId,
        },
      });
    }
  };

  // =========================
  // Guardar bloques bloqueados
  // =========================
  const guardarBloques = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    try {
      await axios.post(
        `http://localhost:8000/api/negocios/bloques-no-disponibles/`,
        {
          negocio: negocioId,
          fecha: format(fecha, "yyyy-MM-dd"),
          bloques: bloquesSeleccionados,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setBloquesBloqueados([
        ...bloquesBloqueados,
        ...bloquesSeleccionados.map((h) => ({ hora_inicio: h })),
      ]);
      setBloquesSeleccionados([]);
    } catch (err) {
      console.error("No se pudieron bloquear los horarios", err);
    }
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="max-w-2xl mx-auto p-6 bg-zinc-950 shadow-xl rounded-xl mt-6">
      {/* Calendario */}
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={fecha}
          onChange={manejarCambioFecha}
          minDate={startOfToday()}
          maxDate={addMonths(startOfToday(), 1)}
          excludeDates={diasBloqueados}
          dateFormat="dd/MM/yyyy"
          locale="es"
          className="border border-zinc-950 rounded px-4 py-2 text-center w-full sm:w-auto placeholder:text-zinc-950"
          placeholderText="Haz clic para seleccionar"
        />
      </div>

      {fecha && (
        <h3 className="text-lg font-semibold text-center mb-4 text-white">
          Horarios disponibles para el{" "}
          <span className="text-orange-600">{format(fecha, "dd/MM/yyyy")}</span>
        </h3>
      )}

      {cargando && (
        <p className="text-center text-zinc-400">Cargando horarios...</p>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && horarios.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-950 max-w-2xl px-4 py-6 my-6 mx-4">
          {horarios.map((hora) => {
            const ahora = new Date();
            const fechaSeleccionada = new Date(fecha);
            const horaCompleta = parse(hora.hora, "HH:mm", fechaSeleccionada);

            const esHoy =
              format(fechaSeleccionada, "yyyy-MM-dd") ===
              format(ahora, "yyyy-MM-dd");

            const esPasada = esHoy && isBefore(horaCompleta, ahora);
            const bloqueManual = bloqueEstaBloqueado(hora.hora);
            const estaSeleccionado = bloquesSeleccionados.includes(hora.hora);
            const estaDisponible =
              hora.disponible && !esPasada && !bloqueManual;

            return (
              <div
                key={hora.hora}
                onClick={() => manejarClick(hora.hora)}
                className={`rounded-xl p-4 text-center text-sm font-semibold shadow flex flex-col items-center transition duration-300 ${
                  bloqueManual
                    ? "bg-gray-400 text-orange-600 border border-gray-800 cursor-not-allowed"
                    : estaSeleccionado
                      ? "bg-red-500 text-white cursor-pointer"
                      : estaDisponible
                        ? "bg-white border border-zinc-950 text-zinc-950 hover:bg-green-50 cursor-pointer"
                        : "bg-gray-200 text-orange-600 border border-gray-800 cursor-not-allowed"
                }`}
              >
                <span className="text-xl">{bloqueManual ? "🔒" : "🕒"}</span>
                {formatearHora(hora.hora)}
              </div>
            );
          })}
        </div>
      )}

      {/* Botón guardar bloques (solo propietarios) */}
      {esPropietario && bloquesSeleccionados.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={guardarBloques}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Bloquear horarios seleccionados
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarioHorarios;
