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
    start.setDate(date.getDate() - date.getDay() + 1); // Monday
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
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== id) {
        notFound();
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        console.error("Error fetching profile name:", profileError?.message);
        notFound();
    }

    const { data: workouts, error } = await supabase
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

    if (error) {
        console.error("Error fetching workouts:", error.message);
        notFound();
    }

    const groupedByWeek: Record<string, typeof workouts> = {};
    workouts?.forEach((workout) => {
        const weekLabel = getWeekLabel(workout.date);
        if (!groupedByWeek[weekLabel]) groupedByWeek[weekLabel] = [];
        groupedByWeek[weekLabel].push(workout);
    });

    const currentWeek = getWeekLabel(new Date().toISOString());

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{profile.name}'s Dashboard</h1>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Your Workouts</h2>
                    <Link
                        href="/workouts/new"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        + Log New Workout
                    </Link>
                </div>

                {Object.entries(groupedByWeek).map(([week, workouts]) => {
                    const isCurrentWeek = week === currentWeek;
                    const allSets = workouts.flatMap((w) =>
                        w.workout_exercises.flatMap((e: any) => e.sets)
                    );
                    const totalSets = allSets.length;
                    const totalVolume = allSets.reduce(
                        (sum, set: any) => sum + set.reps * set.weight,
                        0
                    );

                    return (
                        <details
                            key={week}
                            open={isCurrentWeek}
                            className={`border rounded p-4 transition ${isCurrentWeek
                                    ? "border-blue-500 bg-blue-900/30 text-gray-900 dark:text-white"
                                    : "bg-muted/20"
                                }`}
                        >
                            <summary className="font-semibold cursor-pointer text-lg mb-2 flex items-center justify-between">
                                <span>{week}</span>
                                <span className="text-sm text-gray-500 font-normal ml-4">
                                    {workouts.length} workout(s), {totalSets} sets, {totalVolume} lbs total
                                </span>
                            </summary>

                            <ul className="space-y-4 mt-2">
                                {workouts.map((workout) => (
                                    <li
                                        key={workout.id}
                                        className="border p-4 rounded bg-background shadow-sm"
                                    >
                                        <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                                            <span>{new Date(workout.date).toLocaleDateString()}</span>
                                            <DeleteWorkoutButton workoutId={workout.id} />
                                        </div>

                                        {/* ✅ Workout Notes */}
                                        {workout.notes && (
                                            <p className="text-sm mt-1 text-gray-500 italic">
                                                📝 {workout.notes}
                                            </p>
                                        )}

                                        {workout.workout_exercises.map((we: any) => (
                                            <div key={we.id} className="mb-3">
                                                <p className="font-medium flex items-center gap-1">
                                                    <span>{getCategoryIcon(we.exercise.category)}</span>
                                                    {we.exercise.name}
                                                    <span className="text-gray-500 text-sm">
                                                        ({we.exercise.category})
                                                    </span>
                                                </p>

                                                <ul className="ml-4 mt-1 text-sm text-gray-300 list-disc">
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
                    <p className="text-gray-600">No workouts logged yet.</p>
                )}
            </div>
        </div>
    );
}
