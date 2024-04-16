import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import '../../App.css';
import './Ranking.css';

export default function Ranking() {

    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [rankingData, setRankingData] = useState(false);

    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const fetchRankingData = useCallback(async () => {
        try {
            let response = await axios.get(`${apiEndpoint}/getranking`);

            setRankingData(response.data);

        } catch (error) {
            console.error('Error al obtener el ranking:', error);
        }
    }, [apiEndpoint]);


    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchRankingData();
        }
    }, [isLoggedIn, navigate, fetchRankingData]);

    return (
        <div className='ranking-container'>
            <video src='/videos/ranking.mp4' autoPlay loop muted playsInline data-testid="ranking-video" />
            <h1 className='ranking'>RANKING</h1>
                {rankingData.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Posición</th>
                                <th>Nombre de usuario</th>
                                <th>Preguntas Jugadas</th>
                                <th>Preguntas Acertadas</th>
                                <th>Porcentaje de Aciertos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankingData.map((player, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{player.username}</td>
                                    <td>{player.NumPreguntasJugadas}</td>
                                    <td>{player.NumAcertadas}</td>
                                    <td>{((player.NumAcertadas / player.NumPreguntasJugadas) * 100).toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay datos de ranking disponibles.</p>
                )}
        </div>
    );
}
