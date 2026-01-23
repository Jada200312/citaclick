import { useState } from "react";
import CalendarioBase from "../components/CalendarioBase";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";

const BloquearHorarios = () => {
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Recibimos negocioId desde navigate()
  const { negocioId, recursoId } = location.state || {};

  // Seguridad por si alguien entra directo a la URL
  if (!negocioId || !recursoId) {
    navigate("/");
    return null;
  }

  // =========================
  // Click en hora
  // =========================
  const manejarHoraClick = ({ hora, bloqueManual, estaDisponible }) => {
    if (bloqueManual || !estaDisponible) return;

    if (bloquesSeleccionados.includes(hora)) {
      setBloquesSeleccionados(bloquesSeleccionados.filter((h) => h !== hora));
    } else {
      setBloquesSeleccionados([...bloquesSeleccionados, hora]);
    }
  };

  // =========================
  // Guardar bloques
  // =========================
  const guardarBloques = async (fecha) => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    const payload = {
      negocio: negocioId,
      fecha: format(fecha, "yyyy-MM-dd"),
      bloques: bloquesSeleccionados,
      recurso: recursoId,
    };

    try {
      await axios.post(
        "http://localhost:8000/api/negocios/bloques-no-disponibles/",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setBloquesSeleccionados([]);
      window.location.reload();
    } catch (err) {
      console.error("Error guardando bloques", err);
    }
  };

  return (
    <CalendarioBase
      negocioId={negocioId}
      recursoId={recursoId}
      puedeBloquear={true}
      onHoraClick={manejarHoraClick}
      bloquesSeleccionados={bloquesSeleccionados}
      setBloquesSeleccionados={setBloquesSeleccionados}
      mostrarBotonGuardar={true}
      onGuardarBloques={guardarBloques}
    />
  );
};

export default BloquearHorarios;
