
import { generateSolved, makePuzzle, solve, countSolutions } from './sudoku';

describe('sudoku engine', () => {
  test('generate solved 4x4', () => {
    const solved = generateSolved(4);
    expect(solved.length).toBe(4);
    expect(solved.every(r => r.length === 4)).toBe(true);
  });

  test('puzzle unique solution 6x6 medium', () => {
    const { puzzle } = makePuzzle(6, 'medium');
    const count = countSolutions(puzzle.map(r => r.slice()), 2);
    expect(count).toBe(1);
  });

  test('solve returns board', () => {
    const { puzzle } = makePuzzle(4, 'easy');
    const solved = solve(puzzle.map(r => r.slice()));
    expect(solved).not.toBeNull();
  });
});
