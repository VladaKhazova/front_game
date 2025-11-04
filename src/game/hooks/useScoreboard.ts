import { useEffect, useState } from "react";
import { Scoreboard, ScoreRow } from "../types";
import { emptyScore } from "../const";

const KEY = "c4-score";

function load(): Scoreboard {
    try {
        if (typeof window === "undefined") return emptyScore as Scoreboard;
        const raw = localStorage.getItem(KEY);
        if (!raw) return { ...emptyScore } as Scoreboard;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.history)) {
            return { ...emptyScore } as Scoreboard;
        }
        return {
            games: Number(parsed.games) || 0,
            red: Number(parsed.red) || 0,
            yellow: Number(parsed.yellow) || 0,
            draw: Number(parsed.draw) || 0,
            history: parsed.history as ScoreRow[],
        };
    } catch {
        return { ...emptyScore } as Scoreboard;
    }
}

export function useScoreboard() {
    const [score, setScore] = useState<Scoreboard>(() => load());

    useEffect(() => {
        try { localStorage.setItem(KEY, JSON.stringify(score)); } catch {}
    }, [score]);

    const resetScore = () => {
        setScore({ games: 0, red: 0, yellow: 0, draw: 0, history: [] });
        try { localStorage.removeItem(KEY); } catch {}
    };

    const record = (res: "red" | "yellow" | "draw", moves: number) => {
        const last = score.history.at(-1);
        const row: ScoreRow = {
            id: (last?.id ?? 0) + 1,
            winner: res,
            moves
        };
        setScore(s => ({
            games: s.games + 1,
            red: s.red + (res === "red" ? 1 : 0),
            yellow: s.yellow + (res === "yellow" ? 1 : 0),
            draw: s.draw + (res === "draw" ? 1 : 0),
            history: [...s.history, row].slice(-20),
        }));
    };

    return { score, setScore, record, resetScore };
}
