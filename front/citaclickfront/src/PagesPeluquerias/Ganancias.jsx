import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const Ganancias = () => {
  const [ganancias, setGanancias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGanancias = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/peluquerias/ganancias/');
        const sortedData = response.data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        setGanancias(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las ganancias:', error);
        setLoading(false);
      }
    };
    fetchGanancias();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
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
          color: '#333',
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
          color: 'rgba(0, 0, 0, 0.1)',
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
          color: 'rgba(0, 0, 0, 0.1)',
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
