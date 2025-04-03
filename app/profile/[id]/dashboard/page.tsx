import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DeleteWorkoutButton } from "@/components/delete-workout-button";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

function getWeekLabel(dateStr: string) {
    const date = new Date(dateStr);
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `Week of ${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })} – ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })}`;
}

function getCategoryIcon(category: string) {
    switch (category) {
        case "weight_training":
            return "🏋️‍♂️";
        case "cardio":
            return "🔥";
        case "calisthenics":
            return "🤸‍♂️";
        default:
            return "💪";
    }
}

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== id) notFound();

    const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

    if (!profile) notFound();

    const { data: workouts } = await supabase
        .from("workouts")
        .select(`
            id,
            date,
            notes,
            workout_exercises (
                id,
                exercise: exercises (
                    name,
                    category
                ),
                sets (
                    set_number,
                    reps,
                    weight
                )
            )
        `)
        .eq("user_id", user.id)
        .order("date", { ascending: false });

    const groupedByWeek: Record<string, typeof workouts> = {};
    workouts?.forEach((workout) => {
        const weekLabel = getWeekLabel(workout.date);
        if (!groupedByWeek[weekLabel]) groupedByWeek[weekLabel] = [];
        groupedByWeek[weekLabel].push(workout);
    });

    const allSets = workouts?.flatMap((w) =>
        w.workout_exercises.flatMap((e: any) => e.sets)
    ) || [];
    const totalWorkouts = workouts?.length || 0;
    const totalSets = allSets.length;
    const totalVolume = allSets.reduce((sum, set: any) => sum + set.reps * set.weight, 0);

    // ✅ Personal Records (heaviest set per exercise)
    const personalRecordsMap = new Map<string, number>();
    workouts?.forEach((workout) => {
        workout.workout_exercises.forEach((exerciseBlock: any) => {
            const name = exerciseBlock.exercise.name;
            exerciseBlock.sets.forEach((set: any) => {
                const currentPR = personalRecordsMap.get(name) || 0;
                const setWeight = set.weight;
                if (setWeight > currentPR) {
                    personalRecordsMap.set(name, setWeight);
                }
            });
        });
    });

    const personalRecords = Array.from(personalRecordsMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // ✅ Longest workout streak
    const workoutDates = Array.from(
        new Set(
            (workouts ?? [])
                .map((w) => new Date(w.date).toDateString())
                .sort()
        )
    );


    let longestStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;

    for (const dateStr of workoutDates) {
        const currentDate = new Date(dateStr);
        if (
            prevDate &&
            currentDate.getTime() - prevDate.getTime() === 1000 * 60 * 60 * 24
        ) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
        prevDate = currentDate;
    }

    const exerciseFrequency = new Map<string, number>();
    workouts?.forEach((workout) => {
        workout.workout_exercises.forEach((we: any) => {
            const name = we.exercise.name;
            exerciseFrequency.set(name, (exerciseFrequency.get(name) || 0) + 1);
        });
    });

    const mostFrequentExercises = Array.from(exerciseFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const currentWeek = getWeekLabel(new Date().toISOString());

    return (
        <div className="p-6 max-w-5xl mx-auto text-base-content">
            <h1 className="text-2xl font-bold mb-6">{profile.name}'s Dashboard</h1>

            {/* ✅ Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded bg-base-200 p-4 text-center shadow-sm">
                    <p className="text-sm text-muted-foreground">Total Workouts</p>
                    <p className="text-2xl font-bold">{totalWorkouts}</p>
                </div>
                <div className="rounded bg-base-200 p-4 text-center shadow-sm">
                    <p className="text-sm text-muted-foreground">Total Sets</p>
                    <p className="text-2xl font-bold">{totalSets}</p>
                </div>
                <div className="rounded bg-base-200 p-4 text-center shadow-sm">
                    <p className="text-sm text-muted-foreground">Total Volume (lbs)</p>
                    <p className="text-2xl font-bold">{totalVolume.toLocaleString()}</p>
                </div>
            </div>

            {/* ✅ PRs and Streaks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-base-200 p-4 rounded shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">🏆 Personal Records</h2>
                    {personalRecords.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                            {personalRecords.map(([name, weight]) => (
                                <li key={name} className="flex justify-between">
                                    <span>{name}</span>
                                    <span className="font-semibold">{weight} lbs</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-sm">No PRs yet.</p>
                    )}
                </div>

                <div className="bg-base-200 p-4 rounded shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">🔥 Longest Streak</h2>
                    <p className="text-4xl font-bold">{longestStreak} days</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Longest streak of consecutive workout days.
                    </p>
                </div>
            </div>

            {/* ✅ Most Frequent Exercises */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">💪 Most Frequent Exercises</h2>
                {mostFrequentExercises.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {mostFrequentExercises.map(([name, count]) => (
                            <li
                                key={name}
                                className="bg-base-200 rounded p-3 flex justify-between items-center"
                            >
                                <span>{name}</span>
                                <span className="text-muted-foreground">{count}x</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">No exercises logged yet.</p>
                )}
            </div>

            {/* ✅ Log New Workout */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Workouts</h2>
                <Link href="/workouts/new" className="btn btn-success text-white">
                    + Log New Workout
                </Link>
            </div>

            {/* ✅ Weekly Breakdown */}
            {Object.entries(groupedByWeek).map(([week, workouts]) => {
                const isCurrentWeek = week === currentWeek;
                const allSets = workouts?.flatMap((w) =>
                    w.workout_exercises.flatMap((e: any) => e.sets)
                ) || [];
                const totalSets = allSets.length;
                const totalVolume = allSets.reduce(
                    (sum, set: any) => sum + set.reps * set.weight,
                    0
                );

                return (
                    <details
                        key={week}
                        open={isCurrentWeek}
                        className={`border rounded p-4 mt-4 ${isCurrentWeek
                            ? "border-primary bg-primary/10"
                            : "bg-base-200"
                            }`}
                    >
                        <summary className="font-semibold cursor-pointer text-lg mb-2 flex items-center justify-between">
                            <span>{week}</span>
                            <span className="text-sm text-muted-foreground font-normal ml-4">
                                {workouts?.length || 0} workout(s), {totalSets} sets, {totalVolume} lbs
                            </span>
                        </summary>

                        <ul className="space-y-4 mt-2">
                            {workouts?.map((workout) => (
                                <li
                                    key={workout.id}
                                    className="border p-4 rounded bg-base-100 shadow-sm"
                                >
                                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                                        <span>{new Date(workout.date).toLocaleDateString()}</span>
                                        <DeleteWorkoutButton workoutId={workout.id} />
                                    </div>

                                    {workout.notes && (
                                        <p className="text-sm mt-1 italic text-muted-foreground">
                                            📝 {workout.notes}
                                        </p>
                                    )}

                                    {workout.workout_exercises.map((we: any) => (
                                        <div key={we.id} className="mb-3">
                                            <p className="font-medium flex items-center gap-1">
                                                <span>{getCategoryIcon(we.exercise.category)}</span>
                                                {we.exercise.name}
                                                <span className="text-sm text-muted-foreground">
                                                    ({we.exercise.category.replace("_", " ")})
                                                </span>
                                            </p>
                                            <ul className="ml-4 mt-1 text-sm text-muted-foreground list-disc">
                                                {we.sets.map((set: any, index: number) => (
                                                    <li key={index}>
                                                        {set.reps} reps @ {set.weight} lbs
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </details>
                );
            })}

            {(!workouts || workouts.length === 0) && (
                <p className="text-muted-foreground">No workouts logged yet.</p>
            )}
        </div>
    );
}
