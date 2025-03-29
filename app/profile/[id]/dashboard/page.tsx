import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DeleteWorkoutButton } from "@/components/delete-workout-button";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

// ✅ Helper to show category icons
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

    if (!user || user.id !== id) {
        notFound();
    }

    const { data: workouts, error } = await supabase
        .from("workouts")
        .select(`
      id,
      date,
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
        .order("date", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching workouts:", error.message);
        notFound();
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Workouts</h2>
                <Link
                    href="/workouts/new"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    + Log New Workout
                </Link>

                {workouts && workouts.length > 0 ? (
                    <ul className="space-y-4">
                        {workouts.map((workout) => (
                            <li key={workout.id} className="border p-4 rounded shadow-sm">
                                <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                                    <span>{new Date(workout.date).toLocaleDateString()}</span>
                                    <DeleteWorkoutButton workoutId={workout.id} />
                                </div>

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
                ) : (
                    <p className="text-gray-600">No workouts logged yet.</p>
                )}
            </div>
        </div>
    );
}
