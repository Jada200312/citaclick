import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarioHorarios from '../components/CalendarioHorarios';

const VerHorarios = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
   <h1 className="text-xl font-bold text-white">
          Selecciona Una <span className="text-orange-600">Fecha</span>
        </h1>
      <CalendarioHorarios peluqueriaId={id} />
    </div>
  );
};

export default VerHorarios;
