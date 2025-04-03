"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function QuickAddExercisePage() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("weight_training");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("exercises").insert([{ name, category }]);

        setLoading(false);

        if (error) {
            console.error("Failed to add exercise:", error.message);
            return;
        }

        // Redirect or show success
        router.push("/profile/[id]/dashboard"); // ✅ Adjust this if needed
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Quick Add Exercise</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">
                        <span className="label-text">Exercise Name</span>
                    </label>
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
                    <label htmlFor="category" className="label">
                        <span className="label-text">Category</span>
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

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Exercise"}
                </button>
            </form>
        </div>
    );
}
