import axios from "axios";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

registerLocale("es", es);

const formatearHora = (hora24) => {
  const parsed = parse(hora24, "HH:mm", new Date());
  return format(parsed, "hh:mm a");
};

const BusquedaAvanzadaNegocios = () => {
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("");
  const [negocios, setNegocios] = useState([]);
  const [tiposNegocio, setTiposNegocio] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);
  const [horaSugerida, setHoraSugerida] = useState("");
  const [buscado, setBuscado] = useState(false);

  const navigate = useNavigate();

  // Verificar login
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Cargar tipos de negocio
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/negocios/tipos-negocio/")
      .then((res) => setTiposNegocio(res.data))
      .catch((err) => console.error(err));
  }, []);

  const buscarDisponibles = async () => {
    if (!fecha || !hora) {
      setError("Debes seleccionar fecha y hora.");
      return;
    }
    setBuscado(true);
    setCargando(true);
    setError("");
    setNegocios([]);

    try {
      const response = await axios.get(
        "http://localhost:8000/api/negocios/buscar-disponibles/",
        {
          params: {
            fecha: format(fecha, "yyyy-MM-dd"),
            hora,
            tipo: tipoSeleccionado || undefined,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setNegocios(response.data.resultados);
      setFallback(response.data.fallback);
      setHoraSugerida(response.data.hora);
    } catch (err) {
      console.error(err);
      setError("Error al buscar negocios disponibles.");
    } finally {
      setCargando(false);
    }
  };

  const irAReservar = (negocioId) => {
    navigate("/reservar", {
      state: {
        fecha: format(fecha, "yyyy-MM-dd"),
        hora: horaSugerida, // ✅ esta es la hora válida devuelta por el backend
        negocioId,
      },
    });
  };

  const renderStars = (rating) => {
    const totalStars = 5;

    return (
      <div className="flex justify-center items-center">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          let fillPercentage = 0;

          if (starValue <= Math.floor(rating)) {
            fillPercentage = 100;
          } else if (starValue - 1 < rating && starValue > rating) {
            fillPercentage = (rating - (starValue - 1)) * 100;
          }

          return (
            <div key={index} className="relative w-5 h-5">
              <Star className="w-5 h-5 text-gray-400 absolute" />
              <div
                className="absolute overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white text-center mb-6">
        Búsqueda Avanzada <span className="text-orange-500">de Negocios</span>
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <DatePicker
          selected={fecha}
          onChange={setFecha}
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          locale="es"
          className="border rounded px-4 py-2 text-black"
          placeholderText="Fecha"
        />

        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="border rounded px-4 py-2 text-black"
        />

        <select
          value={tipoSeleccionado}
          onChange={(e) => setTipoSeleccionado(e.target.value)}
          className="border rounded px-4 py-2 text-black"
        >
          <option value="">Todos los tipos</option>
          {tiposNegocio.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={buscarDisponibles}
          className="bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {cargando && <p className="text-white text-center">Buscando...</p>}

      {buscado && horaSugerida && (
        <p className="text-center text-orange-400 mb-4">
          {fallback ? (
            <>
              No hay negocios disponibles a las <b>{formatearHora(hora)}</b>.{" "}
              <br />
              Lo más cercano a tu búsqueda es a las{" "}
              <b>{formatearHora(horaSugerida)}</b>.
            </>
          ) : (
            <>
              Negocios disponibles a la hora seleccionada:{" "}
              <b>{formatearHora(horaSugerida)}</b>
            </>
          )}
        </p>
      )}

      {!cargando && negocios.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {negocios.map((negocio) => (
            <div
              key={negocio.id}
              className="bg-zinc-900 text-white rounded-xl border p-6 text-center space-y-4"
            >
              <h2 className="text-xl font-semibold">{negocio.nombre}</h2>

              <p>
                {negocio.direccion} / {negocio.ciudad}
              </p>

              {negocio.imagen ? (
                <img
                  src={negocio.imagen}
                  alt={negocio.nombre}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="h-40 bg-gray-200 flex items-center justify-center text-black">
                  Sin imagen
                </div>
              )}

              <button
                onClick={() => irAReservar(negocio.id)}
                className="bg-orange-600 hover:bg-orange-400 px-4 py-2 rounded"
              >
                Reservar
              </button>

              <div>
                <p className="text-sm text-gray-300">
                  Hora disponible: <b>{formatearHora(horaSugerida)}</b>
                </p>
                {renderStars(negocio.promedio_calificaciones || 0)}
                <p className="text-yellow-400 font-bold">
                  {(negocio.promedio_calificaciones || 0).toFixed(1)} / 5
                </p>
                <p className="text-sm text-gray-400">
                  ({negocio.total_calificaciones || 0} reseñas)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {buscado && !cargando && negocios.length === 0 && fecha && hora && (
        <p className="text-center text-orange-400 mt-6">
          No hay negocios disponibles.
        </p>
      )}
    </div>
  );
};

export default BusquedaAvanzadaNegocios;
