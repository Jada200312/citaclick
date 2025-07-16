import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListadoPeluquerias = () => {
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
        <h1 className="text-3xl font-bold text-white text-center">Peluquerías <span className="text-orange-500">Disponibles</span></h1>
        <h1 className="text-3xl font-bold mb-4">Reservar una cita</h1>

      
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-5xl mx-auto"
          />
          <button
            onClick={irABusquedaAvanzada}
            className="ml-4 bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded"
          >
            Búsqueda Avanzada
          </button>
        </div> <br />

      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {peluqueriasFiltradas.map(peluqueria => (
            <div key={peluqueria.id} className="bg-zinc-900 text-white rounded-xl border border-gray-300 p-6 w-full max-w-xs mx-auto text-center space-y-4 shadow-md
">
               <h2 className="text-xl font-semibold">{peluqueria.nombre}</h2> <hr className='border-t-2 border-orange-500 my-4'/>
               
               <div className="flex items-center justify-center text-white space-x-1">
                <p>{peluqueria.direccion}</p>
                <span>/</span>
                <p>{peluqueria.ciudad}</p>
              </div>
              {peluqueria.imagen ? (
                <img
                src={peluqueria.imagen}
                alt={peluqueria.nombre}
                className="w-full h-48 object-cover"
                />

              ) : (
                <div className="w-full h-48 bg-white flex items-center justify-center text-white">
                  Sin imagen
                </div>
              )}
              <div className="p-4">
                <button
                  onClick={() => verHorarios(peluqueria.id)}
                  className="mt-4 bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded"
                >
                  Ver Horarios
                </button> <hr className="border-t-2 border-orange-500 my-4" />

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListadoPeluquerias;
