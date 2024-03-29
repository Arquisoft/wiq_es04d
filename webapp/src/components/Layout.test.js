import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';

// Mock del componente Navbar para controlar su salida en el test
jest.mock('./Navbar', () => () => <div data-testid="navbar">Navbar</div>);

describe('Componente Layout', () => {
    test('Renderiza el Navbar y el contenido de children correctamente', () => {
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
    });
});
