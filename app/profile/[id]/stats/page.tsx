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

    if (!user || user.id !== id) {
        notFound();
    }

    const { data: exercises } = await supabase
        .from("exercises")
        .select(`
    id,
    name,
    category,
    description,
    muscle_group,
    workout_exercises (
      sets (
        reps,
        weight
      )
    )
  `)
        .or(`user_id.eq.${user.id},user_id.is.null`);


    if (!exercises || exercises.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Exercise Stats</h1>
                <p className="text-muted-foreground">No exercises found.</p>
            </div>
        );
    }
    const nonEmptyExercises = exercises.filter((ex) =>
        ex.workout_exercises?.some((we: any) => we.sets?.length > 0)
    );

    if (nonEmptyExercises.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold">Exercise Stats</h1>
                <p className="text-muted-foreground">
                    No tracked data available for your exercises yet.
                </p>
                <Link
                    href={`/profile/${user.id}/dashboard`}
                    className="btn btn-outline w-full sm:w-auto"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    const grouped: Record<string, typeof nonEmptyExercises> = {};
    for (const ex of nonEmptyExercises) {
        const group = ex.muscle_group || "Other";
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(ex);
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Exercise Stats</h1>

            <p className="text-sm text-muted-foreground">
                Breakdown of your tracked exercises, grouped by muscle group.
            </p>

            <Link
                href={`/profile/${user.id}/dashboard`}
                className="btn btn-outline w-full sm:w-auto"
            >
                ← Back to Dashboard
            </Link>

            {Object.entries(grouped).map(([muscleGroup, list]) => (
                <div key={muscleGroup} className="space-y-4">
                    <h2 className="text-2xl font-semibold border-b border-base-300 pb-1">
                        {muscleGroup}
                    </h2>

                    {list.map((ex) => {
                        const allSets = ex.workout_exercises?.flatMap((we: any) => we.sets) || [];
                        const totalSets = allSets.length;

                        const weights = allSets
                            .map((s: any) => s.weight ?? 0)
                            .filter((w: number) => w > 0);

                        const repsVolume = allSets.reduce(
                            (sum: number, set: any) => sum + (set.reps ?? 0) * (set.weight ?? 0),
                            0
                        );

                        const min = weights.length ? Math.min(...weights) : null;
                        const max = weights.length ? Math.max(...weights) : null;
                        const change =
                            weights.length >= 2 ? weights[weights.length - 1] - weights[0] : null;

                        const isWeightBased = weights.length > 0;

                        return (
                            <div
                                key={ex.id}
                                className="rounded bg-base-100 p-4 border border-base-300 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">{ex.name}</h3>
                                    <span className="badge badge-outline">{totalSets} sets</span>
                                </div>

                                {ex.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {ex.description}
                                    </p>
                                )}

                                <ul className="mt-2 text-sm space-y-1">
                                    {isWeightBased ? (
                                        <>
                                            <li>
                                                <strong>Total Volume:</strong>{" "}
                                                {repsVolume.toLocaleString()} lbs
                                            </li>
                                            <li>
                                                <strong>Max Weight:</strong> {max} lbs
                                            </li>
                                            <li>
                                                <strong>Min Weight:</strong> {min} lbs
                                            </li>
                                            {change !== null && (
                                                <li>
                                                    <strong>Change:</strong>{" "}
                                                    <span
                                                        className={
                                                            change > 0
                                                                ? "text-success"
                                                                : change < 0
                                                                    ? "text-error"
                                                                    : "text-muted-foreground"
                                                        }
                                                    >
                                                        {change > 0 ? "+" : ""}
                                                        {change} lbs
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
            ))}
        </div>
    );
}
