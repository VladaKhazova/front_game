import React, { useEffect, useState } from "react";
import { Cell } from "../types";

type DiscStyle = React.CSSProperties &
    { ["--fall-height"]?: string;
        ["--fall-ms"]?: string };

export default function CellDisc({value, highlight, row,}:
{
    value: Cell;
    highlight?: boolean;
    row: number
}) {
    const aria = value === 0 ? "пусто" : value === 1 ? "красная" : "желтая";
    const [drop, setDrop] = useState(false);
    useEffect(() => {
        if (value !== 0) {
            setDrop(true);
            const t = setTimeout(() => setDrop(false), 1200);
            return () => clearTimeout(t);
        }
    }, [value]);

    const fallHeightPx = (row + 1) * 130;
    const durationMs = 600 + (row + 1) * 120;
    let cls = "disc";
    if (drop) cls += " disc--wow";
    if (value === 1) cls += " disc--red";
    if (value === 2) cls += " disc--yellow";
    if (highlight) cls += " disc--win";
    const style:
        DiscStyle = {
        "--fall-height": `${fallHeightPx}px`,
        "--fall-ms": `${durationMs}ms`
    };
    return (
        <div className="cell" role="gridcell" aria-label={aria}>
            <div className={cls} style={style} />
        </div>
    );
}
