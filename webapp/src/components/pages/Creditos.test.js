import React from 'react';
import { render, screen } from '@testing-library/react';
import Creditos from './Creditos'; // Asegúrate de que la ruta del import es correcta

describe('Componente Creditos', () => {
    test('debería contener un video que se auto-reproduce', () => {
        render(<Creditos />);
        const videoElement = screen.getByTestId('creditos-video');
        expect(videoElement).toBeInTheDocument();
        expect(videoElement).toHaveAttribute('autoPlay');
    });
});
