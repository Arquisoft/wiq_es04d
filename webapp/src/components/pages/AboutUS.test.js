import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutUS from './AboutUS';
import {BrowserRouter as Router} from "react-router-dom";

describe('AboutUS Component', () => {

    beforeEach(() => {
        render(
            <Router>
                <AboutUS />
            </Router>
        );
    });

    test('renders the header text and the card items', () => {
        expect(screen.getByText(/Conoce las áreas clave manejadas por los estudiantes en el proyecto WIQ/i)).toBeInTheDocument();
        const cardItems = screen.queryAllByTestId('card-item');
        expect(cardItems).toHaveLength(5);
    });

    test('links point to the correct paths', () => {
        const creditosLink = screen.getByText(/Créditos de la Aplicación/i).closest('a');
        expect(creditosLink).toHaveAttribute('href', '/creditos');

        const githubLink = screen.getByText(/Explora nuestro código en GitHub y contribuye al desarrollo del proyecto WIQ./i).closest('a');
        expect(githubLink).toHaveAttribute('href', 'https://github.com/Arquisoft/wiq_es04d');

        const databaseLink = screen.getByText(/Implementación de soluciones de bases de datos para gestionar eficientemente la información./i).closest('a');
        expect(databaseLink).toHaveAttribute('href', 'https://github.com/Arquisoft/wiq_es04d/wiki/ADR-4-%E2%80%90-Base-de-datos');

        const documentationLink = screen.getByText(/Creación de documentación detallada para facilitar la comprensión y el uso del proyecto./i).closest('a');
        expect(documentationLink).toHaveAttribute('href', 'https://arquisoft.github.io/wiq_es04d/');

        const apiLink = screen.getByText(/Desarrollo de la lógica de integración con la API de Wikidata para enriquecer nuestro proyecto./i).closest('a');
        expect(apiLink).toHaveAttribute('href', `${process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000'}/api-doc`);
    });
    test('each CardItem has the correct label', () => {
        // Asegúrate de que ya has renderizado el componente en un beforeEach o directamente en el test
        const figures = document.querySelectorAll('figure[data-category]');
        const expectedLabels = ['Créditos', 'GitHub WIQ4D', 'Base de Datos', 'Documentación', 'API de Wikidata'];

        expect(figures.length).toBe(expectedLabels.length); // Verifica que el número de elementos coincide
        figures.forEach((figure, index) => {
            expect(figure.getAttribute('data-category')).toBe(expectedLabels[index]);
        });
    });
    test('each CardItem has the correct src', () => {
        const images = document.querySelectorAll('img[src]'); // Correctamente selecciona las imágenes
        const expectedSrcs = ['images/creditos.jpg', 'images/github.jpg', 'images/database.jpg', 'images/documentation.jpg', 'images/api-logic.jpg'];

        expect(images.length).toBe(expectedSrcs.length);
        images.forEach((img, index) => {
            expect(img.src).toContain(expectedSrcs[index]);
        });
    });




});
