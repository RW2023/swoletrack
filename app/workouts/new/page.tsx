import { createClient } from "@/utils/supabase/server";
import WorkoutForm from "./workout-form";

export default async function NewWorkoutPage() {
    const supabase = await createClient();
    const { data: exercises } = await supabase
        .from("exercises")
        .select("id, name, category")
        .order("name");

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Log a New Workout</h1>
            <WorkoutForm exercises={exercises || []} />
        </div>
    );
}
