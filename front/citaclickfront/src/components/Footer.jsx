// src/components/Footer.jsx
import React from 'react';
import Facebook from'../assets/facebook.png'
import Instagram from'../assets/instagram.png'
import Twittter from'../assets/logotipos.png'
import Logo from '../assets/log.png'




function Footer() {
  return (
    <footer className="bg-zinc-950 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        
        {/* Izquierda */}
        <div className="mb-4 md:mb-0 flex flex-col gap-y-2 text-lg">
          <h2><span className="text-orange-500">Social</span></h2>
          <div className='flex items-center gap-2'><img src={Facebook} alt="Logo" className="h-7" />  Facebook</div>
           
         <div className='flex items-center gap-2'><img src={Instagram} alt="Logo" className="h-7" />Instagram</div>
         <div className='flex items-center gap-2'> <img src={Twittter} alt="Logo" className="h-7" />X</div>
        </div>

        {/* Centro */}
         <div className="mb-4 md:mb-0 flex flex-col gap-y-2 text-lg">
          <h2>CITA<span className="text-orange-500">CLICK</span></h2>
         
        
        
        <div className="mb-4 md:mb-0">
          <p className="text-sm">© {new Date().getFullYear()} CitaClick. Todos los derechos reservados.</p>
        </div>
        </div>

        {/* Derecha */}
       <div className="rounded-full overflow-hidden w-20 h-20 shadow-lg border-2 border-gray-300">
  <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
</div>
      </div>
    </footer>
  );
}

export default Footer;
