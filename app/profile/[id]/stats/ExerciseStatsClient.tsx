"use client";

import { useState } from "react";

interface ExerciseBlock {
    name: string;
    muscleGroup: string;
    description: string | null;
    totalSets: number;
    repsVolume: number;
    max: number | null;
    min: number | null;
    setRange: number | null;
    progress: number | null;
    isWeightBased: boolean;
}

interface Props {
    userId: string;
    exerciseBlocks: ExerciseBlock[];
}

const anatomicalOrder = [
    "All",
    "Chest",
    "Back",
    "Shoulders",
    "Arms",
    "Legs",
    "Core",
    "Cardio",
    "Other",
];

export default function ExerciseStatsClient({ userId, exerciseBlocks }: Props) {
    const [selectedGroup, setSelectedGroup] = useState<string>("All");

    const grouped: Record<string, ExerciseBlock[]> = {};
    for (const block of exerciseBlocks) {
        const group = block.muscleGroup || "Other";
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(block);
    }

    const visibleGroups = anatomicalOrder
        .filter((group) =>
            selectedGroup === "All" ? grouped[group] : group === selectedGroup
        )
        .map((group) => [group, grouped[group] || []] as const);

    return (
        <div>
            <div className="overflow-x-auto pb-4">
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    {anatomicalOrder.map((group) => (
                        <button
                            key={group}
                            className={`btn btn-sm sm:btn-md btn-outline ${selectedGroup === group ? "btn-active" : ""
                                }`}
                            onClick={() => setSelectedGroup(group)}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </div>
            <div className="pt-1 pb-2">
                <a
                    href={`/profile/${userId}/dashboard`}
                    className="btn btn-outline"
                >
                    ← Back to Dashboard
                </a>
            </div>

            {visibleGroups.map(([muscleGroup, exercises]) => (
                <div key={muscleGroup} className="space-y-4 scroll-mt-20">
                    <h2 className="text-2xl font-semibold border-b border-base-300 pb-1">
                        {muscleGroup}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map((ex) => (
                            <div
                                key={ex.name}
                                className="rounded bg-base-100 p-4 border border-base-300 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">{ex.name}</h3>
                                    <span className="badge badge-outline">{ex.totalSets} sets</span>
                                </div>

                                {ex.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {ex.description}
                                    </p>
                                )}

                                <ul className="mt-2 text-sm space-y-1">
                                    {ex.isWeightBased ? (
                                        <>
                                            <li>
                                                <strong>Total Volume:</strong> {ex.repsVolume.toLocaleString()} lbs
                                            </li>
                                            <li><strong>Max Weight:</strong> {ex.max} lbs</li>
                                            <li><strong>Min Weight:</strong> {ex.min} lbs</li>
                                            {ex.setRange !== null && (
                                                <li>
                                                    <strong>Set Range:</strong>{" "}
                                                    <span className="text-muted-foreground">{ex.setRange} lbs</span>
                                                </li>
                                            )}
                                            {ex.progress !== null && (
                                                <li>
                                                    <strong>Progress:</strong>{" "}
                                                    <span
                                                        className={
                                                            ex.progress > 0
                                                                ? "text-success"
                                                                : ex.progress < 0
                                                                    ? "text-error"
                                                                    : "text-muted-foreground"
                                                        }
                                                    >
                                                        {ex.progress > 0 ? "+" : ""}
                                                        {ex.progress} lbs
                                                    </span>
                                                </li>
                                            )}
                                        </>
                                    ) : (
                                        <li className="text-muted-foreground italic">
                                            This exercise is not tracked by weight.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
