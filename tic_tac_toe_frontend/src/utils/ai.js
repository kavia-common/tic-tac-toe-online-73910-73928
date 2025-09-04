export const AI_LEVELS = {
  RANDOM: 'RANDOM',
  SIMPLE: 'SIMPLE',
};

/**
 * Returns the indices of empty cells.
 * @param {Array<string|null>} squares
 * @returns {number[]}
 */
export function getEmptyCells(squares) {
  const res = [];
  for (let i = 0; i < squares.length; i += 1) {
    if (!squares[i]) res.push(i);
  }
  return res;
}

/**
 * Attempt to find a winning move for the given mark.
 * @param {Array<string|null>} squares
 * @param {'X'|'O'} mark
 * @param {Array<number[]>} lines
 * @returns {number|null}
 */
export function findWinningMove(squares, mark, lines) {
  for (const [a, b, c] of lines) {
    const line = [a, b, c];
    const values = line.map(i => squares[i]);
    const countMark = values.filter(v => v === mark).length;
    const countEmpty = values.filter(v => !v).length;
    if (countMark === 2 && countEmpty === 1) {
      const idx = line.find(i => !squares[i]);
      return idx ?? null;
    }
  }
  return null;
}

/**
 * Simple AI that:
 * 1) Plays winning move if available
 * 2) Blocks opponent's immediate win
 * 3) Otherwise picks a random empty spot
 *
 * @param {Array<string|null>} squares
 * @param {'X'|'O'} aiMark
 * @param {'RANDOM'|'SIMPLE'} level
 * @param {Array<number[]>} lines - winning line combinations
 * @returns {number|null} index to play or null if none
 */
// PUBLIC_INTERFACE
export function computeAiMove(squares, aiMark, level, lines) {
  const empty = getEmptyCells(squares);
  if (empty.length === 0) return null;

  if (level === AI_LEVELS.SIMPLE) {
    // try to win
    const winIdx = findWinningMove(squares, aiMark, lines);
    if (winIdx != null) return winIdx;

    // try to block
    const opponent = aiMark === 'X' ? 'O' : 'X';
    const blockIdx = findWinningMove(squares, opponent, lines);
    if (blockIdx != null) return blockIdx;
  }

  // random fallback
  const r = Math.floor(Math.random() * empty.length);
  return empty[r] ?? null;
}
