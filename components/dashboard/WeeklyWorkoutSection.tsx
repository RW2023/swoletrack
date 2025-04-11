'use client';

import { useMemo } from 'react';
import WeeklySummary from './WeeklySummary';
import { DeleteWorkoutButton } from '@/components/delete-workout-button';
import { getCategoryIcon } from '@/utils/getCategoryIcon';
import type { WorkoutFilterState } from './WorkoutFilter';

type WeeklyWorkoutSectionProps = {
    groupedByWeek: Record<string, any[]>;
    currentWeekLabel: string;
    userName: string;
    filters: WorkoutFilterState;
};

export default function WeeklyWorkoutSection({
    groupedByWeek,
    currentWeekLabel,
    userName,
    filters,
}: WeeklyWorkoutSectionProps) {
    const { category, keyword } = filters;

    const filteredWeeks = useMemo(() => {
        const result: typeof groupedByWeek = {};

        for (const [week, workouts] of Object.entries(groupedByWeek)) {
            const filtered = workouts.filter((workout) =>
                workout.workout_exercises.some((we: any) => {
                    const matchesCategory = !category || we.exercise.category === category;
                    const matchesKeyword =
                        !keyword || we.exercise.name.toLowerCase().includes(keyword.toLowerCase());
                    return matchesCategory && matchesKeyword;
                })
            );
            if (filtered.length > 0) {
                result[week] = filtered;
            }
        }

        return result;
    }, [groupedByWeek, category, keyword]);

    return (
        <>
            {Object.entries(filteredWeeks).map(([week, weekWorkouts]) => {
                const isCurrentWeek = week === currentWeekLabel;

                const allSetsThisWeek =
                    weekWorkouts?.flatMap((w) => w.workout_exercises.flatMap((e: any) => e.sets)) || [];
                const weekTotalSets = allSetsThisWeek.length;
                const weekTotalVolume = allSetsThisWeek.reduce(
                    (sum, set: any) => sum + (set.reps ?? 0) * (set.weight ?? 0),
                    0
                );

                // group workouts by day
                const workoutsByDay = weekWorkouts.reduce((acc: Record<string, any[]>, workout) => {
                    const dateStr = new Date(workout.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                    });
                    if (!acc[dateStr]) acc[dateStr] = [];
                    acc[dateStr].push(workout);
                    return acc;
                }, {} as Record<string, any[]>);

                return (
                    <details
                        key={week}
                        open={isCurrentWeek}
                        className={`border rounded p-4 mt-4 shadow-sm ${isCurrentWeek ? 'border-primary bg-primary/10' : 'bg-base-200'
                            }`}
                    >
                        <summary className="font-semibold cursor-pointer text-lg mb-2 flex items-center justify-between">
                            <span>{week}</span>
                            <span className="text-sm text-muted-foreground">
                                {weekWorkouts.length} workout(s), {weekTotalSets} sets, {weekTotalVolume} lbs
                            </span>
                        </summary>

                        <WeeklySummary week={week} workouts={weekWorkouts} userName={userName} />

                        <ul className="space-y-6 mt-2">
                            {Object.entries(workoutsByDay).map(([dayLabel, dayWorkouts]) => (
                                <li key={dayLabel}>
                                    <h3 className="text-base font-semibold text-muted-foreground mb-2">{dayLabel}</h3>
                                    <ul className="space-y-4">
                                        {dayWorkouts.map((workout) => (
                                            <li key={workout.id} className="border p-4 rounded bg-base-100 shadow-sm">
                                                <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                                                    <span>{new Date(workout.date).toLocaleDateString()}</span>
                                                    <DeleteWorkoutButton workoutId={workout.id} />
                                                </div>

                                                {workout.notes && (
                                                    <p className="text-sm italic text-muted-foreground">📝 {workout.notes}</p>
                                                )}

                                                {workout.workout_exercises.map((we: any) => (
                                                    <div key={we.id} className="mb-3">
                                                        <p className="font-medium flex items-center gap-1">
                                                            <span>{getCategoryIcon(we.exercise.category)}</span>
                                                            {we.exercise.name}{' '}
                                                            <span className="text-sm text-muted-foreground">
                                                                ({we.exercise.category.replace('_', ' ')})
                                                            </span>
                                                        </p>
                                                        <ul className="ml-4 mt-1 text-sm text-muted-foreground list-disc">
                                                            {we.sets.map((set: any, index: number) => (
                                                                <li key={index}>
                                                                    {we.exercise.category === 'cardio'
                                                                        ? `${set.duration} min${set.duration > 1 ? 's' : ''}`
                                                                        : `${set.reps} reps @ ${set.weight} lbs`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </details>
                );
            })}
        </>
    );
}
