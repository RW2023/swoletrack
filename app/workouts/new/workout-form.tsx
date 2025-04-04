"use client";

import { useState } from "react";
import { logWorkoutAction } from "./actions";

type Exercise = {
    id: string;
    name: string;
    category: string;
};

export default function WorkoutForm({ exercises }: { exercises: Exercise[] }) {
    const [exerciseId, setExerciseId] = useState("");
    const [category, setCategory] = useState("");
    const [sets, setSets] = useState<{ reps?: string; weight?: string; duration?: string }[]>([
        { reps: "", weight: "" },
    ]);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // NEW: State to track the search term
    const [searchTerm, setSearchTerm] = useState("");

    // Filter exercises by search term
    const filteredExercises = exercises.filter((ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateSet = (
        index: number,
        field: "reps" | "weight" | "duration",
        value: string
    ) => {
        const updated = [...sets];
        updated[index][field] = value;
        setSets(updated);
    };

    const addSet = () => {
        setSets((prev) => [
            ...prev,
            category === "cardio" ? { duration: "" } : { reps: "", weight: "" },
        ]);
    };

    const handleExerciseChange = (id: string) => {
        setExerciseId(id);
        const selected = exercises.find((ex) => ex.id === id);
        setCategory(selected?.category || "");
        setSets([
            selected?.category === "cardio" ? { duration: "" } : { reps: "", weight: "" },
        ]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("exerciseId", exerciseId);
            formData.append("sets", JSON.stringify(sets));
            formData.append("notes", notes);

            await logWorkoutAction(formData);
            setSubmitted(true);
            setNotes("");
        } catch (err) {
            console.error("Submission failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Search input */}
            <div>
                <label htmlFor="exercise-search" className="font-medium block mb-1">
                    Search Exercises
                </label>
                <input
                    id="exercise-search"
                    type="text"
                    className="block w-full p-2 border rounded mb-4"
                    placeholder="Type to filter exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Exercise dropdown */}
            <div>
                <label htmlFor="exercise-select" className="font-medium block mb-1">
                    Select Exercise
                </label>
                <select
                    id="exercise-select"
                    value={exerciseId}
                    onChange={(e) => handleExerciseChange(e.target.value)}
                    className="block w-full p-2 border rounded"
                    required
                >
                    <option value="">Choose one...</option>
                    {filteredExercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                            {exercise.name} ({exercise.category})
                        </option>
                    ))}
                </select>
            </div>

            {/* Set Inputs */}
            <div className="space-y-2">
                <label className="font-medium block">Sets</label>
                {sets.map((set, index) => (
                    <div key={index} className="flex gap-4">
                        {category === "cardio" ? (
                            <input
                                type="number"
                                placeholder="Duration (min)"
                                value={set.duration}
                                onChange={(e) => updateSet(index, "duration", e.target.value)}
                                className="w-40 p-2 border rounded"
                                required
                            />
                        ) : (
                            <>
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
                            </>
                        )}
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

            {/* Notes */}
            <div>
                <label className="block font-medium mb-1">Notes (optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Optional notes for this workout..."
                />
            </div>

            {submitted && (
                <p className="text-green-600 font-medium">Workout logged successfully!</p>
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
