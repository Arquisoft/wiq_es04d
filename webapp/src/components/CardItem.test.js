import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardItem from './CardItem';

describe('Componente CardItem', () => {
    const mockProps = {
        path: '/test-path',
        label: 'Test Label',
        src: 'test-img.jpg',
        text: 'Test Text'
    };

    test('Renderiza correctamente con los props dados', () => {
        render(
            <BrowserRouter>
                <CardItem {...mockProps} />
            </BrowserRouter>
        );

        // Verifica que el componente Link lleve a la ruta correcta
        expect(screen.getByRole('link')).toHaveAttribute('href', mockProps.path);

        // Verifica que la imagen tenga el src correcto y alt text vacío
        expect(screen.getByRole('img')).toHaveAttribute('src', mockProps.src);
        expect(screen.getByRole('img')).toHaveAttribute('alt', '');

        // Verifica que el texto sea correcto
        expect(screen.getByText(mockProps.text)).toBeInTheDocument();

        // Encuentra el elemento por su atributo data-category usando mockProps.label
        // y verifica que el contenido sea correcto
        const figure = document.querySelector(`[data-category='${mockProps.label}']`);
        expect(figure).toBeInTheDocument();
    });
});
