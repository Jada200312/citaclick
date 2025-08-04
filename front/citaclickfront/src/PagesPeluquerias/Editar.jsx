import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Editar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState('');

  const peluqueriaId = localStorage.getItem("peluqueria_id");

  useEffect(() => {
    fetch('http://localhost:8000/api/servicios/categorias/')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar categorías');
        return res.json();
      })
      .then(data => setCategorias(data))
      .catch(err => {
        console.error(err);
        alert('No se pudieron cargar las categorías');
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/api/servicios/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar el servicio');
        return res.json();
      })
      .then(data => {
        setNombre(data.nombre);
        setPrecio(data.precio);
        setCategoria(data.categoria);
        setImagenActual(data.imagen);
      })
      .catch(err => {
        alert('Error al cargar el servicio');
        navigate('/editaroeliminar');
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    formData.append('peluqueria', peluqueriaId);
    if (imagen) formData.append('imagen', imagen);

    try {
      const response = await fetch(`http://localhost:8000/api/servicios/${id}/`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Servicio actualizado correctamente');
        navigate('/editaroeliminar');
      } else {
        const errorData = await response.json();
        alert('Error al actualizar el servicio: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      alert('Error de red al actualizar el servicio');
      console.error(error);
    }
  };

  const obtenerURLImagen = (ruta) => {
    if (!ruta) return null;
    return ruta.startsWith('http') ? ruta : `http://localhost:8000${ruta}`;
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Editar <span className="text-orange-500">Corte</span>
      </h2>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block mb-2">Nombre del Corte</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2">Imagen actual</label>
          {imagenActual ? (
            <img
              src={obtenerURLImagen(imagenActual)}
              alt="Imagen actual"
              className="w-40 h-40 mb-2 object-cover rounded"
            />
          ) : (
            <p>No hay imagen</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full p-2 rounded bg-white text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded font-bold text-lg"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default Editar;
