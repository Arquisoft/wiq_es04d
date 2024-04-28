import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUser from './AddUser';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import axios from 'axios';

jest.mock('axios');
const mockHandleLogin = jest.fn();

function renderAddUser() {
    return render(
        <BrowserRouter>
            <AuthContext.Provider value={{ handleLogin: mockHandleLogin }}>
                <AddUser />
            </AuthContext.Provider>
        </BrowserRouter>
    );
}

function fillAndSubmitForm(username, password) {
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: username } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: password } });
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));
}

test('renderiza el formulario de registro', () => {
    renderAddUser();
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
});

test('Errores de validacion al crear una nueva cuenta', async () => {
    renderAddUser();
    fillAndSubmitForm('abc', '12345678');

    await waitFor(() => {
        expect(screen.getByText(/el nombre de usuario debe tener al menos 4 caracteres/i)).toBeInTheDocument();
    });
});

test('La contraseña debe tener al menos 8 caracteres', async () => {
    renderAddUser();
    fillAndSubmitForm('testuser', 'abc');

    await waitFor(() => {
        expect(screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
    });
});

test('La contraseña debe contener al menos una letra mayúscula', async () => {
    renderAddUser();
    fillAndSubmitForm('testuser', 'abcdefgh');

    await waitFor(() => {
        expect(screen.getByText(/la contraseña debe contener al menos una letra mayúscula/i)).toBeInTheDocument();
    });
});

test('La contraseña debe contener al menos un número', async () => {
    renderAddUser();
    fillAndSubmitForm('testuser', 'Abcdefgh');

    await waitFor(() => {
        expect(screen.getByText(/la contraseña debe contener al menos un número/i)).toBeInTheDocument();
    });
});

test('Registro exitoso de usuario', async () => {
    axios.post.mockImplementation((url) => {
        if (url.includes('/adduser')) {
            return Promise.resolve({ status: 200 });
        } else if (url.includes('/login')) {
            return Promise.resolve({ data: { token: 'fakeToken123' } });
        }
    });

    renderAddUser();
    fillAndSubmitForm('validUser', 'Valid1234');

    await waitFor(() => {
        expect(screen.getByText('Usuario añadido correctamente')).toBeInTheDocument();
    });

    // Verificar redireccionamiento a la página inicial
    expect(window.location.pathname).toBe('/');
});
