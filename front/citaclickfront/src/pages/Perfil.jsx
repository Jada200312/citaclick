import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const obtenerUsuarioDesdeToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || payload.user || payload.id; // Ajusta según cómo venga
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [filtros, setFiltros] = useState({ anios: [], meses_por_anio: {} });
  const [anioSeleccionado, setAnioSeleccionado] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const id = obtenerUsuarioDesdeToken();

  // Cargar usuario
  useEffect(() => {
    if (!token || !id) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8000/api/usuarios/usuario/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsuario(res.data))
      .catch((err) => {
        console.error("Error al obtener el usuario:", err);
        if (err.response?.status === 401) navigate("/login");
      });
  }, [navigate, token, id]);

  // Cargar filtros (años y meses)
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8000/api/reservas/filtros/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFiltros(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Función memoizada para cargar historial
  const cargarHistorial = useCallback(() => {
    if (!anioSeleccionado) {
      setHistorial([]);
      return;
    }
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/reservas/?anio=${anioSeleccionado}&mes=${mesSeleccionado}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setHistorial(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [anioSeleccionado, mesSeleccionado, token]);

  // Recargar historial cuando cambien filtros
  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  if (!usuario) {
    return <div className="text-white p-4">Cargando perfil...</div>;
  }

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 max-w-6xl mx-auto">
      {/* PERFIL */}
      <div className="bg-zinc-900 p-6 rounded-lg w-full md:w-1/2">
        <h2 className="text-2xl font-semibold">
          Perfil de: <span className="text-orange-500">{usuario.username}</span>
        </h2>
        <div className="flex flex-col items-center mt-4">
          <img
            src={usuario.imagen || ""}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
          <ul className="mt-6 text-sm space-y-2">
            <li>
              <span className="text-orange-500">• Nombre:</span> {usuario.username}
            </li>
            <li>
              <span className="text-orange-500">• Apellidos:</span> {usuario.first_name}
            </li>
            <li>
              <span className="text-orange-500">• Celular:</span> {usuario.celular}
            </li>
            <li>
              <span className="text-orange-500">• Correo:</span> {usuario.email}
            </li>
          </ul>
          <button className="mt-6 border border-white text-white px-4 py-2 hover:bg-orange-500 transition">
            EDITAR PERFIL
          </button>
        </div>
      </div>

      {/* HISTORIAL DE RESERVAS */}
      <div className="bg-zinc-900 p-6 rounded-lg w-full md:w-1/2">
        <h2 className="text-3xl font-bold text-orange-500 mb-6">Historial de Reservas</h2>

        {/* Select Año */}
        <div className="mb-4">
          <label className="block mb-1">Filtrar por año:</label>
          <select
            className="w-full px-3 py-2 rounded bg-gray-300 text-black"
            value={anioSeleccionado}
            onChange={(e) => {
              setAnioSeleccionado(e.target.value);
              setMesSeleccionado("");
              setHistorial([]);
            }}
          >
            <option value="">Seleccione un año</option>
            {filtros.anios.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>

        {/* Select Mes */}
        <div className="mb-6">
          <label className="block mb-1">Filtrar por mes:</label>
          <select
            className="w-full px-3 py-2 rounded bg-gray-300 text-black"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            disabled={!anioSeleccionado}
          >
            <option value="">Seleccione un mes</option>
            {anioSeleccionado &&
              filtros.meses_por_anio[anioSeleccionado]?.map((mes) => (
                <option key={mes} value={mes}>
                  {new Date(0, mes - 1).toLocaleString("es", { month: "long" })}
                </option>
              ))}
          </select>
        </div>

        {/* Tabla historial */}
        {loading ? (
          <p className="text-gray-400">Cargando reservas...</p>
        ) : historial.length > 0 ? (
          <table className="w-full border-collapse border border-gray-600 text-black bg-white rounded">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="p-2 border border-gray-600">Fecha</th>
                <th className="p-2 border border-gray-600">Hora</th>
                <th className="p-2 border border-gray-600">Peluquería</th>
                <th className="p-2 border border-gray-600">Servicio</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((reserva) => (
                <tr key={reserva.id} className="hover:bg-gray-200">
                  <td className="p-2 border border-gray-600">{reserva.fechaReserva}</td>
                  <td className="p-2 border border-gray-600">{reserva.horaReserva}</td>
                  <td className="p-2 border border-gray-600">
                  {reserva.peluqueria.nombre}
                  </td>
                  <td className="p-2 border border-gray-600">
                  {reserva.servicio.nombre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : anioSeleccionado ? (
          <p className="text-gray-400">No hay reservas para este filtro.</p>
        ) : (
          <p className="text-gray-400">Seleccione un año para ver el historial.</p>
        )}
      </div>
    </div>
  );
};

export default Perfil;
