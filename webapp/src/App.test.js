import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to wiq_es04d/i);
  expect(linkElement).toBeInTheDocument();
});
