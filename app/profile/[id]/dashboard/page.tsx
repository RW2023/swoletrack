import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

import QuickAddFAB from "@/components/dashboard/QuickAddFAB";
import WeeklyWorkoutSection from "@/components/dashboard/WeeklyWorkoutSection";
import PersonalRecords from "@/components/dashboard/PersonalRecords";
import WorkoutStreaks from "@/components/dashboard/WorkoutStreaks";
import MostFrequentExercises from "@/components/dashboard/MostFrequentExercises";
import DashboardStats from "@/components/dashboard/DashboardStats";

export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>;
}

function getWeekLabel(dateStr: string) {
    const date = new Date(dateStr);
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `Week of ${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })} – ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })}`;
}

export default async function DashboardPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== id) notFound();

    const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

    if (!profile) notFound();

    const { data: workouts } = await supabase
        .from("workouts")
        .select(`
            id,
            date,
            notes,
            workout_exercises (
                id,
                exercise: exercises (
                    name,
                    category
                ),
                sets (
                    set_number,
                    reps,
                    weight,
                    duration
                )
            )
        `)
        .eq("user_id", user.id)
        .order("date", { ascending: false });

    const groupedByWeek: Record<string, any[]> = {};
    workouts?.forEach((workout) => {
        const weekLabel = getWeekLabel(workout.date);
        if (!groupedByWeek[weekLabel]) groupedByWeek[weekLabel] = [];
        groupedByWeek[weekLabel].push(workout);
    });

    const allSets =
        workouts?.flatMap((w) => w.workout_exercises.flatMap((e: any) => e.sets)) || [];

    const totalWorkouts = workouts?.length || 0;
    const totalSets = allSets.length;
    const totalVolume = allSets.reduce(
        (sum, set: any) => sum + (set.reps ?? 0) * (set.weight ?? 0),
        0
    );

    const personalRecordsMap = new Map<string, number>();
    workouts?.forEach((workout) => {
        workout.workout_exercises.forEach((exerciseBlock: any) => {
            const name = exerciseBlock.exercise.name;
            exerciseBlock.sets.forEach((set: any) => {
                const currentPR = personalRecordsMap.get(name) || 0;
                const setWeight = set.weight ?? 0;
                if (setWeight > currentPR) {
                    personalRecordsMap.set(name, setWeight);
                }
            });
        });
    });

    const personalRecords = Array.from(personalRecordsMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const workoutDatesSorted = Array.from(
        new Set((workouts ?? []).map((w) => {
            const d = new Date(w.date);
            d.setUTCHours(0, 0, 0, 0);
            return d.toISOString();
        }))
    )
        .map((iso) => new Date(iso))
        .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let prev = new Date();
    prev.setUTCHours(0, 0, 0, 0);

    for (const date of workoutDatesSorted) {
        const d = new Date(date);
        d.setUTCHours(0, 0, 0, 0);
        const diff = (prev.getTime() - d.getTime()) / 86400000;

        if (diff === 0 || diff === 1) {
            currentStreak++;
            prev = d;
        } else {
            break;
        }
    }

    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < workoutDatesSorted.length; i++) {
        const prev = workoutDatesSorted[i - 1];
        const curr = workoutDatesSorted[i];
        const diff = (prev.getTime() - curr.getTime()) / 86400000;

        if (diff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    if (workoutDatesSorted.length === 0) {
        currentStreak = 0;
        longestStreak = 0;
    }

    const exerciseFrequency = new Map<string, number>();
    workouts?.forEach((workout) => {
        workout.workout_exercises.forEach((we: any) => {
            const name = we.exercise.name;
            exerciseFrequency.set(name, (exerciseFrequency.get(name) || 0) + 1);
        });
    });

    const mostFrequentExercises = Array.from(exerciseFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const currentWeek = getWeekLabel(new Date().toISOString());

    return (
        <div className="p-6 max-w-5xl mx-auto text-base-content space-y-8">
            <h1 className="text-3xl font-bold mb-2">
                {profile?.name ? `${profile.name}'s Dashboard` : "Dashboard"}
            </h1>

            <p className="text-sm text-muted-foreground">
                Track your workouts, view stats, and maintain streaks.
            </p>

            <DashboardStats
                totalWorkouts={totalWorkouts}
                totalSets={totalSets}
                totalVolume={totalVolume}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <PersonalRecords records={personalRecords} name={profile?.name} />
                <WorkoutStreaks currentStreak={currentStreak} longestStreak={longestStreak} />
            </div>

            <MostFrequentExercises
                mostFrequent={mostFrequentExercises}
                userId={user.id}
                userName={profile?.name}
            />

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">The Work</h2>
                <Link href="/workouts/new" className="btn btn-primary">
                    + Log New Workout
                </Link>
            </div>

            {(!workouts || workouts.length === 0) && (
                <div className="alert alert-info shadow-sm">
                    <span>You have no workouts logged yet.</span>
                </div>
            )}

            <WeeklyWorkoutSection
                groupedByWeek={groupedByWeek}
                currentWeekLabel={currentWeek}
                userName={profile.name}
            />

            <QuickAddFAB />
        </div>
    );
}
