// src/pages/Ganancias.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'chart.js/auto';

const Ganancias = () => {
  const [ganancias, setGanancias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [anios, setAnios] = useState([]);
  const [meses, setMeses] = useState([]);

  const [anioSeleccionado, setAnioSeleccionado] = useState('');
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('diario');

  const navigate = useNavigate();

  const obtenerUsuarioDesdeToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

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

  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }
    if (!esPeluqueria) {
      navigate("/");
      return;
    }
    cargarAnios();
  }, [navigate, usuarioId, esPeluqueria]);

  const cargarAnios = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reservas/fechas/anios/', {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setAnios(response.data.anios);
      if (response.data.anios.length > 0) {
        setAnioSeleccionado(response.data.anios[0]);
      }
    } catch (error) {
      console.error("Error cargando años", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (anioSeleccionado && (tipoFiltro === 'diario' || tipoFiltro === 'mensual')) {
      cargarMeses(anioSeleccionado);
    }
  }, [anioSeleccionado, tipoFiltro]);

  const cargarMeses = async (anio) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reservas/fechas/meses/?anio=${anio}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setMeses(response.data.meses);
      if (response.data.meses.length > 0) {
        setMesSeleccionado(response.data.meses[0]);
      }
    } catch (error) {
      console.error("Error cargando meses", error);
    }
  };

  useEffect(() => {
    if (anioSeleccionado) {
      cargarGanancias();
    }
  }, [anioSeleccionado, mesSeleccionado, tipoFiltro]);

  const cargarGanancias = async () => {
    setLoading(true);
    let fechaFiltro = '';

    if (tipoFiltro === 'diario') {
      if (!anioSeleccionado || !mesSeleccionado) return;
      fechaFiltro = `${anioSeleccionado}-${String(mesSeleccionado).padStart(2, '0')}`;
    } else if (tipoFiltro === 'mensual') {
      if (!anioSeleccionado || !mesSeleccionado) return;
      fechaFiltro = `${anioSeleccionado}-${String(mesSeleccionado).padStart(2, '0')}`;
    } else if (tipoFiltro === 'anual') {
      if (!anioSeleccionado) return;
      fechaFiltro = String(anioSeleccionado);
    }

    try {
      const response = await axios.get('http://localhost:8000/api/reservas/ganancias/', {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        params: { tipo_filtro: tipoFiltro, fecha: fechaFiltro },
      });

      const sortedData = response.data
        .map(item => ({
          fecha: item.fecha,
          total: parseFloat(item.ganancia) || 0
        }))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      setGanancias(sortedData);
    } catch (error) {
      console.error('Error cargando ganancias filtradas', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const nuevoFiltro = e.target.value;
    setTipoFiltro(nuevoFiltro);
    setMesSeleccionado('');
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, family: 'Poppins, sans-serif', weight: 'bold' },
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
        ticks: { color: 'white', font: { size: 12, family: 'Poppins, sans-serif' } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'white', font: { size: 12, family: 'Poppins, sans-serif' } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  if (loading) {
    return <div className="text-center text-white py-20">Cargando...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Página de <span className="text-orange-500">Ganancias</span>
      </h2>

      {/* Selectores */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select className="bg-gray-800 text-white p-2 rounded"
          value={tipoFiltro} onChange={handleFiltroChange}>
          <option value="diario">Diario</option>
          <option value="mensual">Mensual</option>
          <option value="anual">Anual</option>
        </select>

        {/* Año solo para diario o mensual */}
        {(tipoFiltro === 'diario' || tipoFiltro === 'mensual') && anios.length > 0 && (
          <select className="bg-gray-800 text-white p-2 rounded"
            value={anioSeleccionado} onChange={e => setAnioSeleccionado(Number(e.target.value))}>
            {anios.map(anio => <option key={anio} value={anio}>{anio}</option>)}
          </select>
        )}

        {/* Mes solo para diario */}
        {tipoFiltro === 'diario' && meses.length > 0 && (
          <select className="bg-gray-800 text-white p-2 rounded"
            value={mesSeleccionado} onChange={e => setMesSeleccionado(Number(e.target.value))}>
            {meses.map(mes => <option key={mes} value={mes}>{String(mes).padStart(2, '0')}</option>)}
          </select>
        )}
      </div>

      {ganancias.length === 0 ? (
        <p className="text-center text-white mt-10 font-semibold">
          No hay datos de ganancias para mostrar.
        </p>
      ) : (
        <div className="max-w-5xl mx-auto" style={{ height: 450 }}>
          <Line
            data={{
              labels: ganancias.map(g => g.fecha),
              datasets: [{
                label: 'Ganancias',
                data: ganancias.map(g => g.total),
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.4)',
                fill: true,
                tension: 0.3,
              }],
            }}
            options={options}
          />
        </div>
      )}
    </div>
  );
};

export default Ganancias;
