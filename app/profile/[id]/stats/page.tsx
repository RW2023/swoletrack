import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ExerciseStatsPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== id) notFound();

    const { data: setsData } = await supabase.rpc("exercise_stats_view", {
        user_id_input: user.id,
    });

    if (!setsData || setsData.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Exercise Stats</h1>
                <p className="text-muted-foreground">No tracked data found.</p>
                <Link
                    href={`/profile/${user.id}/dashboard`}
                    className="btn btn-outline mt-4"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    const grouped: Record<string, any[]> = {};
    for (const entry of setsData) {
        if (!grouped[entry.name]) grouped[entry.name] = [];
        grouped[entry.name].push(entry);
    }

    const exerciseBlocks = Object.entries(grouped).map(([name, sets]) => {
        const muscleGroup = sets[0].muscle_group || "Other";
        const description = sets[0].description;
        const totalSets = sets.length;

        const weights = sets.map((s) => s.weight ?? 0).filter((w) => w > 0);
        const repsVolume = sets.reduce(
            (sum, set) => sum + (set.reps ?? 0) * (set.weight ?? 0),
            0
        );

        const max = weights.length ? Math.max(...weights) : null;
        const min = weights.length ? Math.min(...weights) : null;
        const setRange = max && min ? max - min : null;
        const isWeightBased = weights.length > 0;

        const setsByWeek: Record<string, number[]> = {};
        for (const s of sets) {
            const d = new Date(s.date);
            const monday = new Date(d);
            monday.setDate(d.getDate() - d.getDay() + 1);
            const weekStr = monday.toISOString().split("T")[0];
            if (!setsByWeek[weekStr]) setsByWeek[weekStr] = [];
            if (s.weight > 0) setsByWeek[weekStr].push(s.weight);
        }

        const sortedWeeks = Object.keys(setsByWeek).sort();
        let progress: number | null = null;
        if (sortedWeeks.length >= 2) {
            const prev = setsByWeek[sortedWeeks[sortedWeeks.length - 2]];
            const curr = setsByWeek[sortedWeeks[sortedWeeks.length - 1]];
            const avgPrev = prev.reduce((a, b) => a + b, 0) / prev.length;
            const avgCurr = curr.reduce((a, b) => a + b, 0) / curr.length;
            progress = Math.round(avgCurr - avgPrev);
        }

        return {
            name,
            muscleGroup,
            description,
            totalSets,
            repsVolume,
            max,
            min,
            setRange,
            progress,
            isWeightBased,
        };
    });

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

    const groupedByMuscle: Record<string, typeof exerciseBlocks> = {};
    for (const block of exerciseBlocks) {
        if (!groupedByMuscle[block.muscleGroup]) groupedByMuscle[block.muscleGroup] = [];
        groupedByMuscle[block.muscleGroup].push(block);
    }

    const orderedGroups = anatomicalOrder
        .filter((group) => groupedByMuscle[group])
        .map((group) => [group, groupedByMuscle[group]] as const);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Exercise Stats</h1>
                <Link
                    href={`/profile/${user.id}/dashboard`}
                    className="btn btn-outline"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            <p className="text-sm text-muted-foreground">
                Breakdown of your tracked exercises, grouped by muscle group.
            </p>

            {orderedGroups.map(([muscleGroup, exercises]) => (
                <div key={muscleGroup} className="space-y-4">
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
