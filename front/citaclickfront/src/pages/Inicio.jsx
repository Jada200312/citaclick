import React from 'react';
import fondoBienvenida from '../assets/indeximg.jpeg'; 
import contentcc from '../assets/contentcc.png'; 

const inicio = () => {
  return (
    <>
      <div
        className="w-full h-[400px] bg-cover bg-center flex items-center px-6"
        style={{ backgroundImage: `url(${fondoBienvenida})` }}
      >
        <div className="bg-white/90 p-6 md:p-8 rounded-md shadow-md max-w-xl">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Te damos la Bienvenida a <span className="font-bold text-gray-900">CitaClick</span>
          </h1>
          <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
            Agenda tu turno en la peluquería y obtén un nuevo look espectacular.<br />
            Elige entre los próximos 7 días para encontrar la fecha perfecta que se adapte a tu agenda.
          </p>
        </div>
      </div>

    
      <div className="bg-black text-white px-6 py-10 md:px-20 md:py-16 mt-6 flex flex-col md:flex-row items-center justify-between rounded-lg">
        
        <div className="flex-1 mb-8 md:mb-0 md:mr-10">
          <h2 className="text-3xl font-semibold mb-4">
            ¿Quienes <span className="text-orange-500">Somos</span>?
          </h2>
          <p className="mb-4 text-sm md:text-base leading-relaxed">
            ¡Este es un espacio excelente! Úsalo para profundizar en tu sección de título llamativo.
            Explica de qué se trata esta sección, comparte algunos detalles y proporciona la información
            correcta para captar la atención del público.
          </p>
          <p className="mb-6 text-sm md:text-base">Añade una llamada a la acción</p>
          <button className="border border-white text-white py-2 px-6 rounded hover:bg-orange-600 hover:text-white transition">
            Iniciar Sesión
          </button>
        </div>

        
        <div className="flex-1 flex justify-center">
          <img
            src={contentcc}
            alt="Contenido CitaClick"
            className="w-full max-w-xs border-4 border-white rounded-md"
          />
        </div>
      </div>
    </>
  );
};

export default inicio;

