import React from "react";
import { COLS } from "../const";

export default function ColumnSelectors({canPlay, onDrop,}: { canPlay: boolean; onDrop: (col: number) => void }) {
    return (
        <div role="group" aria-label="Выбор колонки">
            <div
                className="selectors"
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
                aria-label="Строка выбора">

                {Array.from({ length: COLS }).map((_, c) => (
                    <button
                        key={`sel-${c}`}
                        type="button"
                        className="selector"
                        title={`Колонка ${c + 1}`}
                        aria-label={`Бросить фишку в колонку ${c + 1}`}
                        disabled={!canPlay}
                        onClick={() => onDrop(c)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDrop(c); }
                        }}
                        data-col={c}
                    />
                ))}
            </div>
        </div>
    );
}
