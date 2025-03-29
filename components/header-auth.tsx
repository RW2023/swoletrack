import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  // 1) Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If .env variables aren't set, return some fallback UI
  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <Badge variant={"default"} className="font-normal pointer-events-none">
          Please update .env.local with anon key & url
        </Badge>
        <div className="flex gap-2">
          <Button asChild size="sm" variant={"outline"} disabled>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={"default"} disabled>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 2) If user is logged in, fetch their profile
  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
    }

    const displayName = profile?.name || user.email;
    const avatarUrl = profile?.avatar_url;

    return (
      <div className="flex items-center gap-4">
        {avatarUrl && (
          <Link href={`/profile/${user.id}`} className="shrink-0">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-8 h-8 object-cover rounded-full border hover:ring-2 hover:ring-primary"
            />
          </Link>
        )}

        <span className="font-semibold">Hi,</span> {displayName}!
       
        <form action={signOutAction}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  // 4) If not logged in, show sign in/sign up buttons
  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
