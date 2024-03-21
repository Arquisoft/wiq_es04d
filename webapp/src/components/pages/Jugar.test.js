import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Jugar from './Jugar';
import { AuthContext } from '../../AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock de useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

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

  // Aquí podrías añadir más pruebas relacionadas con el comportamiento del componente al estar logueado,
  // como verificar la carga inicial de preguntas o el comportamiento del temporizador.
});
