import React from "react";
import { Cell } from "../types";
import { COLS } from "../const";
import CellDisc from "./CellDisc";

export default function Board({board, isWinningCell,}: { board: Cell[][]; isWinningCell: (r: number, c: number) => boolean; })
{
    return (
        <div className="board" role="grid" aria-label={`Игровое поле ${COLS} колонок`}>
            <div className="board-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {board.map((row, r) =>
                    row.map((cell, c) => (
                        <CellDisc key={`${r}-${c}-${cell}`}
                                  value={cell}
                                  row={r}
                                  highlight={isWinningCell(r, c)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
