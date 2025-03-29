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
    <div className="flex-1 w-full flex flex-col gap-12 p-6">
      <div className="bg-accent text-sm p-4 rounded-md text-foreground">
        <p className="font-semibold">Welcome to SwoleTrac, {user.email} 👋</p>
        <p className="mt-1">You're successfully logged in and ready to go.</p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl">Quick Links</h2>
        <ul className="space-y-2 text-blue-600 font-medium">
          <li>
            <Link href={`/profile/${user.id}/dashboard`} className="hover:underline">
              📊 View Your Dashboard
            </Link>
          </li>
          <li>
            <Link href="/workouts/new" className="hover:underline">
              ➕ Log a Workout
            </Link>
          </li>
          <li>
            <Link href={`/profile/${user.id}`} className="hover:underline">
              ⚙️ Edit Your Profile
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-xl mt-8">Announcements</h2>
        <p className="text-muted-foreground mt-2">
          Stay tuned — more features and tracking tools are coming soon.
        </p>
      </div>
    </div>
  );
}
