'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickAddExercisePage() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('weight_training');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/quick-add-exercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, category, muscle_group: muscleGroup }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || 'Failed to add exercise.');
            return;
        }

        router.back();
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Quick Add Exercise</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter exercise name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block font-medium mb-1">
                        Category
                    </label>
                    <select
                        id="category"
                        className="select select-bordered w-full"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="weight_training">Weight Training</option>
                        <option value="cardio">Cardio</option>
                        <option value="calisthenics">Calisthenics</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="muscleGroup" className="block font-medium mb-1">
                        Muscle Group
                    </label>
                    <select
                        id="muscleGroup"
                        className="select select-bordered w-full"
                        value={muscleGroup}
                        onChange={(e) => setMuscleGroup(e.target.value)}
                        required
                    >
                        <option value="">Select Muscle Group</option>
                        <option value="Chest">Chest</option>
                        <option value="Back">Back</option>
                        <option value="Legs">Legs</option>
                        <option value="Arms">Arms</option>
                        <option value="Shoulders">Shoulders</option>
                        <option value="Core">Core</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Full Body">Full Body</option>
                    </select>
                </div>

                {error && <p className="text-error">{error}</p>}

                <button type="submit" className="btn btn-primary w-full">
                    Add Exercise
                </button>
            </form>
        </div>
    );
}
