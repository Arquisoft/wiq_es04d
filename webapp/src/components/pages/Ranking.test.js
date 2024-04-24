import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import Ranking from './Ranking';
import { BrowserRouter } from 'react-router-dom';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

// Mock de axios
jest.mock('axios');

describe('Ranking Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should navigate to login if not logged in', () => {
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ isLoggedIn: false }}>
                    <Ranking />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        // Verifica que se haya llamado a navigate con '/login'
        expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
    test('should handle no ranking data', async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <Ranking />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByText('No hay datos de ranking disponibles.')).toBeInTheDocument());
    });
    test('should display table headers and player data correctly', async () => {
        const rankingData = [
            { username: 'user1', NumPreguntasJugadas: 10, NumAcertadas: 5 },
            { username: 'user2', NumPreguntasJugadas: 20, NumAcertadas: 12 }
        ];

        axios.get.mockResolvedValue({ data: rankingData });

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ isLoggedIn: true }}>
                    <Ranking />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        // Esperamos a que se muestren los elementos en la pantalla
        await waitFor(() => {
            // Verificar que los encabezados de la tabla se cargan correctamente
            expect(screen.getByText('Posición')).toBeInTheDocument();
            expect(screen.getByText('Nombre de usuario')).toBeInTheDocument();
            expect(screen.getByText('Preguntas Jugadas')).toBeInTheDocument();
            expect(screen.getByText('Preguntas Acertadas')).toBeInTheDocument();
            expect(screen.getByText('Porcentaje de Aciertos')).toBeInTheDocument();

            // Verificar que los datos del primer jugador se cargan correctamente
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();  // Preguntas Jugadas por user1
            expect(screen.getByText('5')).toBeInTheDocument();  // Preguntas Acertadas por user1
            expect(screen.getByText('50.00%')).toBeInTheDocument();  // Porcentaje de Aciertos de user1

            // Verificar que los datos del segundo jugador se cargan correctamente
            expect(screen.getByText('user2')).toBeInTheDocument();
            expect(screen.getByText('20')).toBeInTheDocument();  // Preguntas Jugadas por user2
            expect(screen.getByText('12')).toBeInTheDocument();  // Preguntas Acertadas por user2
            expect(screen.getByText('60.00%')).toBeInTheDocument();  // Porcentaje de Aciertos de user2
        });
    });

});
