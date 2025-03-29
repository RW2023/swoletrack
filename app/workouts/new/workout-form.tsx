// app/workouts/new/workout-form.tsx
"use client";

import { useState } from "react";

export default function WorkoutForm({ exercises }: { exercises: any[] }) {
    const [exerciseId, setExerciseId] = useState<string>("");
    const [sets, setSets] = useState<{ reps: string; weight: string }[]>([
        { reps: "", weight: "" },
    ]);

    const updateSet = (
        index: number,
        field: "reps" | "weight",
        value: string
    ) => {
        const updated = [...sets];
        updated[index][field] = value;
        setSets(updated);
    };

    const addSet = () => {
        setSets((prev) => [...prev, { reps: "", weight: "" }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Send data to server
        console.log({ exerciseId, sets });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exercise Picker */}
            <div>
                <label htmlFor="exercise-select" className="font-medium block mb-1">Select Exercise</label>
                <select
                    id="exercise-select"
                    value={exerciseId}
                    onChange={(e) => setExerciseId(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                >
                    <option value="">Choose one...</option>
                    {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                            {exercise.name} ({exercise.category})
                        </option>
                    ))}
                </select>
            </div>

            {/* Sets */}
            <div className="space-y-2">
                <label className="font-medium block">Sets</label>
                {sets.map((set, index) => (
                    <div key={index} className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Reps"
                            value={set.reps}
                            onChange={(e) => updateSet(index, "reps", e.target.value)}
                            className="w-24 p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Weight"
                            value={set.weight}
                            onChange={(e) => updateSet(index, "weight", e.target.value)}
                            className="w-28 p-2 border rounded"
                            required
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addSet}
                    className="text-sm text-blue-600 hover:underline"
                >
                    + Add Set
                </button>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Log Workout
            </button>
        </form>
    );
}
