import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Reservar = () => {
  const [peluquerias, setPeluquerias] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/peluquerias/')
      .then(res => setPeluquerias(res.data))
      .catch(err => console.error('Error cargando peluquerías:', err));
  }, []);

  const peluqueriasFiltradas = peluquerias.filter(peluqueria =>
    peluqueria.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const irABusquedaAvanzada = () => {
    navigate('/busqueda-avanzada');
  };

  const verHorarios = (id) => {
    navigate(`/peluqueria/${id}`);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Reservar una cita</h1>

        {/* Barra de búsqueda */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
          />
          <button
            onClick={irABusquedaAvanzada}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Búsqueda Avanzada
          </button>
        </div>

        {/* Lista de peluquerías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {peluqueriasFiltradas.map(peluqueria => (
            <div key={peluqueria.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {peluqueria.imagen ? (
                <img
                src={peluqueria.imagen}
                alt={peluqueria.nombre}
                className="w-full h-48 object-cover"
                />

              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{peluqueria.nombre}</h2>
                <p className="text-gray-600">{peluqueria.direccion}</p>
                <button
                  onClick={() => verHorarios(peluqueria.id)}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Ver Horarios
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Reservar;
