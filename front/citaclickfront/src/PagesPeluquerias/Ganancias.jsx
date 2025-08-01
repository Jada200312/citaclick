// src/pages/Ganancias.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'chart.js/auto';

const Ganancias = () => {
  const [ganancias, setGanancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Obtener ID usuario desde token JWT
  const obtenerUsuarioDesdeToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id || payload.user || payload.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const usuarioId = obtenerUsuarioDesdeToken();
  const esPeluqueria = localStorage.getItem("es_peluqueria") === "true";

  // 🔹 Validar acceso
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token || !usuarioId) {
      navigate("/login"); // No autenticado
      return;
    }
    if (!esPeluqueria) {
      navigate("/"); // No es peluquería → fuera
      return;
    }

    // 🔹 Cargar ganancias solo si pasa validación
    const fetchGanancias = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/peluquerias/ganancias/',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const sortedData = response.data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        setGanancias(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las ganancias:', error);
        setLoading(false);
      }
    };

    fetchGanancias();
  }, [navigate, usuarioId, esPeluqueria]);

  if (loading) {
    return <div className="text-center text-white py-20">Cargando...</div>;
  }

  const data = {
    labels: ganancias.map(ganancia => ganancia.fecha),
    datasets: [
      {
        label: 'Ganancias Diarias',
        data: ganancias.map(ganancia => Number(ganancia.monto)),
        borderColor: '#FF6F00',
        backgroundColor: 'rgba(224, 224, 224, 0.05)',
        pointBackgroundColor: '#FF6F00',
        pointBorderColor: '#fff',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Poppins, sans-serif',
            weight: 'bold',
          },
          color: '#fff',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          font: {
            size: 12,
            family: 'Poppins, sans-serif',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
          font: {
            size: 12,
            family: 'Poppins, sans-serif',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Página de <span className="text-orange-500">Ganancias</span>
      </h2>
      <div className="h-[400px] bg-gray-900 rounded-lg p-4">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Ganancias;
