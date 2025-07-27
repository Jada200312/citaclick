import React from 'react';

const Servicios = () => {
  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-4xl font-bold mb-10 text-center">
        Página de <span className="text-orange-500">Servicios</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-12 items-center">
        {/* Botón completo: Agregar */}
        <button
          onClick={() => window.location.href = '/agregar'}
          className="w-[28rem] h-96 bg-[#fd6f01] p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition hover:scale-105"
        >
          <img
            src="../src/assets/agregar.png"
            alt="Agregar"
            className="max-w-[150px] h-auto mb-6"
          />
          <span className="text-white text-xl font-bold">Agregar</span>
        </button>

        {/* Botón completo: Editar */}
        <button
          onClick={() => window.location.href = '/editaroeliminar'}
          className="w-[28rem] h-96 bg-[#fd6f01] p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition hover:scale-105"
        >
          <img
            src="../src/assets/editar.png"
            alt="Editar"
            className="max-w-[150px] h-auto mb-6"
          />
          <span className="text-white text-xl font-bold">Editar</span>
        </button>
      </div>
    </div>
  );
};

export default Servicios;
