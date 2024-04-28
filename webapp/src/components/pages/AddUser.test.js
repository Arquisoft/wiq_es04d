import { render, screen } from '@testing-library/react';
import AddUser from './AddUser';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
jest.mock('axios');
const mockHandleLogin = jest.fn();

test('renderiza el formulario de registro', () => {
  render(
      <BrowserRouter>
        <AuthContext.Provider value={{ handleLogin: mockHandleLogin }}>
          <AddUser />
        </AuthContext.Provider>
      </BrowserRouter>
  );

  expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
});
test('Errores de validacion al crear una nueva cuenta', async () => {
  render(
      <BrowserRouter>
        <AuthContext.Provider value={{ handleLogin: mockHandleLogin }}>
          <AddUser />
        </AuthContext.Provider>
      </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'abc' } });
  fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

  await waitFor(() => {
    expect(screen.getByText(/el nombre de usuario debe tener al menos 4 caracteres/i)).toBeInTheDocument();
  });
});

test('La contraseña debe tener al menos 8 caracteres', async () => {
  render(
      <BrowserRouter>
        <AuthContext.Provider value={{ handleLogin: mockHandleLogin }}>
          <AddUser />
        </AuthContext.Provider>
      </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'abc' } });
  fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

  await waitFor(() => {
    expect(screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
  });
});

test('El user debe tener al menos 4 caracteres', async () => {
  render(
      <BrowserRouter>
        <AuthContext.Provider value={{ handleLogin: mockHandleLogin }}>
          <AddUser />
        </AuthContext.Provider>
      </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'abcdefgh' } });
  fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

  await waitFor(() => {
    expect(screen.getByText(/la contraseña debe contener al menos una letra mayúscula/i)).toBeInTheDocument();
  });
});

test('La contraseña debe contener al menos un número', async () => {
  render(
      <BrowserRouter>
        <AuthContext.Provider value={{ handleLogin: mockHandleLogin }}>
          <AddUser />
        </AuthContext.Provider>
      </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'Abcdefgh' } });
  fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

  await waitFor(() => {
    expect(screen.getByText(/la contraseña debe contener al menos un número/i)).toBeInTheDocument();
  });
});
test('Registro exitoso de usuario', async () => {
  // Simular respuesta exitosa de la API
  axios.post.mockImplementation((url) => {
    if (url.includes('/adduser')) {
      return Promise.resolve({ status: 200 });
    } else if (url.includes('/login')) {
      return Promise.resolve({ data: { token: 'fakeToken123' } });
    }
  });

  render(
      <BrowserRouter>
        <AuthContext.Provider value={{ handleLogin: mockHandleLogin }}>
          <AddUser />
        </AuthContext.Provider>
      </BrowserRouter>
  );

  // Llenar el formulario con datos válidos
  fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'validUser' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'Valid1234' } });
  fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

  // Esperar que se llame a handleLogin y luego navegar a '/'
  await waitFor(() => {
    expect(screen.getByText('Usuario añadido correctamente')).toBeInTheDocument();
  });

  // Verificar redireccionamiento a la página inicial
  expect(window.location.pathname).toBe('/');
});

