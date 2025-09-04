import React from 'react';

/**
 * Board component renders a 3x3 grid of cells.
 * Props:
 * - squares: string[] of length 9 with values 'X' | 'O' | null
 * - onPlay: function(index) to play at index
 * - disabled: boolean to disable interactions
 * - winningLine: number[] | null - indices of winning cells for highlight
 */
export default function Board({ squares, onPlay, disabled = false, winningLine = null }) {
  const renderCell = (i) => {
    const value = squares[i];
    const isWinnerCell = winningLine?.includes(i);
    const classes = [
      'cell',
      value === 'X' ? 'x' : '',
      value === 'O' ? 'o' : '',
      isWinnerCell ? 'winner' : '',
      disabled ? 'disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        key={i}
        type="button"
        className={classes}
        aria-label={`Cell ${i + 1}, ${value ? value : 'empty'}`}
        onClick={() => onPlay(i)}
        disabled={disabled || Boolean(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe Board">
      {Array.from({ length: 9 }).map((_, i) => renderCell(i))}
    </div>
  );
}
