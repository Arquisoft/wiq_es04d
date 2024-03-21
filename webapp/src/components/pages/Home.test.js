import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';

// Envuelve el componente en un Router para manejar el uso de 'to' en <Button />
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('Home Component Tests', () => {
  test('renders Home component correctly', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('heading', { name: /wiq/i })).toBeInTheDocument();
    expect(screen.getByText(/what are you waiting for\?/i)).toBeInTheDocument();
    expect(screen.getByText(/jugar/i)).toBeInTheDocument();
  });

  test('loads and plays the video automatically', () => {
    renderWithRouter(<Home />);
    const video = screen.getByTestId('home-video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/videos/home.mp4');
  });

});
