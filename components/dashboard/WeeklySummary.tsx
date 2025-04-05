"use client";

import { useEffect, useState } from "react";

export default function WeeklySummary({ week, workouts, userName }: any) {
    const [summary, setSummary] = useState("");

    useEffect(() => {
        fetch("/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workouts, userName, weekLabel: week }),
        })
            .then((res) => res.json())
            .then((data) => setSummary(data.summary));
    }, [week, workouts]);

    return summary ? (
        <div className="alert alert-success text-sm mb-4">{summary}</div>
    ) : null;
}
