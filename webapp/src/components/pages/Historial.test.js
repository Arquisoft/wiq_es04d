import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Historial from './Historial';
import { AuthContext } from '../../AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock de useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock de axios
jest.mock('axios');

describe('Historial Component Tests', () => {
  test('redirects to login if not logged in', () => {
    render(
        <BrowserRouter>
          <AuthContext.Provider value={{ isLoggedIn: false }}>
            <Historial />
          </AuthContext.Provider>
        </BrowserRouter>
    );
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  test('fetches and displays historial data', async () => {
    const fakeHistorialData = {
      username: "userTest",
      NumJugadas: 10,
      NumPreguntasJugadas: 40,
      NumAcertadas: 25,
      NumFalladas: 15
    };

    axios.get.mockResolvedValue({ data: fakeHistorialData });

    render(
        <BrowserRouter>
          <AuthContext.Provider value={{ isLoggedIn: true, username: "userTest" }}>
            <Historial />
          </AuthContext.Provider>
        </BrowserRouter>
    );

    // Espera a que el texto esperado aparezca en el documento
    await waitFor(() => {
      expect(screen.getByText(/Número de Partidas: 10/i)).toBeInTheDocument();
      expect(screen.getByText(/Número de Preguntas Jugadas: 40/i)).toBeInTheDocument();
      expect(screen.getByText(/Número de acertadas: 25/i)).toBeInTheDocument();
      expect(screen.getByText(/Número de falladas: 15/i)).toBeInTheDocument();
    });
  });
});
