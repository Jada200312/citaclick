import React from 'react';
import { useParams } from 'react-router-dom';
import CalendarioHorarios from '../components/CalendarioHorarios';

const VerHorarios = () => {
  const { id } = useParams(); // Captura el ID de la peluquería desde la URL

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Selecciona una Fecha</h1>
      <CalendarioHorarios peluqueriaId={id} />
    </div>
  );
};

export default VerHorarios;
