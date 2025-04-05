"use client";

import { useEffect, useState } from "react";

type WeeklySummaryProps = {
    week: string;
    workouts: any[];
    userName: string;
};

export default function WeeklySummary({ week, workouts, userName }: WeeklySummaryProps) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);

        fetch("/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workouts, userName, weekLabel: week }),
        })
            .then((res) => res.json())
            .then((data) => {
                setSummary(data.summary);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching summary:", err);
                setError(true);
                setLoading(false);
            });
    }, [week, workouts, userName]);

    if (loading) {
        return <p className="text-sm text-muted-foreground italic">🧠 Generating AI summary...</p>;
    }

    if (error) {
        return <p className="text-sm text-red-400 italic">⚠️ Failed to load summary</p>;
    }

    return summary ? (
        <div className="alert alert-success text-sm mb-4 whitespace-pre-line">
            🧠 {summary}
        </div>
    ) : null;
}
