import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Logout from './Logout';


// Mocks para las funciones que serán utilizadas por el componente
const mockHandleLogout = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Prueba para el componente Logout
describe('Logout Component', () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        mockHandleLogout.mockClear();
        mockNavigate.mockClear();
    });

    it('Llama a handleLogout y navega a la página de inicio en Mount', () => {
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ handleLogout: mockHandleLogout }}>
                    <Logout />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        // Verificar si handleLogout y navigate fueron llamados correctamente
        expect(mockHandleLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
