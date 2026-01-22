import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formatearHora = (hora24) => {
  const parsed = parse(hora24, "HH:mm:ss", new Date());
  return format(parsed, "hh:mm a");
};

const CalendarioReservas = ({ negocioId }) => {
  const [fecha, setFecha] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [diaBloqueado, setDiaBloqueado] = useState(null);

  const navigate = useNavigate();

  // =============================
  // Cargar reservas al cambiar fecha
  // =============================
  useEffect(() => {
    if (!fecha || !negocioId) return;

    const fetchData = async () => {
      setCargando(true);
      setError("");
      setReservas([]);

      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const fechaStr = format(fecha, "yyyy-MM-dd");

      try {
        // 1. Obtener reservas
        const reservasResponse = await axios.get(
          `http://localhost:8000/api/reservas/por-fecha/?negocio=${negocioId}&fechaReserva=${fechaStr}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setReservas(reservasResponse.data || []);

        // 2. Obtener días bloqueados
        const diasResponse = await axios.get(
          `http://localhost:8000/api/negocios/dias-no-disponibles/?negocio=${negocioId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const encontrado = diasResponse.data.find((d) => d.fecha === fechaStr);

        setDiaBloqueado(encontrado || null);
      } catch (err) {
        setError("No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [fecha, negocioId, navigate]);

  // =============================
  // Bloquear día
  // =============================
  const bloquearDia = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/negocios/dias-no-disponibles/",
        {
          negocio: negocioId,
          fecha: format(fecha, "yyyy-MM-dd"),
          motivo: "Bloqueado manualmente",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // 👇 Guardar el objeto completo que devuelve el backend, con id
      setDiaBloqueado(response.data);
    } catch {
      alert("No se pudo bloquear el día");
    }
  };

  // =============================
  // Desbloquear día
  // =============================
  const desbloquearDia = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    try {
      await axios.delete(
        `http://localhost:8000/api/negocios/dias-no-disponibles/${diaBloqueado.id}/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setDiaBloqueado(null);
    } catch {
      alert("No se pudo habilitar el día");
    }
  };

  // =============================
  // Agrupar reservas por recurso
  // =============================
  const reservasPorRecurso = reservas.reduce((acc, reserva) => {
    const recursoNombre = reserva.recurso.nombre;
    if (!acc[recursoNombre]) acc[recursoNombre] = [];
    acc[recursoNombre].push(reserva.horaReserva);
    return acc;
  }, {});

  // =============================
  // Validar fecha futura
  // =============================
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaEsFutura = fecha && fecha > hoy;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-zinc-950 rounded-xl shadow mt-6">
      {/* Selector de fecha */}
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={fecha}
          onChange={(date) => setFecha(date)}
          dateFormat="dd/MM/yyyy"
          locale={es}
          className="border rounded px-4 py-2 text-center text-black"
          placeholderText="Selecciona una fecha"
        />
      </div>

      {fecha && (
        <h3 className="text-center text-lg mb-2 text-white">
          Reservas para el{" "}
          <span className="text-orange-500">{format(fecha, "dd/MM/yyyy")}</span>
        </h3>
      )}

      {/* Botón bloquear / desbloquear */}
      {fechaEsFutura && (
        <div className="text-center mb-4">
          {!diaBloqueado ? (
            <button
              onClick={bloquearDia}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded font-semibold"
            >
              🔒 Bloquear día
            </button>
          ) : (
            <button
              onClick={desbloquearDia}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded font-semibold"
            >
              🔓 Habilitar día
            </button>
          )}
        </div>
      )}

      {cargando && <p className="text-center text-zinc-400">Cargando...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!cargando && fecha && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Object.keys(reservasPorRecurso).length > 0 ? (
            Object.entries(reservasPorRecurso).map(([recurso, horas]) => (
              <div
                key={recurso}
                className="bg-black border border-zinc-800 rounded-xl p-5 shadow"
              >
                <h4 className="text-lg font-semibold mb-3 text-orange-500">
                  🪑 {recurso}
                </h4>

                {horas.sort().map((hora, index) => (
                  <div
                    key={index}
                    className="bg-white text-zinc-900 rounded px-3 py-2 text-sm font-semibold mb-2 text-center"
                  >
                    🕒 {formatearHora(hora)}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-400 col-span-full">
              No hay reservas para este día.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarioReservas;
