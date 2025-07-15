import React from 'react';

const Perfil = () => {
  return (


    <div className="bg-zinc-900 text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6
">
      

      <div className="bg-zinc-900 p-6 rounded-lg w-full md:w-1/2">
        <h2 className="text-2xl font-semibold">
          Perfil de: <span className="text-orange-500"></span>
        </h2>
        <div className="flex flex-col items-center mt-4">
          <img
            src=""
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
          <ul className="mt-6 text-sm space-y-2">
            <li><span className="text-orange-500">• Nombre:</span></li>
            <li><span className="text-orange-500">• Apellidos:</span></li>
            <li><span className="text-orange-500">• Celular:</span></li>
            <li><span className="text-orange-500">• Correo:</span></li>
          </ul>
          <button className="mt-6 border border-white text-white px-4 py-2 hover:bg-orange-500 transition">
            EDITAR PERFIL
          </button>
        </div>
      </div>

     
      <div className="bg-zinc-900 p-6 rounded-lg w-full md:w-1/2">
        <h2 className="text-3xl font-bold text-orange-500 mb-6">
          Historial de Servicios
        </h2>

        <div className="space-y-4">
          <div>
            <label>Filtrar por año:</label>
            <select className="w-full mt-1 px-3 py-2 rounded bg-gray-300 text-black">
              <option>Seleccione un año</option>
              <option></option>
              <option></option>
            </select>
          </div>

          <div>
            <label>Filtrar por mes:</label>
            <select className="w-full mt-1 px-3 py-2 rounded bg-gray-300 text-black">
              <option>Seleccione un mes</option>
              <option></option>
              
            </select>
          </div>

          <button className="mt-2 border border-white px-4 py-2 hover:bg-orange-500 transition">
            OCULTAR HISTORIAL
          </button>
        </div>

      
        <div className="mt-6">
          <div className="grid grid-cols-3 text-center bg-orange-500 text-white font-bold py-2 rounded-md">
            <div>SERVICIO</div>
            <div>FECHA</div>
            <div>HORA</div>
          </div>
          
        </div>
      </div>
    </div>
    
  );
};

export default Perfil;
