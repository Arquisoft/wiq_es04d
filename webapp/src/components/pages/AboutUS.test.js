import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutUS from './AboutUS';
import {BrowserRouter as Router} from "react-router-dom";

// Describimos la suite de pruebas para el componente AboutUS
describe('AboutUS Component', () => {

    test('renders the header text', () => {

        render(
            <Router>
                <AboutUS />
            </Router>
        );
        // Verificamos que el texto del encabezado esté presente en el documento
        expect(screen.getByText(/Conoce las áreas clave manejadas por los estudiantes en el proyecto WIQ/i)).toBeInTheDocument();
    });

    // Test para verificar si el componente renderiza los elementos CardItem correctamente
    test('renders the correct number of CardItem elements', () => {
        render(
            <Router>
                <AboutUS />
            </Router>
        );
        // Usamos queryAllByTestId para seleccionar todos los elementos con el data-testid "card-item"
        const cardItems = screen.queryAllByTestId('card-item');
        // Verificamos que el número de elementos encontrados sea el esperado
        expect(cardItems).toHaveLength(4); // Cambia el número esperado según cuántos CardItem esperas renderizar
    });
});
