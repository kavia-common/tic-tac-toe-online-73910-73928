import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game title and board', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByRole('grid', { name: /Tic Tac Toe Board/i })).toBeInTheDocument();
});

test('shows initial status Turn', () => {
  render(<App />);
  expect(screen.getByText(/Turn:\s*[XO]/i)).toBeInTheDocument();
});
