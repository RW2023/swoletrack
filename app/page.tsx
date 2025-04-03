import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-base-100 text-base-content">
      {/* Logo */}
      <div className="relative w-40 h-40 sm:w-56 sm:h-56 mb-6">
        <Image
          src="/logo.png"
          alt="SwoleTrac Logo"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* App Title */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-2">
        Welcome to <span className="text-primary">SwoleTrac 💪</span>
      </h1>

      {/* Tagline */}
      <p className="text-lg sm:text-xl max-w-2xl text-muted-foreground mb-10">
        Your personal workout tracker — designed to keep you consistent, motivated, and growing stronger.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mb-12">
        <div className="card bg-base-200 shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">🏋️ Track Everything</h3>
          <p className="text-sm text-muted-foreground">
            Log your workouts with sets, reps, weight, and duration — whether it's weightlifting, cardio, or calisthenics.
          </p>
        </div>

        <div className="card bg-base-200 shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">📈 Visualize Progress</h3>
          <p className="text-sm text-muted-foreground">
            See your total volume, personal records, streaks, and most frequent exercises — all in one dashboard.
          </p>
        </div>

        <div className="card bg-base-200 shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">⚡ Quick Add</h3>
          <p className="text-sm text-muted-foreground">
            Out in the gym? Use the quick-add feature to log new exercises or workouts on the fly with just a few taps.
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/sign-up" className="btn btn-primary text-lg">
          Get Started
        </Link>
        <Link href="/workouts/new" className="btn btn-outline text-lg">
          Log a Workout
        </Link>
      </div>
    </main>
  );
}
