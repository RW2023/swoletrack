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
    const [regenerating, setRegenerating] = useState(false);
    const [error, setError] = useState(false);

    const fetchSummary = async (force = false) => {
        setLoading(true);
        setError(false);

        try {
            const res = await fetch(`/api/summary${force ? "?force=true" : ""}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workouts, userName, weekLabel: week }),
            });

            const data = await res.json();
            setSummary(data.summary);
        } catch (err) {
            console.error("Error fetching summary:", err);
            setError(true);
        } finally {
            setLoading(false);
            setRegenerating(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [week, workouts, userName]);

    if (loading) {
        return <p className="text-sm text-muted-foreground italic">🧠 Generating AI summary...</p>;
    }

    if (error) {
        return <p className="text-sm text-red-400 italic">⚠️ Failed to load summary</p>;
    }

    return summary ? (
        <div
            className="rounded-lg p-4 text-sm mb-4 border transition-colors
                 bg-green-100 text-green-900 border-green-300
                 dark:bg-green-900 dark:text-green-100 dark:border-green-700
                 whitespace-pre-line"
        >
            <div className="flex justify-between items-start mb-1">
                <span className="mr-2">🧠 {summary}</span>
                <button
                    onClick={() => {
                        setRegenerating(true);
                        fetchSummary(true);
                    }}
                    className="btn btn-xs btn-outline text-xs"
                    disabled={regenerating}
                >
                    {regenerating ? "Regenerating..." : "Regenerate"}
                </button>
            </div>
        </div>
    ) : null;
}
