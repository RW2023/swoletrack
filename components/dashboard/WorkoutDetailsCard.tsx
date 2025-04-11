'use client';

import { DeleteWorkoutButton } from "@/components/delete-workout-button";
import { getCategoryIcon } from "@/utils/getCategoryIcon";

interface WorkoutDetailsCardProps {
    workout: any;
}

export default function WorkoutDetailsCard({ workout }: WorkoutDetailsCardProps) {
    return (
        <li className="border p-4 rounded bg-base-100 shadow-sm">
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
                        {we.exercise.name}{" "}
                        <span className="text-sm text-muted-foreground">
                            ({we.exercise.category.replace("_", " ")})
                        </span>
                    </p>
                    <ul className="ml-4 mt-1 text-sm text-muted-foreground list-disc">
                        {we.sets.map((set: any, index: number) => (
                            <li key={index}>
                                {we.exercise.category === "cardio"
                                    ? `${set.duration} min${set.duration > 1 ? "s" : ""}`
                                    : `${set.reps} reps @ ${set.weight} lbs`}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </li>
    );
}
