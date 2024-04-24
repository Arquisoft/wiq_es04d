import React from 'react';
import '../../App.css';

function Creditos() {
  return (
    <div className='hero-container'>
      <video src='/videos/creditos.mp4' autoPlay muted playsInline data-testid="creditos-video"/>
    </div>
  );
}

export default Creditos;