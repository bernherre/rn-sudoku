import { create } from 'zustand';
import type { Board, Size, Difficulty } from '@/engine/sudoku';
import { makePuzzle, solve, clone } from '@/engine/sudoku';

type Coords = { r: number; c: number };

type GameState = {
    size: Size;
    difficulty: Difficulty;
    puzzle: Board;
    solution: Board;
    current: Board;
    selected: Coords | null;
    startedAt: number | null;
    elapsedMs: number;
    paused: boolean;
    errors: Set<string>; // "r,c"

    // actions
    newGame: (size?: Size, difficulty?: Difficulty) => void;
    setSize: (size: Size) => void;
    setDifficulty: (d: Difficulty) => void;

    select: (r: number, c: number) => void;
    input: (v: number | null) => void;

    reset: () => void;      // reinicia el tablero con el puzzle actual
    clear: () => void;      // limpia SOLO celdas del usuario
    solveNow: () => void;

    verify: () => void;     // marca errores
    tick: () => void;
    pause: () => void;
    resume: () => void;
};

function key(r: number, c: number) { return `${r},${c}`; }

export const useGame = create<GameState>((set, get) => ({
    size: 6,
    difficulty: 'medium',
    puzzle: [],
    solution: [],
    current: [],
    selected: null,
    startedAt: null,
    elapsedMs: 0,
    paused: false,
    errors: new Set(),

    newGame: (size, difficulty) => {
        const nextSize = size ?? get().size;
        const nextDiff = difficulty ?? get().difficulty;
        const { puzzle, solution } = makePuzzle(nextSize, nextDiff);
        set({
            size: nextSize,
            difficulty: nextDiff,
            puzzle,
            solution,
            current: clone(puzzle),
            selected: null,
            startedAt: Date.now(),
            elapsedMs: 0,
            paused: false,
            errors: new Set(),
        });
    },

    setSize: (size) => {
        set({ size });
        get().newGame(size, get().difficulty);
    },

    setDifficulty: (d) => {
        set({ difficulty: d });
        get().newGame(get().size, d);
    },

    select: (r, c) => set({ selected: { r, c } }),

    input: (v) => {
        const { selected, current, puzzle } = get();
        if (!selected) return;
        const { r, c } = selected;
        if (puzzle[r][c] !== null) return; // no cambiar pistas

        const next = current.map(row => row.slice());
        next[r][c] = v;
        set({ current: next });

        // si lleno todo, parar tiempo
        const done = next.every(row => row.every(cell => cell !== null));
        if (done) set({ paused: true });
    },

    reset: () =>
        set(state => ({
            current: clone(state.puzzle),
            startedAt: Date.now(),
            elapsedMs: 0,
            paused: false,
            errors: new Set(),
        })),

    clear: () => {
        const { puzzle, current } = get();
        const next = current.map((row, r) =>
            row.map((cell, c) => (puzzle[r][c] === null ? null : cell)),
        );
        set({ current: next, errors: new Set() });
    },

    solveNow: () => set(state => ({ current: clone(state.solution), paused: true, errors: new Set() })),

    verify: () => {
        const { current, solution, puzzle } = get();
        const errs = new Set<string>();
        for (let r = 0; r < current.length; r++) {
            for (let c = 0; c < current.length; c++) {
                if (puzzle[r][c] !== null) continue; // no marcar pistas
                const v = current[r][c];
                if (v !== null && v !== solution[r][c]) errs.add(key(r, c));
            }
        }
        set({ errors: errs });
    },

    tick: () => {
        const { startedAt, paused } = get();
        if (startedAt && !paused) set({ elapsedMs: Date.now() - startedAt });
    },

    pause: () => set({ paused: true }),
    resume: () => set({ paused: false }),
}));
