import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarioHorarios from '../components/CalendarioHorarios';

const VerHorarios = () => {
  const { id } = useParams(); // Captura el ID de la peluquería desde la URL
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Selecciona una Fecha</h1>
      <CalendarioHorarios peluqueriaId={id} />
    </div>
  );
};

export default VerHorarios;
