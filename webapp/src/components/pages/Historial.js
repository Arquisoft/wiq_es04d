import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; 
import '../../App.css';
import './Historial.css'; 

export default function Historial() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext); 

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Datos de ejemplo
  const example_data = {
    username: 'nombre',
    NumJugadas: '20',
    NumPreguntasJugadas: '100',
    NumAcertadas: '80',
    NumFalladas: '20',
  };

  return (
    <div className="historial-container">
      <h1 className='services'>HISTORIAL</h1>
      <div className="user-info">
        <h2>{example_data.username}</h2>
        <p>Número de Partidas: {example_data.NumJugadas}</p>
        <p>Número de Preguntas Jugadas: {example_data.NumPreguntasJugadas}</p>
        <p>Número de acertadas: {example_data.NumAcertadas}</p>
        <p>Número de falladas: {example_data.NumFalladas}</p>
      </div>
    </div>
  );
}
