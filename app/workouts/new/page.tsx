// app/workouts/new/page.tsx

import QuickAddFAB from "@/components/dashboard/QuickAddFAB";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import WorkoutForm from "./workout-form";

export default async function NewWorkoutPage() {
    const supabase = await createClient();

    // 🔐 Get the authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 🚫 If not logged in, redirect to sign-in page
    if (!user) {
        return redirect("/sign-in");
    }

    // ✅ Fetch exercises for the dropdown
    const { data: exercises } = await supabase
        .from("exercises")
        .select("id, name, category")
        .order("name");

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Log a New Workout</h1>
            <WorkoutForm exercises={exercises || []} />

            {/* Fixed-positioned Quick Add FAB */}
            <QuickAddFAB />
        </div>
    );
}
