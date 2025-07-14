
import React from 'react';

function Imagen({ src, alt, ancho = '', alto = 'auto' }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: ancho, height: alto }}
      className="rounded shadow-md"
    />
  );
}

export default Imagen;
