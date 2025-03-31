// app/protected/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-6 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="alert bg-accent text-foreground border border-border shadow-md">
        <div>
          <h1 className="font-bold text-lg">
            👋 Welcome to SwoleTrac, <span className="text-primary">{user.email}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            You're successfully logged in and ready to go.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="font-bold text-2xl text-foreground">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <Link
              href={`/profile/${user.id}/dashboard`}
              className="btn btn-outline btn-primary w-full text-left"
            >
              📊 View Your Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/workouts/new"
              className="btn btn-outline btn-success w-full text-left"
            >
              ➕ Log a Workout
            </Link>
          </li>
          <li>
            <Link
              href={`/profile/${user.id}`}
              className="btn btn-outline btn-secondary w-full text-left"
            >
              ⚙️ Edit Your Profile
            </Link>
          </li>
        </ul>
      </div>

      {/* Announcements */}
      <div className="mt-10">
        <h2 className="font-bold text-xl text-foreground">📣 Announcements</h2>
        <p className="text-muted-foreground mt-2">
          Stay tuned — more features and tracking tools are coming soon!
        </p>
      </div>
    </div>
  );
}
