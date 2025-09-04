export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Determine the winner of the current board.
 * @param {Array<string|null>} squares - Array of 9 elements 'X' | 'O' | null
 * @returns {{winner: 'X' | 'O' | null, line: number[] | null}}
 */
export function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Returns true if the board is completely filled.
 * @param {Array<string|null>} squares
 * @returns {boolean}
 */
export function isBoardFull(squares) {
  return squares.every(Boolean);
}
