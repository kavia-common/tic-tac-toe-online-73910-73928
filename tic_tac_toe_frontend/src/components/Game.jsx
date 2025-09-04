import React, { useState } from 'react';
import useTicTacToe from '../hooks/useTicTacToe';
import Board from './Board';

/**
 * Game component manages UI layout for the Tic Tac Toe game:
 * - Header with title and controls
 * - Status display
 * - Board
 * - Footer with meta and reset
 */
// PUBLIC_INTERFACE
export default function Game() {
  const [starter, setStarter] = useState('X');
  const {
    squares,
    xIsNext,
    winner,
    winningLine,
    isDraw,
    statusText,
    play,
    reset,
    setStarter: setStarterInGame,
  } = useTicTacToe(starter);

  const handleReset = () => {
    reset(starter);
  };

  const toggleStarter = () => {
    const nextStarter = starter === 'X' ? 'O' : 'X';
    setStarter(nextStarter);
    setStarterInGame(nextStarter);
  };

  const gameOver = Boolean(winner) || isDraw;

  return (
    <div className="game-shell" aria-live="polite">
      <div className="header">
        <div className="brand">
          <h1 className="title">Tic Tac Toe</h1>
          <span className="badge">2-Player Local</span>
        </div>
        <div className="controls">
          <button
            type="button"
            className="btn"
            onClick={toggleStarter}
            aria-label="Toggle starting player"
            title="Toggle starting player"
          >
            Start: {starter}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleReset}
            aria-label="Reset the game"
            title="Reset"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="status">
        <div className="status-text">{statusText}</div>
        <div className="turn" aria-label="Current turn">
          <span>Turn</span>
          <span className={`mark ${xIsNext ? 'x' : 'o'}`}>{xIsNext ? 'X' : 'O'}</span>
        </div>
      </div>

      <Board
        squares={squares}
        onPlay={play}
        disabled={gameOver}
        winningLine={winningLine}
      />

      <div className="footer">
        <div className="meta">Theme: Dark • Primary #1976D2 • Accent #E91E63 • Secondary #FFC107</div>
        {gameOver && (
          <button
            type="button"
            className="btn btn-accent"
            onClick={handleReset}
            aria-label="Play again"
            title="Play again"
          >
            Play again
          </button>
        )}
      </div>
    </div>
  );
}
