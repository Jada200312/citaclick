import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Reservar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fecha, hora, negocioId, recursoId } = location.state || {};

  const [servicioId, setServicioId] = useState("");
  const [cargando, setCargando] = useState(false);
  const [servicios, setServicios] = useState([]);

  // Obtener usuario desde token
  const obtenerUsuarioDesdeToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id || payload.user || payload.id;
    } catch {
      return null;
    }
  };

  const usuarioId = obtenerUsuarioDesdeToken();

  // Validar sesión
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !usuarioId) navigate("/login");
  }, [navigate, usuarioId]);

  // Obtener servicios del negocio
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/servicios/?peluqueria_id=${negocioId}`,
        );
        setServicios(response.data);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      }
    };

    if (negocioId) fetchServicios();
  }, [negocioId]);

  // Enviar reserva
  const manejarReserva = async () => {
    if (!usuarioId) {
      alert("Usuario no autenticado.");
      return;
    }

    setCargando(true);
    const token = localStorage.getItem("access_token");

    const datosReserva = {
      fechaReserva: fecha,
      horaReserva: hora,
      usuario: Number(usuarioId),

      negocio_id: Number(negocioId),
      recurso_id: Number(recursoId),
    };

    // solo si hay servicio
    if (servicioId) {
      datosReserva.servicio_id = Number(servicioId);
    }

    try {
      await axios.post("http://localhost:8000/api/reservas/", datosReserva, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Reserva realizada con éxito");
      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      console.error("Error en la reserva:", error.response?.data || error);
      alert("❌ No se pudo realizar la reserva");
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

        <p className="mb-2 text-black">📅 Fecha: {fecha}</p>
        <p className="mb-2 text-black">🕒 Hora: {hora}</p>

        {/* Servicio opcional */}
        <div className="mt-4">
          <label>Servicio (opcional):</label>
          <select
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            className="text-black p-2 rounded w-full block mb-2 border"
          >
            <option value="">Sin servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={manejarReserva}
          disabled={cargando}
          className="mt-6 bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-white"
        >
          {cargando ? "Reservando..." : "Confirmar Reserva"}
        </button>
      </div>
    </div>
  );
};

export default Reservar;
