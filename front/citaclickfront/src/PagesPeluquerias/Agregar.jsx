import React, { useState, useEffect } from 'react';

const Agregar = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    // Cargar categorías desde el nuevo endpoint
    fetch('http://localhost:8000/api/servicios/categorias/')
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
        if (data.length > 0) setCategoria(data[0].id); // seleccionar la primera categoría
      })
      .catch(error => {
        console.error('Error al cargar categorías:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    formData.append('imagen', imagen);
    formData.append('peluqueria', 4); // Cambia este ID si puedes obtenerlo dinámicamente

    try {
      const response = await fetch('http://localhost:8000/api/servicios/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Servicio agregado correctamente');
        setNombre('');
        setPrecio('');
        setImagen(null);
        setCategoria(categorias[0]?.id || '');
      } else {
        const errorData = await response.json();
        console.error('Error al agregar servicio:', errorData);
        alert('Error al agregar el servicio: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Error de red al agregar el servicio');
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Agregar <span className="text-orange-500">Corte</span>
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
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full p-2 rounded bg-white text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded font-bold text-lg"
        >
          Aceptar
        </button>
      </form>
    </div>
  );
};

export default Agregar;
