import { useMemo, useState } from 'react';
import { calculateWinner, isBoardFull } from '../utils/gameLogic';

/**
 * Custom hook managing Tic Tac Toe game logic:
 * - Board state
 * - Current turn
 * - Winner and winning line
 * - Draw detection
 * - Actions: play, reset, set starting player
 */
// PUBLIC_INTERFACE
export default function useTicTacToe(initialStarter = 'X') {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(initialStarter === 'X');

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = !winner && isBoardFull(squares);

  // PUBLIC_INTERFACE
  const reset = (starter = 'X') => {
    setSquares(Array(9).fill(null));
    setXIsNext(starter === 'X');
  };

  // PUBLIC_INTERFACE
  const setStarter = (starter) => {
    setXIsNext(starter === 'X');
  };

  // PUBLIC_INTERFACE
  const play = (index) => {
    if (winner || squares[index]) return;
    setSquares(prev => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = xIsNext ? 'X' : 'O';
      return next;
    });
    setXIsNext(prev => !prev);
  };

  const statusText = (() => {
    if (winner) {
      return `Winner: ${winner}`;
    }
    if (isDraw) {
      return 'It’s a draw!';
    }
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  })();

  return {
    squares,
    xIsNext,
    winner,
    winningLine: line,
    isDraw,
    statusText,
    play,
    reset,
    setStarter,
  };
}
