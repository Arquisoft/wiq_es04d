import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import './Error404Page.css'; // Asegúrate de tener este archivo en el mismo directorio

function Error404Page() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
      return;
    }
    const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timerId);
  }, [countdown, navigate]);

  return (
    <div className="error-page-container">
      <video autoPlay loop muted className="background-video">
        <source src="videos/Error404.mp4" type="video/mp4" />
      </video>
      <div className="content">
        <h1>404 - ¡Ups! Te quedaste sin oxígeno</h1>
        <p>La página que estas buscando está fuera de nuestro alcance. Vamos a por ti.</p>
        <div className="countdown">Vuelta al inicio en {countdown} segundos...</div>
        <Button buttonStyle='btn--outline' to='/' sx={{ mt: 3, mb: 2 }}>Volver al Inicio</Button>
      </div>
    </div>
  );
}

export default Error404Page;
