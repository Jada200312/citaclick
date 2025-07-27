import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditarOEliminar = () => {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);  // Al inicio no hay categoría seleccionada
  const navigate = useNavigate();

  // Cargar servicios
  useEffect(() => {
    fetch('http://localhost:8000/api/servicios/')
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(error => console.error('Error al cargar servicios:', error));
  }, []);

  // Cargar categorías
  useEffect(() => {
    fetch('http://localhost:8000/api/categorias/')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Error al cargar categorías:', error));
  }, []);

  // Filtra servicios por categoría
  const filtrarServicios = () => {
    if (!categoriaSeleccionada) {
      return servicios; // Si no hay categoría seleccionada, mostramos todos
    }
    return servicios.filter(s => s.categoria === categoriaSeleccionada);  // Filtramos por ID de categoría
  };

  const handleEliminar = async (id) => {
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar este servicio?');
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:8000/api/servicios/${id}/`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setServicios(servicios.filter(s => s.id !== id));
      alert('Servicio eliminado');
    } else {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Lista de <span className="text-orange-500">Cortes</span>
      </h2>

      {/* Filtros de categoría */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {/* Botón Todos */}
        <button
          onClick={() => setCategoriaSeleccionada(null)}  // Al seleccionar 'Todos', ponemos null
          className={`px-4 py-2 rounded-full border ${
            categoriaSeleccionada === null
              ? 'bg-orange-500 text-white'
              : 'bg-white text-black'
          }`}
        >
          Todos
        </button>

        {/* Botón Corte de Cabello */}
        <button
          onClick={() => setCategoriaSeleccionada(1)}  // Asumimos que 'Corte de Cabello' tiene ID 1
          className={`px-4 py-2 rounded-full border ${
            categoriaSeleccionada === 1
              ? 'bg-orange-500 text-white'
              : 'bg-white text-black'
          }`}
        >
          Corte de Cabello
        </button>

        {/* Botón Barba */}
        <button
          onClick={() => setCategoriaSeleccionada(2)}  // Asumimos que 'Barba' tiene ID 2
          className={`px-4 py-2 rounded-full border ${
            categoriaSeleccionada === 2
              ? 'bg-orange-500 text-white'
              : 'bg-white text-black'
          }`}
        >
          Barba
        </button>

        {/* Botones para otras categorías */}
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoriaSeleccionada(cat.id)}  // Usamos el ID de la categoría
            className={`px-4 py-2 rounded-full border ${
              categoriaSeleccionada === cat.id
                ? 'bg-orange-500 text-white'
                : 'bg-white text-black'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {filtrarServicios().map(servicio => (
          <div
            key={servicio.id}
            className="bg-white text-black rounded-lg overflow-hidden shadow-md w-72 mx-auto"
          >
            <img
              src={servicio.imagen ? `http://localhost:8000${servicio.imagen}` : 'https://via.placeholder.com/280x240?text=Sin+imagen'}
              alt={servicio.nombre}
              className="w-full h-60 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-xl">{servicio.nombre}</h3>
              <p className="text-gray-700">${servicio.precio}</p>
              <div className="mt-4 flex justify-around">
                <button
                  onClick={() => navigate(`/editar/${servicio.id}`)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(servicio.id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditarOEliminar;
