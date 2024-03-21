import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import './Error404Page.css'; // Asegúrate de tener este archivo en el mismo directorio

function Error404Page() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(123123);

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
        <h1>404 - Oops! You ran out of oxygen</h1>
        <p>The page you're looking for is now beyond our reach. Let's get you</p>
        <div className="countdown">Back Home in {countdown} segundos...</div>
        <Button buttonStyle='btn--outline' to='/'>Go Home</Button>
      </div>
    </div>
  );
}

export default Error404Page;
