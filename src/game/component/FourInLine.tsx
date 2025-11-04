import React, { useMemo, useState } from "react";
import { Cell, Player, WinState } from "../types";
import { COLS, ROWS } from "../const";
import { checkWinFrom, makeEmptyBoard } from "../checks";
import { useScoreboard } from "../hooks/useScoreboard";
import ColumnSelectors from "./ColumnSelectors";
import Board from "./Board";
import ScoreboardCard from "./Scoreboard";

export default function FourInLine() {
    const [board, setBoard] = useState<Cell[][]>(() => makeEmptyBoard());
    const [current, setCurrent] = useState<Exclude<Player, 0>>(1);
    const [win, setWin] = useState<WinState>({ winner: null, line: [] });
    const [isDraw, setIsDraw] = useState(false);
    const [moves, setMoves] = useState(0);
    const { score, record, resetScore } = useScoreboard();
    const canPlay = win.winner === null && !isDraw;
    const resetGame = () => {
        setBoard(makeEmptyBoard());
        setCurrent(1);
        setWin({ winner: null, line: [] });
        setIsDraw(false);
        setMoves(0);
    };

    const dropInColumn = (col: number) => {
        if (!canPlay) return;
        let rowToPlace = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] === 0) { rowToPlace = r; break; }
        }
        if (rowToPlace === -1) return;
        const next = board.map(row => row.slice());
        next[rowToPlace][col] = current;

        const newMoves = moves + 1;
        setMoves(newMoves);
        const fallDelay = (ROWS - rowToPlace) * 50;
        setTimeout(() => setBoard(next), fallDelay);
        const result = checkWinFrom(next, rowToPlace, col, current);
        if (result.winner) {
            setWin(result);
            record(result.winner === 1 ? "red" : "yellow", newMoves);
            return;
        }

        const hasEmpty = next.some(row => row.some(cell => cell === 0));
        if (!hasEmpty) {
            setIsDraw(true);
            record("draw", newMoves);
            return;
        }

        setCurrent(current === 1 ? 2 : 1);
    };

    const statusText = useMemo(() => {
        if (win.winner) {
            return win.winner === 1
                ? "Победа: Красные (Игрок 1)"
                : "Победа: Желтые (Игрок 2)";
        }
        if (isDraw) return "Ничья";

        return current === 1
            ? "Ход: Красные (Игрок 1)"
            : "Ход: Желтые (Игрок 2)";
    }, [current, isDraw, win.winner]);


    const isWinningCell = (r: number, c: number) => win.line.some((p) => p.r === r && p.c === c);

    return (
        <div className="w-full max-w-3xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Four in Line</h1>
                <div className="flex items-center" style={{ gap: 8 }}>
                    <button onClick={resetGame} className="btn">Новая партия</button>
                    <button onClick={resetScore} className="btn btn-danger">Сбросить таблицу</button>
                </div>
            </header>

            <div
                className="mb-3 text-lg font-medium"
                aria-live="polite"
                style={{ paddingBottom: 20 }}
            >
            {statusText} | Ходов: {moves}

            </div>

            <ScoreboardCard score={score} />

            <ColumnSelectors canPlay={canPlay} onDrop={dropInColumn} />

            <Board board={board} isWinningCell={isWinningCell} />

            <p className="mt-4 text-sm text-slate-400">
                Правила: фишки падают вниз, цель — собрать четыре подряд по горизонтали, вертикали или диагонали.
                Существует случай ничьи - поле заполнено, но 4 в ряд фишки не выявлено.
            </p>
        </div>
    );
}
