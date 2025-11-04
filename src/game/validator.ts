type Coord = [number, number];
type BoardState = 'waiting' | 'pending' | 'win' | 'draw';

export type StepSnapshot = {
    player_1: Coord[];
    player_2: Coord[];
    board_state: BoardState;
    winner?: {
        who: 'player_1' | 'player_2';
        positions: Coord[];
    };
};

export type ValidatorOutput = Record<string, StepSnapshot>;

export function validator(moves: number[], cols = 7, rows = 6): ValidatorOutput {
    const out: ValidatorOutput = {};
    const board: number[][] = Array.from(
        { length: rows },
        () => Array(cols).fill(0));
    const p1: Coord[] = [];
    const p2: Coord[] = [];

    out['step_0'] = { player_1: [], player_2: [], board_state: 'waiting' };

    let finished = false;

    for (let i = 0; i < moves.length; i++) {
        const stepNo = i + 1;
        const col = moves[i];

        if (finished) {
            out[`step_${stepNo}`] = { ...out[`step_${stepNo - 1}`] };
            continue;
        }
        const currentPlayer: 1 | 2 = (i % 2 === 0) ? 1 : 2;
        const currentArr = currentPlayer === 1 ? p1 : p2;
        let rowToPlace = -1;
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][col] === 0) {
                rowToPlace = r; break;
            }
        }

        if (rowToPlace === -1) {
            out[`step_${stepNo}`] = snapshot('pending');
            continue;
        }

        board[rowToPlace][col] = currentPlayer;
        currentArr.push([rowToPlace, col]);

        const winLine = checkWin(board, rowToPlace, col, currentPlayer);
        if (winLine) {
            out[`step_${stepNo}`] = {
                player_1: [...p1],
                player_2: [...p2],
                board_state: 'win',
                winner: {
                    who: currentPlayer === 1 ? 'player_1' : 'player_2',
                    positions: winLine,
                },
            };
            finished = true;
            continue;
        }

        const hasEmpty = board.some(row => row.some(v => v === 0));
        if (!hasEmpty) {
            out[`step_${stepNo}`] = snapshot('draw');
            finished = true;
            continue;
        }

        out[`step_${stepNo}`] = snapshot('pending');
    }

    return out;

    function snapshot(state: BoardState): StepSnapshot {
        return {
            player_1: [...p1],
            player_2: [...p2],
            board_state: (
                state === 'waiting' && (p1.length || p2.length)) ? 'pending' : state,
        };
    }
}

function checkWin(b: number[][], r0: number, c0: number, player: 1 | 2): Coord[] | null {
    const dirs: Array<[number, number]> = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
    ];

    for (const [dr, dc] of dirs) {
        const line: Coord[] = [[r0, c0]];
        let r = r0 + dr, c = c0 + dc;
        while (inBounds(r, c) && b[r][c] === player) {
            line.push([r, c]);
            r += dr;
            c += dc;
        }
        r = r0 - dr;
        c = c0 - dc;
        while (inBounds(r, c) && b[r][c] === player) {
            line.unshift([r, c]);
            r -= dr; c -= dc;
        }
        if (line.length >= 4) return line.slice(0, 4);
    }
    return null;

    function inBounds(r: number, c: number) {
        return r >= 0 && r < b.length && c >= 0 && c < b[0].length;
    }
}
