import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Reservar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fecha, hora, peluqueriaId } = location.state || {};

  const [servicioId, setServicioId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // Obtener ID del usuario desde el token JWT
  const obtenerUsuarioDesdeToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.user || payload.id; // Ajusta según el backend
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const usuarioId = obtenerUsuarioDesdeToken();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !usuarioId) {
      navigate("/login");
    }
  }, [navigate, usuarioId]);

  const manejarReserva = async () => {
    if (!servicioId) {
      setMensaje("Por favor selecciona un servicio.");
      return;
    }

    if (!usuarioId) {
      setMensaje("Usuario no autenticado.");
      return;
    }

    setCargando(true);
    setMensaje("");

    const token = localStorage.getItem("access_token");

    // Aseguramos que sean enteros
    const datosReserva = {
      fechaReserva: fecha,
      horaReserva: hora,
      peluqueria_id: parseInt(peluqueriaId, 10),
      servicio_id: parseInt(servicioId, 10),
      usuario: parseInt(usuarioId, 10),
    };

    console.log("📤 Enviando datos a la API:", datosReserva);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/reservas/",
        datosReserva,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Respuesta del servidor:", response.data);

      setMensaje("✅ Reserva realizada con éxito");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("❌ Error en la reserva:", error.response?.data || error);
      const mensajeError =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "❌ Error al reservar.";
      setMensaje(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-2">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-xl font-bold">
          Confirmar <span className="text-orange-500">Reserva</span>
        </h1>
        <br />
        <p className="mb-2 text-black">📅 Fecha: {fecha}</p>
        <p className="mb-2 text-black">🕒 Hora: {hora}</p>
        <p className="mb-2 text-black">💈 Peluquería ID: {peluqueriaId}</p>

        <div className="mt-4">
          <label className="">Selecciona un servicio:</label>
          <select
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            className="text-black p-2 rounded w-full block mb-2 border"
          >
            <option value="">Selecciona</option>
            <option value={1}>Corte de Cabello</option>
            <option value={2}>Corte de Barba</option>
          </select>
        </div>

        <button
          onClick={manejarReserva}
          disabled={cargando}
          className="mt-6 bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded"
        >
          {cargando ? "Reservando..." : "Confirmar Reserva"}
        </button>

        {mensaje && <p className="mt-4">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Reservar;
