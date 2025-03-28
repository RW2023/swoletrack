// app/profile/[id]/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Server Action that handles file upload, updates 'profiles', 
 * and then redirects back to the user's profile.
 */
export async function updateAvatarAction(formData: FormData) {
  // 1) Get the File object from the <input name="avatar" />
  const file = formData.get("avatar") as File | null;
  if (!file) {
    console.log("No file provided");
    return;
  }

  // 2) Create a Supabase client on the server
  const supabase = await createClient();

  // 3) Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No authenticated user found:", userError);
    return;
  }

  // 4) Generate a unique file name (e.g., 'userId-timestamp.jpg')
  const ext = file.name.split(".").pop(); // e.g. 'jpg' or 'png'
  const fileName = `${user.id}-${Date.now()}.${ext}`;

  // 5) Upload the file to the 'avatars' bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: false, // or true if you want to overwrite existing files
    });

  if (uploadError) {
    console.error("Error uploading file:", uploadError.message);
    return;
  }

  // 6) Get a public URL (assuming your bucket is public)
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

  if (!publicUrl) {
    console.error("Could not retrieve public URL for uploaded image");
    return;
  }

  // 7) Update the 'profiles' table with the avatar URL
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (profileError) {
    console.error("Error updating profile:", profileError.message);
    return;
  }

  // 8) Redirect the user back to their profile page
  return redirect(`/profile/${user.id}`);
}