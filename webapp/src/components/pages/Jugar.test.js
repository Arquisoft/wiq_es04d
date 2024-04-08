import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Jugar from './Jugar';
import { AuthContext } from '../../AuthContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock de useNavigate
const mockedNavigate = jest.fn();
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock de axios
jest.mock('axios');

describe('Jugar Component Tests', () => {
  beforeEach(() => {
    // Configura axios.get para devolver las preguntas mockeadas
    axios.get.mockResolvedValue({ data: questions });

    // Asegúrate de mockear axios.post para evitar errores al llamar a .then sobre su retorno
    axios.post.mockResolvedValue({ data: { message: "Historial guardado con éxito" } });
  });

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
      expect(screen.getByText(/Pregunta 1 de 1/i)).toBeInTheDocument();
    });
    const timerBar = document.querySelector('.timer-bar');
    expect(timerBar).toBeInTheDocument();
    expect(timerBar).toHaveStyle('width: 100%');
  });

  test('selects correct answer, clicks next', async () => {
    render(
        <BrowserRouter>
          <AuthContext.Provider value={{ isLoggedIn: true }}>
            <Jugar />
          </AuthContext.Provider>
        </BrowserRouter>
    );

    await waitFor(() => {
      // Asegúrate de que las preguntas se cargaron correctamente
      expect(screen.getByText(/¿Cuál es la capital de Alemania?/i)).toBeInTheDocument();
    });

    // Encuentra y selecciona la respuesta correcta
    const correctAnswer = screen.getByText('Berlín');
    await act(async () => {
      correctAnswer.click();
    });

    // Encuentra y haz clic en el botón de siguiente
    const nextButton = screen.getByText('Siguiente');
    await act(async () => {
      nextButton.click();
    });

    // Como es la última pregunta, el quiz debe finalizar y mostrar el contenedor de resultados
    await waitFor(() => {
      // Verifica que se muestre el contenedor de resultados
      expect(screen.getByText('Quiz Finalizado')).toBeInTheDocument();
      // Verifica los aciertos y errores
      expect(screen.getByText('Aciertos: 1')).toBeInTheDocument();
      expect(screen.getByText('Errores: 0')).toBeInTheDocument();
    });
  });
});
