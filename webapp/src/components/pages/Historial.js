import React, {useCallback, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; 
import '../../App.css';
import './Historial.css'; 

export default function Historial() {
  const navigate = useNavigate();
  const { isLoggedIn, username } = useContext(AuthContext);
  const [historialData, setHistorialData] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const fetchHistorialData = useCallback(async () => {
    try {
      let response = await axios.get(`${apiEndpoint}/gethistory`, {
        params: { username: username }
      });

      console.log(response.data);

      setHistorialData(response.data);

    } catch (error) {
      console.error('Error al obtener el historial:', error);
    }
  }, [apiEndpoint, username]);


  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchHistorialData();
    }
  }, [isLoggedIn, navigate, fetchHistorialData]);

  return (
    <div className="historial-container">
      <h1 className='services'>HISTORIAL</h1>
      {historialData && (
        <div className="user-info">
          <h2>Nombre de usuario: {historialData.username}</h2>
          <p>Número de Partidas: {historialData.NumJugadas}</p>
          <p>Número de Preguntas Jugadas: {historialData.NumPreguntasJugadas}</p>
          <p>Número de acertadas: {historialData.NumAcertadas}</p>
          <p>Número de falladas: {historialData.NumFalladas}</p>
        </div>
      )}
    </div>
  );
}
