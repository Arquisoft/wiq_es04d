import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';
import {AuthProvider} from "../../AuthContext";
import {MemoryRouter} from "react-router-dom";

const mockAxios = new MockAdapter(axios);

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should log in successfully', async () => {
    render(
        <MemoryRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Nombre de Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const loginButton = screen.getByRole('button', { name: /Entrar/i });

    // Asegurando que el token mockeado tenga un formato correcto
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    mockAxios.onPost('http://localhost:8000/login').reply(200, { token: mockToken });

    // Simulate user input
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      // Asumiendo que hay algún indicador de éxito en tu aplicación al loguearse correctamente
      expect(screen.getByText(/Inicio de sesión exitoso/i)).toBeInTheDocument();
    });
  });

  it('should handle error when logging in', async () => {
    render(
        <MemoryRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Nombre de Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const loginButton = screen.getByRole('button', { name: /Entrar/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Unauthorized' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });

  });
});