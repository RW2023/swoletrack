import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const supabase = await createClient();

    // Get logged-in user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== id) {
        notFound();
    }

    // Fetch recent workouts for this user
    const { data: workouts, error } = await supabase
        .from("workouts")
        .select("id, date, notes")
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
                    <ul className="space-y-2">
                        {workouts.map((workout) => (
                            <li key={workout.id} className="border p-4 rounded shadow-sm">
                                <div className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString()}</div>
                                {workout.notes && <p className="mt-1">{workout.notes}</p>}
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
