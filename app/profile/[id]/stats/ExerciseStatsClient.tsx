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
    progressPerSet?: number | null;
    progressColor?: string;
}

interface Props {
    userId: string;
    exerciseBlocks: ExerciseBlock[];
}

const anatomicalOrder = [
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
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    const filteredBlocks =
        selectedGroup && anatomicalOrder.includes(selectedGroup)
            ? exerciseBlocks.filter((ex) => ex.muscleGroup === selectedGroup)
            : exerciseBlocks;

    const grouped: Record<string, ExerciseBlock[]> = {};
    for (const block of filteredBlocks) {
        const group = block.muscleGroup || "Other";
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(block);
    }

    const orderedGroups = anatomicalOrder
        .filter((group) => grouped[group])
        .map((group) => [group, grouped[group]] as const);

    return (
        <>
            <div className="overflow-x-auto pb-4">
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    {anatomicalOrder.map((group) => (
                        <button
                            key={group}
                            className={`btn btn-sm sm:btn-md btn-outline ${selectedGroup === group ? "btn-active" : ""
                                }`}
                            onClick={() =>
                                setSelectedGroup(group === selectedGroup ? null : group)
                            }
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-2">
                <a
                    href={`/profile/${userId}/dashboard`}
                    className="btn btn-outline btn-sm"
                >
                    ← Back to Dashboard
                </a>
            </div>

            {orderedGroups.map(([muscleGroup, exercises]) => (
                <div key={muscleGroup} className="space-y-4 scroll-mt-20 mt-8">
                    <h2 className="text-2xl font-semibold border-b border-base-300 pb-1">
                        {muscleGroup}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map((ex) => {
                            const progress = ex.progress ?? 0;
                            let progressColor = "text-muted-foreground";
                            if (progress > 0) {
                                progressColor = progress >= 10 ? "text-success" : "text-warning";
                            } else if (progress < 0) {
                                progressColor = "text-error";
                            }

                            return (
                                <div
                                    key={ex.name}
                                    className="rounded bg-base-100 p-4 border border-base-300 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold">{ex.name}</h3>
                                        <span className="badge badge-outline">
                                            {ex.totalSets} sets
                                        </span>
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
                                                    <strong>Total Volume:</strong>{" "}
                                                    {ex.repsVolume.toLocaleString()} lbs
                                                </li>
                                                <li>
                                                    <strong>Max Weight:</strong> {ex.max} lbs
                                                </li>
                                                <li>
                                                    <strong>Min Weight:</strong> {ex.min} lbs
                                                </li>
                                                {ex.setRange !== null && (
                                                    <li>
                                                        <strong>Set Range:</strong>{" "}
                                                        <span className="text-muted-foreground">
                                                            {ex.setRange} lbs
                                                        </span>
                                                    </li>
                                                )}
                                                {ex.progress !== null && (
                                                    <li>
                                                        <strong>Progress:</strong>{" "}
                                                        <span className={progressColor}>
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
                            );
                        })}
                    </div>
                </div>
            ))}
        </>
    );
}
