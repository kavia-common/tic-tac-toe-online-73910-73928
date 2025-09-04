import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateWinner, isBoardFull, LINES } from '../utils/gameLogic';
import { AI_LEVELS, computeAiMove } from '../utils/ai';

/**
 * Custom hook managing Tic Tac Toe game logic with optional AI opponent:
 * - Board state
 * - Current turn
 * - Winner and winning line
 * - Draw detection
 * - Actions: play, reset, set starting player
 * - PvC support: when enabled, AI auto-moves after human turns
 */
// PUBLIC_INTERFACE
export default function useTicTacToe(
  initialStarter = 'X',
  options = { mode: 'PVP', aiMark: 'O', aiLevel: AI_LEVELS.LEVEL_2 }
) {
  const { mode = 'PVP', aiMark = 'O', aiLevel = AI_LEVELS.LEVEL_2 } = options || {};
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(initialStarter === 'X');

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = !winner && isBoardFull(squares);

  // Stable refs for options to avoid re-triggering effects unnecessarily
  const modeRef = useRef(mode);
  const aiMarkRef = useRef(aiMark);
  const aiLevelRef = useRef(aiLevel);

  useEffect(() => {
    modeRef.current = mode;
    aiMarkRef.current = aiMark;
    aiLevelRef.current = aiLevel;
  }, [mode, aiMark, aiLevel]);

  const currentTurnMark = xIsNext ? 'X' : 'O';

  // PUBLIC_INTERFACE
  const reset = (starter = 'X') => {
    setSquares(Array(9).fill(null));
    setXIsNext(starter === 'X');
  };

  // PUBLIC_INTERFACE
  const setStarter = (starter) => {
    setXIsNext(starter === 'X');
  };

  // Apply a move at index for the given mark (internal)
  const applyMove = (index, mark) => {
    setSquares(prev => {
      if (prev[index] || winner) return prev;
      const next = [...prev];
      next[index] = mark;
      return next;
    });
    setXIsNext(prev => !prev);
  };

  // PUBLIC_INTERFACE
  const play = (index) => {
    // Human attempts to play
    if (winner || squares[index]) return;

    // In PvC, ensure human only plays when it's their turn
    if (modeRef.current === 'PVC') {
      const humanMark = aiMarkRef.current === 'X' ? 'O' : 'X';
      if (currentTurnMark !== humanMark) return;
      applyMove(index, humanMark);
    } else {
      // PvP mode behavior
      applyMove(index, currentTurnMark);
    }
  };

  // Auto-play AI move if needed after human played
  useEffect(() => {
    if (modeRef.current !== 'PVC') return;
    if (winner || isDraw) return;

    const turn = xIsNext ? 'X' : 'O';
    const aiMarkNow = aiMarkRef.current;

    if (turn === aiMarkNow) {
      // small delay for UX polish
      const t = setTimeout(() => {
        const idx = computeAiMove(squares, aiMarkNow, aiLevelRef.current, LINES);
        if (idx != null) {
          applyMove(idx, aiMarkNow);
        }
      }, 350);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [xIsNext, squares, winner, isDraw]);

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
