"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Server Action that handles file upload, updates 'profiles', 
 * and then redirects back to the user's profile.
 */
export async function updateAvatarAction(formData: FormData) {
  const file = formData.get("avatar") as File | null;
  if (!file) {
    console.log("No file provided");
    return;
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No authenticated user found:", userError);
    return;
  }

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading file:", uploadError.message);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

  if (!publicUrl) {
    console.error("Could not retrieve public URL for uploaded image");
    return;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (profileError) {
    console.error("Error updating profile:", profileError.message);
    return;
  }

  return redirect(`/profile/${user.id}`);
}

/**
 * Deletes a workout and its related data using ON DELETE CASCADE.
 */
export async function deleteWorkoutAction(workoutId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    return;
  }

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId);

  if (error) {
    console.error("Error deleting workout:", error.message);
    return;
  }

  return redirect(`/profile/${user.id}/dashboard`);
}
