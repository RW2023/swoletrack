"use client";

import { useState } from "react";
import { logWorkoutAction } from "./actions";

export default function WorkoutForm({ exercises }: { exercises: any[] }) {
    const [exerciseId, setExerciseId] = useState<string>("");
    const [sets, setSets] = useState<{ reps: string; weight: string }[]>([
        { reps: "", weight: "" },
    ]);

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("exerciseId", exerciseId);
            formData.append("sets", JSON.stringify(sets));
            await logWorkoutAction(formData);
            setSubmitted(true);
        } catch (err) {
            console.error("Submission failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exercise Picker */}
            <div>
                <label htmlFor="exercise-select" className="font-medium block mb-1">
                    Select Exercise
                </label>
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

            {/* Submit feedback */}
            {submitted && (
                <p className="text-green-600 font-medium">
                    Workout logged successfully!
                </p>
            )}

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={submitting}
            >
                {submitting ? "Logging..." : "Log Workout"}
            </button>
        </form>
    );
}
