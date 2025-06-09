import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex flex-col items-center justify-center max-w-7xl px-4 py-20 text-center space-y-10">
      {/* Logo */}
      <div className="relative w-40 h-40 sm:w-56 sm:h-56">
        <Image
          src="/logo.png"
          alt="SwoleTrac Logo"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* App Title */}
      <h1 className="text-4xl md:text-5xl font-bold">
        Welcome to <span className="text-primary">SwoleTrac 💪</span>
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl max-w-2xl text-muted-foreground">
        Your personal workout tracker — designed to keep you consistent, motivated, and growing stronger.
      </p>

      {/* Feature Cards */}
      <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <h3 className="text-xl font-semibold mb-2">🏋️ Track Everything</h3>
          <p className="text-sm text-muted-foreground">
            Log your workouts with sets, reps, weight, and duration — whether it's weightlifting, cardio, or calisthenics.
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <h3 className="text-xl font-semibold mb-2">📈 Visualize Progress</h3>
          <p className="text-sm text-muted-foreground">
            See your total volume, personal records, streaks, and most frequent exercises — all in one dashboard.
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <h3 className="text-xl font-semibold mb-2">⚡ Quick Add</h3>
          <p className="text-sm text-muted-foreground">
            Out in the gym? Use the quick-add feature to log new exercises or workouts on the fly with just a few taps.
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/sign-up" className="btn bg-primary text-primary-foreground text-lg">
          Get Started
        </Link>
        <Link href="/workouts/new" className="btn border border-primary text-primary bg-transparent text-lg">
          Log a Workout
        </Link>
      </div>
    </section>
  );
}
