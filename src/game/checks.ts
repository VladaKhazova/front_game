import { Cell, Coord, Player, WinState } from "./types";
import { COLS, ROWS } from "./const";

export const makeEmptyBoard = (): Cell[][] =>
    Array.from({ length: ROWS },
        () => Array.from({ length: COLS },
            () => 0 as Cell));

export const inBounds = (r: number, c: number) =>
    r >= 0 && r < ROWS && c >= 0 && c < COLS;

export function checkWinFrom(
    b: Cell[][],
    startR: number,
    startC: number,
    player: Exclude<Player, 0>
): WinState {
    const dirs: Coord[] = [
        { r: 0, c: 1 },
        { r: 1, c: 0 },
        { r: 1, c: 1 },
        { r: 1, c: -1 },
    ];

    for (const d of dirs) {
        const line: Coord[] = [{ r: startR, c: startC }];

        let r = startR + d.r, c = startC + d.c;
        while (inBounds(r, c) && b[r][c] === player) {
            line.push({ r, c }); r += d.r; c += d.c;
        }

        r = startR - d.r; c = startC - d.c;
        while (inBounds(r, c) && b[r][c] === player) {
            line.unshift({ r, c }); r -= d.r; c -= d.c;
        }

        if (line.length >= 4) return {
            winner: player, line: line.slice(0, 4)
        };
    }
    return { winner: null, line: [] };
}
