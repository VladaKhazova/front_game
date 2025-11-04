export type Player = 0 | 1 | 2;
export type Cell = Player;
export type Coord = { r: number; c: number };

export type WinState = { winner: Exclude<Player, 0> | null; line: Coord[] };

export type ScoreRow = {
    id: number;
    winner: "red" | "yellow" | "draw";
    moves: number;
};

export type Scoreboard = {
    games: number;
    red: number;
    yellow: number;
    draw: number;
    history: ScoreRow[];
};
