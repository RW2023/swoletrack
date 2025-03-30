import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect_to") || "/protected";
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // Exchange the auth code for a session
    await supabase.auth.exchangeCodeForSession(code);

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Check if profile exists
      const { data: existingProfile, error: profileFetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileFetchError && profileFetchError.code !== "PGRST116") {
        console.error("Error checking existing profile:", profileFetchError.message);
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          name: user.email?.split("@")[0] ?? "New User",
          avatar_url: "",
          created_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creating profile:", insertError.message);
        }
      }

      // Redirect to their profile page
      return NextResponse.redirect(`${origin}/profile/${user.id}`);
    }
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
