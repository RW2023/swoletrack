"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ✅ Update avatar
export async function updateAvatarAction(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("avatar") as File;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !file) return;

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError.message);
    throw new Error(uploadError.message);
  }

  const avatarUrl = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath).data.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error updating avatar in profile:", updateError.message);
    throw new Error(updateError.message);
  }

  revalidatePath(`/profile/${user.id}`);
}

// ✅ Update name
export async function updateNameAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !name) return;

  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating name:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/profile/${user.id}`);
}

// ✅ Delete workout
export async function deleteWorkoutAction(workoutId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);

  revalidatePath(`/profile/${user.id}/dashboard`);
}
