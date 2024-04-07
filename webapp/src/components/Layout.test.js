import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';

// Mock del componente Navbar para controlar su salida en el test
jest.mock('./Navbar', () => () => <div data-testid="navbar">Navbar</div>);

// Mock del componente Footer para controlar su salida en el test
jest.mock('./Footer', () => () => <div data-testid="footer">Footer</div>);

describe('Componente Layout', () => {
    test('Renderiza el Navbar, el contenido de children y el Footer correctamente', () => {
        const childText = 'Contenido de prueba';
        render(
            <Layout>
                <div>{childText}</div>
            </Layout>
        );

        // Verifica que el Navbar se renderiza correctamente
        expect(screen.getByTestId('navbar')).toBeInTheDocument();

        // Verifica que el contenido de children se renderiza correctamente
        expect(screen.getByText(childText)).toBeInTheDocument();

        // Verifica que el Footer se renderiza correctamente
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
});
