import React from "react";
import { Scoreboard } from "../types";

export default function ScoreboardCard({ score }: { score: Scoreboard }) {
    return (
        <section className="card mb-4">
            <div className="card-head">
                <h2>Таблица результатов</h2>
            </div>
            <div className="score-totals">
                <div><span className="dot dot-red" /> Красные: <b>{score.red}</b></div>
                <div><span className="dot dot-yellow" /> Желтые: <b>{score.yellow}</b></div>
                <div>Ничьи: <b>{score.draw}</b></div>
                <div>Матчи: <b>{score.games}</b></div>
            </div>
            <table className="score-table" aria-label="История партий">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Победитель</th>
                    <th>Ходов</th>
                </tr>
                </thead>
                <tbody>
                {score.history.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="muted">Еще нет сыгранных партий</td>
                    </tr>
                ) : (
                    [...score.history].reverse().map((r) => (
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>
                                {r.winner === "red" && <><span className="dot dot-red" /> Красные</>}
                                {r.winner === "yellow" && <><span className="dot dot-yellow" /> Желтые</>}
                                {r.winner === "draw" && <>Ничья</>}
                            </td>
                            <td>{r.moves}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </section>
    );
}
