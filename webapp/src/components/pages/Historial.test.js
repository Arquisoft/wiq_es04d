import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Historial from './Historial';
import { AuthContext } from '../../AuthContext'; // Asegúrate de que la ruta sea correcta
import { BrowserRouter } from 'react-router-dom';

// Mock de useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Historial Component Tests', () => {
  test('redirects to login if not logged in', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ isLoggedIn: false }}>
          <Historial />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Verifica que se llamó a navigate con '/login'
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
