import CalendarioBase from "./CalendarioBase";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const CalendarioHorarios = ({ negocioId, recursoId }) => {
  const navigate = useNavigate();

  const manejarHoraClick = ({ hora, fecha, estaDisponible }) => {
    if (!estaDisponible) return;

    navigate("/reservar", {
      state: {
        fecha: format(fecha, "yyyy-MM-dd"),
        hora,
        negocioId,
        recursoId,
      },
    });
  };

  return (
    <CalendarioBase
      negocioId={negocioId}
      recursoId={recursoId}
      puedeBloquear={false}
      onHoraClick={manejarHoraClick}
      bloquesSeleccionados={[]}
      mostrarBotonGuardar={false}
    />
  );
};

export default CalendarioHorarios;
