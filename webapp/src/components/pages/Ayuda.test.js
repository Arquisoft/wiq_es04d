import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Ayuda from './Ayuda';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Help Tests', () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        mockNavigate.mockClear();
    });

    test('renders Help', () => {
        render(
            <BrowserRouter>
                <Ayuda />
            </BrowserRouter>
        );

        // Verifica que estan los elementos
        expect(screen.getByText(/AYUDA (WIQ 4D)/i)).toBeInTheDocument();

       // verifica las secciones
       expect(screen.getByText(/Registro e Inicio de Sesión/i)).toBeInTheDocument();
       expect(screen.getByText(/Cómo Jugar/i)).toBeInTheDocument();
       expect(screen.getByText(/Historial y Ranking/i)).toBeInTheDocument();
       expect(screen.getByText(/API REST de la aplicación/i)).toBeInTheDocument();
       expect(screen.getByText(/Otras Funcionalidades/i)).toBeInTheDocument();
       expect(screen.getByText(/Contacto/i)).toBeInTheDocument();

       // verifica el video
       expect(screen.getByTestId('help-video')).toHaveAttribute('src', '/videos/help.mp4');

       // verifica los links
       expect(screen.getByText('uo287746@uniovi.es')).toBeInTheDocument();
       expect(screen.getByText('uo291060@uniovi.es')).toBeInTheDocument();
       expect(screen.getByText('uo277269@uniovi.es')).toBeInTheDocument();
    });


});

async function wait(milliseconds) {
    jest.advanceTimersByTime(milliseconds);
}
