import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const ReservaHotel = () => {
  const { recursoId } = useParams();
  const navigate = useNavigate();

  const [rangosOcupados, setRangosOcupados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rango, setRango] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // 🔹 Cargar fechas ocupadas
  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/negocios/hotel/habitacion/${recursoId}/ocupadas/`
      )
      .then((res) => {
        const disabled = res.data.map((r) => ({
          startDate: new Date(r.fecha_inicio),
          endDate: new Date(r.fecha_fin),
        }));
        setRangosOcupados(disabled);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [recursoId]);

  // 🔹 Enviar reserva
  const reservar = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post(
        "http://localhost:8000/api/negocios/hotel/reservar/",
        {
          recurso_id: recursoId,
          fecha_inicio: rango[0].startDate.toISOString().split("T")[0],
          fecha_fin: rango[0].endDate.toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Reserva realizada correctamente 🏨");
        navigate(-1);
      })
      .catch((err) => {
        alert(
          err.response?.data?.error ||
            "No se pudo realizar la reserva"
        );
      });
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Cargando disponibilidad...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        Reserva tu <span className="text-orange-500">Habitación</span>
      </h1>

      <div className="flex justify-center">
        <DateRange
          ranges={rango}
          onChange={(item) => setRango([item.selection])}
          minDate={new Date()}
          disabledDates={rangosOcupados.flatMap((r) => {
            const fechas = [];
            let actual = new Date(r.startDate);
            while (actual <= r.endDate) {
              fechas.push(new Date(actual));
              actual.setDate(actual.getDate() + 1);
            }
            return fechas;
          })}
          locale={es}
        />
      </div>

      <div className="text-center mt-6 space-y-2">
        <p>
          <strong>Check-in:</strong>{" "}
          {rango[0].startDate.toLocaleDateString()}
        </p>
        <p>
          <strong>Check-out:</strong>{" "}
          {rango[0].endDate.toLocaleDateString()}
        </p>

        <button
          onClick={reservar}
          className="mt-4 bg-orange-600 hover:bg-orange-500 px-6 py-2 rounded text-white font-semibold"
        >
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
};

export default ReservaHotel;
