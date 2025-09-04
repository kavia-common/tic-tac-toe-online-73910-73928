import React, { useMemo, useState } from 'react';
import useTicTacToe from '../hooks/useTicTacToe';
import Board from './Board';
import { AI_LEVELS } from '../utils/ai';

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
  const [mode, setMode] = useState('PVC'); // 'PVP' | 'PVC'
  const [aiMark, setAiMark] = useState('O'); // Which mark the AI uses
  const [aiLevel, setAiLevel] = useState(AI_LEVELS.SIMPLE);

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
  } = useTicTacToe(starter, { mode, aiMark, aiLevel });

  const handleReset = () => {
    reset(starter);
  };

  const toggleStarter = () => {
    const nextStarter = starter === 'X' ? 'O' : 'X';
    setStarter(nextStarter);
    setStarterInGame(nextStarter);
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'PVP' ? 'PVC' : 'PVP'));
  };

  const toggleAiMark = () => {
    setAiMark(prev => (prev === 'X' ? 'O' : 'X'));
  };

  const gameOver = Boolean(winner) || isDraw;
  const modeLabel = mode === 'PVP' ? '2-Player Local' : 'Player vs Computer';

  // When in PVC, disable board if it's AI's turn
  const boardDisabled = useMemo(() => {
    if (gameOver) return true;
    if (mode !== 'PVC') return false;
    const turnMark = xIsNext ? 'X' : 'O';
    return turnMark === aiMark;
  }, [mode, xIsNext, aiMark, gameOver]);

  return (
    <div className="game-shell" aria-live="polite">
      <div className="header">
        <div className="brand">
          <h1 className="title">Tic Tac Toe</h1>
          <span className="badge">{modeLabel}</span>
        </div>
        <div className="controls">
          <button
            type="button"
            className="btn"
            onClick={toggleMode}
            aria-label="Toggle game mode"
            title="Toggle game mode"
          >
            Mode: {mode === 'PVP' ? 'PVP' : 'PVC'}
          </button>
          {mode === 'PVC' && (
            <button
              type="button"
              className="btn"
              onClick={toggleAiMark}
              aria-label="Toggle AI mark"
              title="Toggle AI mark"
            >
              AI: {aiMark}
            </button>
          )}
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
        disabled={boardDisabled}
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
