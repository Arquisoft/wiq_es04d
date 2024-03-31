import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Error404Page from './Error404Page';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
describe('Error404Page Tests', () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        mockNavigate.mockClear();
    });

    test('renders 404 message', () => {
        render(
            <BrowserRouter>
                <Error404Page />
            </BrowserRouter>
        );

        // Verifica que el mensaje de 404 esté presente
        expect(screen.getByText(/404 - ¡Ups! Te quedaste sin oxígeno/i)).toBeInTheDocument();
        expect(screen.getByText(/La página que estas buscando está fuera de nuestro alcance/i)).toBeInTheDocument();
    });
    test('Go home after 15 seconds', () => {
        render(
            <BrowserRouter>
                <Error404Page initialCountdown={0} />
            </BrowserRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });



});

async function wait(milliseconds) {
    jest.advanceTimersByTime(milliseconds);
}
