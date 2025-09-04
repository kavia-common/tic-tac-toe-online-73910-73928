import React from 'react';
import './App.css';
import Game from './components/Game';

/**
 * Root application component that renders the Tic Tac Toe game.
 * Applies the dark theme and wraps the core Game component.
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app-root" data-theme="dark">
      <Game />
    </div>
  );
}

export default App;
