import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import Jugar from './Jugar';
import { AuthContext } from '../../AuthContext';
import { BrowserRouter } from 'react-router-dom';
import axios from "axios";

// Mock de useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));
// Mock de axios
jest.mock('axios');
describe('Jugar Component Tests', () => {
  test('redirects to login if not logged in', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ isLoggedIn: false }}>
          <Jugar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Verifica que se haya llamado a navigate con '/login'
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
  test('check the questions', async () => {
    const questions = [
      {
        question: "¿Cuál es la capital de Alemania?",
        answers: [
          { answer: "Berlín", correct: true },
          { answer: "Múnich", correct: false },
          { answer: "Hamburgo", correct: false },
          { answer: "Colonia", correct: false },
        ],
      }
    ];


    axios.get.mockResolvedValue({ data: questions });

    render(
        <BrowserRouter>
          <AuthContext.Provider value={{ isLoggedIn: true }}>
            <Jugar />
          </AuthContext.Provider>
        </BrowserRouter>
    );

    // Espera a que el texto esperado aparezca en el documento
    await waitFor(() => {
      expect(screen.getByText(/¿Cuál es la capital de Alemania?/i)).toBeInTheDocument();
      expect(screen.getByText(/Berlín/i)).toBeInTheDocument();
      expect(screen.getByText(/Múnich/i)).toBeInTheDocument();
      expect(screen.getByText(/Hamburgo/i)).toBeInTheDocument();
      expect(screen.getByText(/Colonia/i)).toBeInTheDocument();
    });
  });
});
