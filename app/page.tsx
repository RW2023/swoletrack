import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-base-100 text-base-content">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">
        Welcome to <span className="text-primary">SwoleTrac 💪</span>
      </h1>

      <p className="text-lg max-w-xl text-muted-foreground mb-8">
        A simple, personal workout tracker built to help you stay consistent, track progress, and level up your fitness.
        Originally made for myself, now shared with anyone looking to take control of their training.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/sign-up"
          className="btn btn-primary text-lg"
        >
          Get Started
        </Link>
        <Link
          href="/workouts/new"
          className="btn btn-outline text-lg"
        >
          Log a Workout
        </Link>
      </div>
    </main>
  );
}
