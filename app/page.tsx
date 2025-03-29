import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to SwoleTrac 💪</h1>
      <p className="text-lg max-w-xl text-muted-foreground mb-8">
        A simple, personal workout tracker built to help you stay consistent, track progress, and level up your fitness.
        Originally built for myself, but made to be shared.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/sign-up"
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
        <Link
          href="/workouts/new"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded text-lg font-medium hover:bg-blue-50 transition"
        >
          Log a Workout
        </Link>
      </div>
    </main>
  );
}
