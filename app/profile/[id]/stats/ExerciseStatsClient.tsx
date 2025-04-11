"use client";

import { useState } from "react";
import clsx from "clsx";

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
    setsByDay?: Record<string, number[]>;
}

interface Props {
    userId: string;
    exerciseBlocks: ExerciseBlock[];
}

const anatomicalOrder = [
    "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio", "Other",
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
                            className={clsx("btn btn-sm sm:btn-md btn-outline", {
                                "btn-active": selectedGroup === group,
                            })}
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

                            const allWeights =
                                ex.setsByDay &&
                                Object.values(ex.setsByDay).flat().filter((w) => w > 0);
                            const avgWeight =
                                allWeights && allWeights.length
                                    ? Math.round(
                                        allWeights.reduce((a, b) => a + b, 0) /
                                        allWeights.length
                                    )
                                    : null;

                            return (
                                <div
                                    key={ex.name}
                                    className="card bg-base-100 shadow border border-base-300"
                                >
                                    <div className="card-body">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="card-title text-lg font-bold">{ex.name}</h3>
                                            <div className="badge badge-outline">{ex.totalSets} sets</div>
                                        </div>

                                        {ex.description && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {ex.description}
                                            </p>
                                        )}

                                        <ul className="text-sm space-y-1">
                                            {ex.isWeightBased ? (
                                                <>
                                                    <li><strong>Total Volume:</strong> {ex.repsVolume.toLocaleString()} lbs</li>
                                                    <li><strong>Max Weight:</strong> {ex.max} lbs</li>
                                                    <li><strong>Min Weight:</strong> {ex.min} lbs</li>
                                                    {avgWeight !== null && (
                                                        <li>
                                                            <strong>Average Weight:</strong>{" "}
                                                            {avgWeight} lbs
                                                        </li>
                                                    )}
                                                    {ex.setRange !== null && (
                                                        <li>
                                                            <strong>Set Range:</strong>{" "}
                                                            <span className="text-muted-foreground">{ex.setRange} lbs</span>
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
                                                    {ex.setsByDay && (
                                                        <li className="mt-2">
                                                            <details className="collapse collapse-arrow bg-base-200">
                                                                <summary className="collapse-title text-sm font-medium">
                                                                    Daily Breakdown
                                                                </summary>
                                                                <div className="collapse-content text-xs space-y-1 mt-2">
                                                                    {Object.entries(ex.setsByDay)
                                                                        .sort()
                                                                        .map(([day, weights]) => {
                                                                            const avg =
                                                                                weights.length > 0
                                                                                    ? Math.round(
                                                                                        weights.reduce((a, b) => a + b, 0) /
                                                                                        weights.length
                                                                                    )
                                                                                    : 0;
                                                                            return (
                                                                                <div key={day}>
                                                                                    <strong>{day}:</strong>{" "}
                                                                                    {weights.join(", ")} lbs{" "}
                                                                                    <span className="text-muted-foreground">
                                                                                        (avg: {avg} lbs)
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </details>
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </>
    );
}
