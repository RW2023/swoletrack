'use client';

import WeeklySummary from "@/components/dashboard/WeeklySummary";
import WorkoutDetailsCard from "@/components/dashboard/WorkoutDetailsCard";

interface WeeklyWorkoutSectionProps {
    groupedByWeek: Record<string, any[]>;
    currentWeekLabel: string;
    userName: string;
}

export default function WeeklyWorkoutSection({
    groupedByWeek,
    currentWeekLabel,
    userName,
}: WeeklyWorkoutSectionProps) {
    return (
        <>
            {Object.entries(groupedByWeek).map(([week, weekWorkouts]) => {
                const isCurrentWeek = week === currentWeekLabel;
                const allSetsThisWeek =
                    weekWorkouts?.flatMap((w) =>
                        w.workout_exercises.flatMap((e: any) => e.sets)
                    ) || [];

                const weekTotalSets = allSetsThisWeek.length;
                const weekTotalVolume = allSetsThisWeek.reduce(
                    (sum, set: any) => sum + (set.reps ?? 0) * (set.weight ?? 0),
                    0
                );

                return (
                    <details
                        key={week}
                        open={isCurrentWeek}
                        className={`border rounded p-4 mt-4 shadow-sm ${isCurrentWeek ? "border-primary bg-primary/10" : "bg-base-200"
                            }`}
                    >
                        <summary className="font-semibold cursor-pointer text-lg mb-2 flex items-center justify-between">
                            <span>{week}</span>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal ml-4">
                                <span>
                                    {weekWorkouts?.length || 0} workout(s), {weekTotalSets} sets,{" "}
                                    {weekTotalVolume} lbs
                                </span>
                            </div>
                        </summary>

                        <WeeklySummary
                            week={week}
                            workouts={weekWorkouts ?? []}
                            userName={userName}
                        />

                        <ul className="space-y-4 mt-2">
                            {weekWorkouts?.map((workout) => (
                                <WorkoutDetailsCard key={workout.id} workout={workout} />
                            ))}
                        </ul>
                    </details>
                );
            })}
        </>
    );
}
