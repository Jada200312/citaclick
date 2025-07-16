import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Reservar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fecha, hora, peluqueriaId } = location.state;

  const [servicioId, setServicioId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // Simulación del usuario logueado
  const usuarioId = 1;

  const manejarReserva = async () => {
    if (!servicioId) {
      setMensaje("Por favor selecciona un servicio.");
      return;
    }
  
    setCargando(true);
    setMensaje("");
  
    const token = localStorage.getItem("access_token");
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/reservas/",
        {
          fechaReserva: fecha,
          horaReserva: hora,
          peluqueria: peluqueriaId,
          servicio: servicioId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setMensaje("✅ Reserva realizada con éxito");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMensaje("❌ Error al reservar.");
      console.error(error.response?.data || error);
    } finally {
      setCargando(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Confirmar Reserva</h1>
      <p className="mb-2">📅 Fecha: {fecha}</p>
      <p className="mb-2">🕒 Hora: {hora}</p>
      <p className="mb-2">💈 Peluquería ID: {peluqueriaId}</p>

      <div className="mt-4">
        <label className="block mb-2">Selecciona un servicio:</label>
        <select
          value={servicioId}
          onChange={(e) => setServicioId(e.target.value)}
          className="text-black p-2 rounded w-full"
        >
          <option value="">-- Selecciona --</option>
          <option value={1}>Corte de Cabello</option>
          <option value={2}>Corte de Barba</option>
        </select>
      </div>

      <button
        onClick={manejarReserva}
        disabled={cargando}
        className="mt-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
      >
        {cargando ? "Reservando..." : "Confirmar Reserva"}
      </button>

      {mensaje && <p className="mt-4">{mensaje}</p>}
    </div>
  );
};

export default Reservar;
