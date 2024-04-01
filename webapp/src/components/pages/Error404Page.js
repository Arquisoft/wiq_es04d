import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import './Error404Page.css';

function Error404Page({ initialCountdown = 12 }) {
  const navigate = useNavigate(); // Hook para navegar programáticamente.
  const [countdown, setCountdown] = useState(initialCountdown); // Estado para la cuenta regresiva

  // Efecto que maneja la cuenta regresiva y redirige cuando llega a 0.
  useEffect(() => {
    if (countdown === 0) {
      navigate('/'); // Redirige a la página de inicio.
      return;
    }
    // Establece un temporizador que decrementa 'countdown' cada segundo.
    const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
    // Limpieza: cancela el temporizador para evitar efectos secundarios.
    return () => clearTimeout(timerId);
  }, [countdown, navigate]); // Dependencias del efecto.

  // Renderizado de la página 404 con video de fondo y mensaje de cuenta regresiva.
  return (
      <div className="error-page-container">
        <video autoPlay loop muted className="background-video">
          <source src="/videos/Error404.mp4" type="video/mp4" />
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
