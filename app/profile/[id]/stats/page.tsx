import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ExerciseStatsClient from "./ExerciseStatsClient";

export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ExerciseStatsPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== id) notFound();

    const { data: setsData } = await supabase.rpc("exercise_stats_view", {
        user_id_input: user.id,
    });

    if (!setsData || setsData.length === 0) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Exercise Stats</h1>
                <p className="text-muted-foreground">No tracked data found.</p>
            </div>
        );
    }

    // Group and format
    const grouped: Record<string, any[]> = {};
    for (const entry of setsData) {
        if (!grouped[entry.name]) grouped[entry.name] = [];
        grouped[entry.name].push(entry);
    }

    const exerciseBlocks = Object.entries(grouped).map(([name, sets]) => {
        const muscleGroup = sets[0].muscle_group || "Other";
        const description = sets[0].description;
        const totalSets = sets.length;

        const weights = sets.map((s) => s.weight ?? 0).filter((w) => w > 0);
        const repsVolume = sets.reduce(
            (sum, set) => sum + (set.reps ?? 0) * (set.weight ?? 0),
            0
        );

        const max = weights.length ? Math.max(...weights) : null;
        const min = weights.length ? Math.min(...weights) : null;
        const setRange = max && min ? max - min : null;
        const isWeightBased = weights.length > 0;

        const setsByWeek: Record<string, number[]> = {};
        for (const s of sets) {
            const d = new Date(s.date);
            const monday = new Date(d);
            monday.setDate(d.getDate() - d.getDay() + 1);
            const weekStr = monday.toISOString().split("T")[0];
            if (!setsByWeek[weekStr]) setsByWeek[weekStr] = [];
            if (s.weight > 0) setsByWeek[weekStr].push(s.weight);
        }

        const sortedWeeks = Object.keys(setsByWeek).sort();
        let progress: number | null = null;
        if (sortedWeeks.length >= 2) {
            const prev = setsByWeek[sortedWeeks[sortedWeeks.length - 2]];
            const curr = setsByWeek[sortedWeeks[sortedWeeks.length - 1]];
            const avgPrev = prev.reduce((a, b) => a + b, 0) / prev.length;
            const avgCurr = curr.reduce((a, b) => a + b, 0) / curr.length;
            progress = Math.round(avgCurr - avgPrev);
        }

        return {
            name,
            muscleGroup,
            description,
            totalSets,
            repsVolume,
            max,
            min,
            setRange,
            progress,
            isWeightBased,
        };
    });

    return (
        <ExerciseStatsClient userId={user.id} exerciseBlocks={exerciseBlocks} />
    );
}
