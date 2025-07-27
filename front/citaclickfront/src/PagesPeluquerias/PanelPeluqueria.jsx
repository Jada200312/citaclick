// src/components/MenuPrincipal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ganancias from '../assets/ganancias.png';
import reservas from '../assets/Reservas.png';
import suscripciones from '../assets/Suscripcion.png';
import gestionservice from '../assets/servicios.png';

const MenuPrincipal = ({ peluqueriaId }) => {
  const navigate = useNavigate();

  const opciones = [
    { nombre: 'Ganancias', imagen: ganancias, ruta: '/ganancias' },
    { nombre: 'Reservas', imagen: reservas, ruta: `/Reservas/${4}` }, //hacer dinamico esto
    { nombre: 'Suscripción', imagen: suscripciones, ruta: '/Suscripcion' },
    { nombre: 'Gestionar Servicio', imagen: gestionservice, ruta: '/servicios' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 bg-black py-10">
      {opciones.map((opcion) => (
        <div
          key={opcion.nombre}
          className="bg-orange-500 w-64 h-64 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:scale-105 transition"
          onClick={() => navigate(opcion.ruta)}
        >
          <img src={opcion.imagen} alt={opcion.nombre} className="w-24 h-24 mb-4" />
          <p className="text-white text-lg font-semibold">{opcion.nombre}</p>
        </div>
      ))}
    </div>
  );
};

export default MenuPrincipal;
