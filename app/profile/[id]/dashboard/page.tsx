import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DeleteWorkoutButton } from "@/components/delete-workout-button";
import QuickAddFAB from "@/components/dashboard/QuickAddFAB";

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

export default async function DashboardPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // ✅ Secure route: logged-in user must match URL param
    if (!user || user.id !== params.id) {
        notFound();
    }

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
          weight,
          duration
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

    const allSets =
        workouts?.flatMap((w) => w.workout_exercises.flatMap((e: any) => e.sets)) || [];

    const totalWorkouts = workouts?.length || 0;
    const totalSets = allSets.length;
    const totalVolume = allSets.reduce(
        (sum, set: any) => sum + (set.reps ?? 0) * (set.weight ?? 0),
        0
    );

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

    const workoutDates = Array.from(
        new Set(
            (workouts ?? []).map((w) => {
                const d = new Date(w.date);
                d.setUTCHours(0, 0, 0, 0);
                return d.toISOString();
            })
        )
    ).sort();

    let longestStreak = 0;
    let rollingStreak = 0;
    let prevDate: Date | null = null;

    for (const iso of workoutDates) {
        const currentDate = new Date(iso);
        if (prevDate && currentDate.getTime() - prevDate.getTime() === 86400000) {
            rollingStreak++;
        } else {
            rollingStreak = 1;
        }
        longestStreak = Math.max(longestStreak, rollingStreak);
        prevDate = currentDate;
    }

    let currentStreak = 0;
    const utcToday = new Date();
    utcToday.setUTCHours(0, 0, 0, 0);

    for (let i = workoutDates.length - 1; i >= 0; i--) {
        const date = new Date(workoutDates[i]);
        date.setUTCHours(0, 0, 0, 0);

        const diff = Math.floor((utcToday.getTime() - date.getTime()) / 86400000);
        if (diff === 0 || diff === currentStreak + 1) {
            currentStreak++;
            utcToday.setUTCDate(utcToday.getUTCDate() - 1);
        } else {
            break;
        }
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
        <div className="p-6 max-w-5xl mx-auto text-base-content space-y-8">
            <h1 className="text-3xl font-bold mb-2">{profile.name}'s Dashboard</h1>
            <p className="text-sm text-muted-foreground">
                Track your workouts, view stats, and maintain streaks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-base-200 p-4 rounded shadow">
                <div className="stat">
                    <div className="stat-title">Total Workouts</div>
                    <div className="stat-value">{totalWorkouts}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Sets</div>
                    <div className="stat-value">{totalSets}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Volume</div>
                    <div className="stat-value">{totalVolume.toLocaleString()} lbs</div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card bg-base-200 shadow">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2 text-lg">
                            <span>🏆</span>
                            {profile?.name ? `${profile.name}'s Personal Records` : "Personal Records"}
                        </h2>
                        {personalRecords.length > 0 ? (
                            <ul className="mt-2 space-y-1 text-sm">
                                {personalRecords.map(([name, weight]) => (
                                    <li key={name} className="flex justify-between">
                                        <span>{name}</span>
                                        <span className="font-semibold">{weight} lbs</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No PRs yet.</p>
                        )}
                    </div>
                </div>

                <div className="card bg-base-200 shadow">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2 text-lg">
                            <span>🔥</span>
                            Streaks
                        </h2>
                        <div className="mt-2 text-sm">
                            <p>
                                Current:{" "}
                                <span className="text-xl font-bold text-primary">{currentStreak}</span> days
                            </p>
                            <p>
                                Longest:{" "}
                                <span className="text-xl font-bold text-primary">{longestStreak}</span> days
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Streaks are counted by consecutive workout days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 shadow">
                <div className="card-body">
                    <h2 className="card-title text-lg">💪 Most Frequent Exercises</h2>
                    {mostFrequentExercises.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-3">
                            {mostFrequentExercises.map(([name, count]) => (
                                <li
                                    key={name}
                                    className="rounded bg-base-100 p-2 flex justify-between items-center"
                                >
                                    <span>{name}</span>
                                    <span className="badge badge-outline">{count}x</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No exercises logged yet.</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Workouts</h2>
                <Link href="/workouts/new" className="btn btn-primary">
                    + Log New Workout
                </Link>
            </div>

            {(!workouts || workouts.length === 0) && (
                <div className="alert alert-info shadow-sm">
                    <div>
                        <span>You have no workouts logged yet.</span>
                    </div>
                </div>
            )}

            {Object.entries(groupedByWeek).map(([week, weekWorkouts]) => {
                const isCurrentWeek = week === currentWeek;
                const allSets = weekWorkouts?.flatMap((w) =>
                    w.workout_exercises.flatMap((e: any) => e.sets)
                ) || [];
                const weekTotalSets = allSets.length;
                const weekTotalVolume = allSets.reduce(
                    (sum, set: any) => sum + (set.reps ?? 0) * (set.weight ?? 0),
                    0
                );

                return (
                    <details
                        key={week}
                        open={isCurrentWeek}
                        className={`border rounded p-4 mt-4 shadow-sm ${isCurrentWeek ? "border-primary bg-primary/10" : "bg-base-200"
                            }`}
                    >
                        <summary className="font-semibold cursor-pointer text-lg mb-2 flex items-center justify-between">
                            <span>{week}</span>
                            <span className="text-sm text-muted-foreground font-normal ml-4">
                                {weekWorkouts?.length || 0} workout(s), {weekTotalSets} sets, {weekTotalVolume} lbs
                            </span>
                        </summary>

                        <ul className="space-y-4 mt-2">
                            {weekWorkouts?.map((workout) => (
                                <li
                                    key={workout.id}
                                    className="border p-4 rounded bg-base-100 shadow-sm"
                                >
                                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                                        <span>{new Date(workout.date).toLocaleDateString()}</span>
                                        <DeleteWorkoutButton workoutId={workout.id} />
                                    </div>

                                    {workout.notes && (
                                        <p className="text-sm italic text-muted-foreground">
                                            📝 {workout.notes}
                                        </p>
                                    )}

                                    {workout.workout_exercises.map((we: any) => (
                                        <div key={we.id} className="mb-3">
                                            <p className="font-medium flex items-center gap-1">
                                                <span>{getCategoryIcon(we.exercise.category)}</span>
                                                {we.exercise.name}{" "}
                                                <span className="text-sm text-muted-foreground">
                                                    ({we.exercise.category.replace("_", " ")})
                                                </span>
                                            </p>
                                            <ul className="ml-4 mt-1 text-sm text-muted-foreground list-disc">
                                                {we.sets.map((set: any, index: number) => (
                                                    <li key={index}>
                                                        {we.exercise.category === "cardio"
                                                            ? `${set.duration} min${set.duration > 1 ? "s" : ""}`
                                                            : `${set.reps} reps @ ${set.weight} lbs`}
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

            <QuickAddFAB />
        </div>
    );
}
