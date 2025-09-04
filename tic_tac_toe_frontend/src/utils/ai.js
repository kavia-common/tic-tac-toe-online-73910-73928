/**
 * AI difficulty levels from 1 (easiest) to 5 (hardest).
 */
export const AI_LEVELS = {
  LEVEL_1: 1, // random
  LEVEL_2: 2, // simple (win, block, else random)
  LEVEL_3: 3, // prioritize center/corners + simple tactics
  LEVEL_4: 4, // lookahead with shallow minimax (depth-limited)
  LEVEL_5: 5, // full minimax (unbeatable)
};

/**
 * Returns the indices of empty cells.
 * @param {Array<string|null>} squares
 * @returns {number[]}
 */
// PUBLIC_INTERFACE
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
// PUBLIC_INTERFACE
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
 * Choose center if available.
 */
function chooseCenter(squares) {
  return squares[4] ? null : 4;
}

/**
 * Choose a random corner if available.
 */
function chooseRandomCorner(squares) {
  const corners = [0, 2, 6, 8].filter(i => !squares[i]);
  if (corners.length === 0) return null;
  const r = Math.floor(Math.random() * corners.length);
  return corners[r];
}

/**
 * Apply a move on a copy and return it.
 */
function makeMove(board, idx, mark) {
  const next = [...board];
  next[idx] = mark;
  return next;
}

/**
 * Score terminal states for minimax.
 */
function evaluateWinner(board, lines, aiMark) {
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      if (board[a] === aiMark) return 10;
      return -10;
    }
  }
  return 0;
}

function isFull(board) {
  return board.every(Boolean);
}

/**
 * Minimax with optional depth limit. Returns { score, move }.
 */
function minimax(board, lines, aiMark, currentMark, depth, maxDepth = Infinity) {
  const scoreNow = evaluateWinner(board, lines, aiMark);
  if (scoreNow === 10 || scoreNow === -10) {
    // Sooner win is better, later loss is better
    return { score: scoreNow - (maxDepth === Infinity ? 0 : (10 - depth)) * Math.sign(scoreNow), move: null };
  }
  if (isFull(board) || depth >= maxDepth) {
    return { score: 0, move: null };
  }

  const isMaximizing = currentMark === aiMark;
  let best = { score: isMaximizing ? -Infinity : Infinity, move: null };
  const empties = getEmptyCells(board);

  for (const idx of empties) {
    const next = makeMove(board, idx, currentMark);
    const nextMark = currentMark === 'X' ? 'O' : 'X';
    const result = minimax(next, lines, aiMark, nextMark, depth + 1, maxDepth);

    if (isMaximizing) {
      if (result.score > best.score) {
        best = { score: result.score, move: idx };
      }
    } else {
      if (result.score < best.score) {
        best = { score: result.score, move: idx };
      }
    }
  }
  return best;
}

/**
 * Heuristic level that prefers center, then winning/blocking, then corners, then random edges.
 */
function heuristicLevelMove(squares, aiMark, lines) {
  // Win
  const win = findWinningMove(squares, aiMark, lines);
  if (win != null) return win;
  // Block
  const opponent = aiMark === 'X' ? 'O' : 'X';
  const block = findWinningMove(squares, opponent, lines);
  if (block != null) return block;
  // Center
  const center = chooseCenter(squares);
  if (center != null) return center;
  // Corner
  const corner = chooseRandomCorner(squares);
  if (corner != null) return corner;
  // Random
  const empty = getEmptyCells(squares);
  const r = Math.floor(Math.random() * empty.length);
  return empty[r] ?? null;
}

/**
 * Compute AI move for designated difficulty level.
 *
 * Levels:
 * 1 - Random
 * 2 - Simple (win → block → random)
 * 3 - Heuristic (win → block → center → corner → random)
 * 4 - Depth-limited minimax (good, fast)
 * 5 - Full minimax (optimal/unbeatable on 3x3)
 *
 * @param {Array<string|null>} squares
 * @param {'X'|'O'} aiMark
 * @param {1|2|3|4|5} level
 * @param {Array<number[]>} lines - winning line combinations
 * @returns {number|null} index to play or null if none
 */
// PUBLIC_INTERFACE
export function computeAiMove(squares, aiMark, level, lines) {
  const empty = getEmptyCells(squares);
  if (empty.length === 0) return null;

  // Level 1: Random
  if (level === AI_LEVELS.LEVEL_1) {
    const r = Math.floor(Math.random() * empty.length);
    return empty[r] ?? null;
  }

  // Level 2: Simple (win/block/random)
  if (level === AI_LEVELS.LEVEL_2) {
    const winIdx = findWinningMove(squares, aiMark, lines);
    if (winIdx != null) return winIdx;

    const opponent = aiMark === 'X' ? 'O' : 'X';
    const blockIdx = findWinningMove(squares, opponent, lines);
    if (blockIdx != null) return blockIdx;

    const r = Math.floor(Math.random() * empty.length);
    return empty[r] ?? null;
  }

  // Level 3: Heuristic
  if (level === AI_LEVELS.LEVEL_3) {
    return heuristicLevelMove(squares, aiMark, lines);
  }

  // Level 4: Shallow minimax (depth limit)
  if (level === AI_LEVELS.LEVEL_4) {
    // Limit depth to keep it snappy even mid-game.
    const turn = squares.filter(Boolean).length; // number of filled cells
    // More empty cells => shallower to keep perf; later game can look deeper.
    const maxDepth = turn <= 2 ? 3 : 5;
    const currentTurn = (squares.filter(Boolean).length % 2 === 0) ? 'X' : 'O';
    const { move } = minimax(squares, lines, aiMark, currentTurn, 0, maxDepth);
    if (move != null) return move;
    return heuristicLevelMove(squares, aiMark, lines);
  }

  // Level 5: Full minimax (unbeatable)
  if (level === AI_LEVELS.LEVEL_5) {
    const currentTurn = (squares.filter(Boolean).length % 2 === 0) ? 'X' : 'O';
    const { move } = minimax(squares, lines, aiMark, currentTurn, 0, Infinity);
    if (move != null) return move;
    // Fallback just in case
    return heuristicLevelMove(squares, aiMark, lines);
  }

  // Default fallback to random
  const r = Math.floor(Math.random() * empty.length);
  return empty[r] ?? null;
}
