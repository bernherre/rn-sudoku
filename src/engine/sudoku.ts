
export type Cell = number | null;
export type Board = Cell[][];

export type Size = 4 | 6;
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

/** Region sizes: for 4x4 => 2x2, for 6x6 => 2x3 */
function regionDims(n: Size): [number, number] {
  if (n === 4) return [2,2];
  return [2,3];
}

export function emptyBoard(n: Size): Board {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => null));
}

function isValid(board: Board, row: number, col: number, val: number): boolean {
  const n = board.length;
  for (let i=0;i<n;i++) {
    if (board[row][i] === val) return false;
    if (board[i][col] === val) return false;
  }
  const [rh, rw] = regionDims(n as Size);
  const r0 = Math.floor(row / rh) * rh;
  const c0 = Math.floor(col / rw) * rw;
  for (let r=0;r<rh;r++) for (let c=0;c<rw;c++) {
    if (board[r0+r][c0+c] === val) return false;
  }
  return true;
}

export function clone(board: Board): Board {
  return board.map(row => row.slice());
}

export function findEmpty(board: Board): [number, number] | null {
  const n = board.length;
  for (let r=0;r<n;r++) {
    for (let c=0;c<n;c++) {
      if (board[r][c] === null) return [r,c];
    }
  }
  return null;
}

export function solve(board: Board): Board | null {
  const n = board.length;
  const spot = findEmpty(board);
  if (!spot) return board;
  const [r,c] = spot;
  const nums = [...Array(n).keys()].map(i => i+1);
  // Simple heuristic: try numbers in random-ish order to vary solutions
  nums.sort(() => Math.random() - 0.5);
  for (const v of nums) {
    if (isValid(board, r, c, v)) {
      board[r][c] = v;
      const solved = solve(board);
      if (solved) return solved;
      board[r][c] = null;
    }
  }
  return null;
}

export function generateSolved(n: Size): Board {
  // Backtracking fill row by row
  const board = emptyBoard(n);
  const nums = [...Array(n).keys()].map(i => i+1);
  function fill(pos=0): boolean {
    if (pos === n*n) return true;
    const r = Math.floor(pos / n), c = pos % n;
    const order = nums.slice().sort(() => Math.random() - 0.5);
    for (const v of order) {
      if (isValid(board, r, c, v)) {
        board[r][c] = v;
        if (fill(pos+1)) return true;
        board[r][c] = null;
      }
    }
    return false;
  }
  if (!fill()) throw new Error('Failed to generate solved board');
  return board;
}

export function countSolutions(board: Board, limit=2): number {
  // Backtracking with early exit after 'limit' solutions
  const n = board.length;
  const spot = findEmpty(board);
  if (!spot) return 1;
  const [r,c] = spot;
  let count = 0;
  for (let v=1; v<=n; v++) {
    if (isValid(board, r, c, v)) {
      board[r][c] = v;
      count += countSolutions(board, limit);
      if (count >= limit) { board[r][c] = null; return count; }
      board[r][c] = null;
    }
  }
  return count;
}

/**
 * Mask cells from a solved board to create a puzzle.
 * Difficulty controls how many clues remain and uniqueness checks.
 */
export function makePuzzle(n: Size, difficulty: Difficulty) {
  const solved = generateSolved(n);
  const puzzle = clone(solved);
  const total = n*n;
  const difficultyMap = {
    easy:  Math.floor(total * 0.6),
    medium: Math.floor(total * 0.5),
    hard: Math.floor(total * 0.4),
    expert: Math.floor(total * 0.33),
  };
  const cluesTarget = difficultyMap[difficulty];
  // Create a list of positions and shuffle
  const positions = Array.from({length: total}, (_,i) => i).sort(() => Math.random() - 0.5);
  let removed = 0;
  for (const pos of positions) {
    const r = Math.floor(pos / n), c = pos % n;
    const backup = puzzle[r][c];
    if (backup === null) continue;
    puzzle[r][c] = null;
    // Ensure unique solution
    const solCount = countSolutions(clone(puzzle), 2);
    if (solCount !== 1 || total - removed - 1 < cluesTarget) {
      puzzle[r][c] = backup; // revert
    } else {
      removed++;
    }
  }
  return { puzzle, solution: solved };
}
