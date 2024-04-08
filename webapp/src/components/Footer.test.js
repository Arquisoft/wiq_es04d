import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer';

const renderWithRouter = (component) => {
    return { ...render(<Router>{component}</Router>) }
}

describe('Footer Component', () => {
    it('should render without crash', () => {
        renderWithRouter(<Footer />);
        expect(screen.getByText('API Doc')).toBeInTheDocument();
        expect(screen.getByText('WIQ_ES04D')).toBeInTheDocument();
        expect(screen.getByText('About us')).toBeInTheDocument();
    });

    it('should have correct link for API Doc', () => {
        renderWithRouter(<Footer />);
        const apiDocLink = screen.getByText('API Doc');
        expect(apiDocLink).toHaveAttribute('href', expect.stringContaining('/api-doc'));
    });

    it('should have correct link for WIQ_ES04D', () => {
        renderWithRouter(<Footer />);
        const wiqLink = screen.getByText('WIQ_ES04D');
        expect(wiqLink).toHaveAttribute('href', 'https://arquisoft.github.io/wiq_es04c/');
    });

    it('should have correct link for About Us', () => {
        renderWithRouter(<Footer />);
        const aboutUsLink = screen.getByRole('link', { name: 'About us' });
        expect(aboutUsLink).toHaveAttribute('href', '/aboutus');
    });
});
