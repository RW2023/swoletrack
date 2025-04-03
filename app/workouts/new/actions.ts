"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logWorkoutAction(formData: FormData) {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error("Not authenticated");
    return;
  }

  // 2. Extract form data
  const exerciseId = formData.get("exerciseId") as string;
  const setsJson = formData.get("sets") as string;
  const notes = formData.get("notes")?.toString() || null;

  if (!exerciseId || !setsJson) {
    console.error("Missing form data");
    return;
  }

  const sets = JSON.parse(setsJson);

  // 3. Fetch exercise to determine category
  const { data: exercise, error: exerciseError } = await supabase
    .from("exercises")
    .select("category")
    .eq("id", exerciseId)
    .single();

  if (exerciseError || !exercise) {
    console.error("Error fetching exercise category:", exerciseError?.message);
    return;
  }

  const isCardio = exercise.category === "cardio";

  // 4. Create workout row
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      date: new Date(),
      notes,
    })
    .select()
    .single();

  if (workoutError) {
    console.error("Error creating workout:", workoutError.message);
    return;
  }

  // 5. Link to exercise
  const { data: workoutExercise, error: linkError } = await supabase
    .from("workout_exercises")
    .insert({
      workout_id: workout.id,
      exercise_id: exerciseId,
      order: 1,
    })
    .select()
    .single();

  if (linkError) {
    console.error("Error linking exercise:", linkError.message);
    return;
  }

  // 6. Insert sets — cardio or regular
  const formattedSets = sets.map((set: any, i: number) => ({
    workout_exercise_id: workoutExercise.id,
    set_number: i + 1,
    ...(isCardio
      ? { duration: Number(set.duration) }
      : {
          reps: Number(set.reps),
          weight: Number(set.weight),
        }),
  }));

  const { error: setError } = await supabase.from("sets").insert(formattedSets);

  if (setError) {
    console.error("Error inserting sets:", setError.message);
    return;
  }

  // 7. Redirect to dashboard
  return redirect(`/profile/${user.id}/dashboard`);
}
