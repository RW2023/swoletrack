"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";

// Register chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Types
type Set = {
    reps: number;
    weight: number;
};

type Exercise = {
    sets: Set[];
};

type Workout = {
    date: string;
    workout_exercises: Exercise[];
};

// ✅ No need to export props separately, just inline the props type
export default function VolumeChart({ workouts }: { workouts: Workout[] }) {
    const chartData = useMemo(() => {
        const volumeMap = new Map<string, number>();

        for (const workout of workouts) {
            const date = new Date(workout.date).toLocaleDateString();

            const workoutVolume = workout.workout_exercises.reduce((sum, ex) => {
                return sum + ex.sets.reduce((acc, set) => acc + set.reps * set.weight, 0);
            }, 0);

            volumeMap.set(date, (volumeMap.get(date) || 0) + workoutVolume);
        }

        const sortedDates = Array.from(volumeMap.keys()).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        return {
            labels: sortedDates,
            datasets: [
                {
                    label: "Workout Volume (lbs)",
                    data: sortedDates.map((date) => volumeMap.get(date) || 0),
                    borderColor: "hsl(var(--primary))",
                    backgroundColor: "hsl(var(--primary))",
                    tension: 0.3,
                },
            ],
        };
    }, [workouts]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "hsl(var(--foreground))",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) =>
                        `${context.dataset.label}: ${context.formattedValue} lbs`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "hsl(var(--foreground))",
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "hsl(var(--foreground))",
                },
            },
        },
    };

    return (
        <div className="bg-base-100 p-4 border rounded shadow-sm h-80">
            <Line data={chartData} options={options} />
        </div>
    );
}
