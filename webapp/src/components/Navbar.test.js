import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../AuthContext';

// Función mock para simular el contexto de autenticación
const mockContext = (isLoggedIn) => ({
    isLoggedIn
});

// Función de utilidad para renderizar el Navbar bajo diferentes condiciones
const renderNavbar = (contextValue, width = 1024) => {
    window.innerWidth = width; // Simula el ancho de la ventana para pruebas de responsividad
    return render(
        <AuthContext.Provider value={mockContext(contextValue)}>
            <Router>
                <Navbar />
            </Router>
        </AuthContext.Provider>
    );
};

describe('Componente Navbar', () => {
    test('Se muestra correctamente cuando el usuario está logueado', () => {
        renderNavbar(true);

        expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Historial' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Jugar' })).toBeInTheDocument();
    });

    test('Reacciona correctamente al redimensionar la ventana cuando el usuario está logueado', () => {
        renderNavbar(true, 500);

        fireEvent.click(screen.getByRole('button', { name: /Menu toggle/i }));
        expect(screen.getByRole('link', { name: 'Salir' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Historial' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Jugar' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Salir' })).not.toBeInTheDocument();
    });

    test('Se muestra correctamente cuando el usuario no está logueado', () => {
        renderNavbar(false);
        expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Salir' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Historial' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Jugar' })).not.toBeInTheDocument();
    });
    test('Reacciona correctamente al redimensionar la ventana cuando el usuario no está logueado', () => {
        renderNavbar(false, 500);

        fireEvent.click(screen.getByRole('button', { name: /Menu toggle/i }));
        expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Registrarse' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Historial' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Jugar' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Registrarse' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Entrar' })).not.toBeInTheDocument();
    });
});
