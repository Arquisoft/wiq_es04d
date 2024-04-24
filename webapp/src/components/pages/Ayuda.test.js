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

    test('renders Help', async () => {
        render(
            <BrowserRouter>
                <Ayuda />
            </BrowserRouter>
        );

        // Utiliza findByText para esperar de forma asíncrona a que el texto esté disponible
        const ayudaTitle = await screen.findByText(/AYUDA \(WIQ 4D\)/i);
        expect(ayudaTitle).toBeInTheDocument();

        // Verifica las secciones
        expect(await screen.findByText(/Registro e Inicio de Sesión/i)).toBeInTheDocument();
        expect(await screen.findByText(/Cómo Jugar/i)).toBeInTheDocument();
        expect(await screen.findByText(/Historial y Ranking/i)).toBeInTheDocument();
        expect(await screen.findByText(/API REST de la aplicación/i)).toBeInTheDocument();
        expect(await screen.findByText(/Otras Funcionalidades/i)).toBeInTheDocument();
        expect(await screen.findByText(/Contacto/i)).toBeInTheDocument();

        // Verifica el video
        expect(screen.getByTestId('help-video')).toHaveAttribute('src', '/videos/help.mp4');

        // Verifica los links
        expect(await screen.findByText('uo287746@uniovi.es')).toBeInTheDocument();
        expect(await screen.findByText('uo291060@uniovi.es')).toBeInTheDocument();
        expect(await screen.findByText('uo277269@uniovi.es')).toBeInTheDocument();
    });



});

async function wait(milliseconds) {
    jest.advanceTimersByTime(milliseconds);
}
