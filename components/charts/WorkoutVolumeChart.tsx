"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    Title,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Title
);

type VolumeChartProps = {
    labels: string[]; // e.g. ['Mar 18', 'Mar 19', ...]
    dataPoints: number[]; // e.g. [1000, 1500, 800, ...]
};

export default function WorkoutVolumeChart({ labels, dataPoints }: VolumeChartProps) {
    const data = {
        labels,
        datasets: [
            {
                label: "Workout Volume (lbs)",
                data: dataPoints,
                fill: true,
                tension: 0.4,
                borderColor: "hsl(var(--primary))",
                backgroundColor: "hsl(var(--primary) / 0.2)",
                pointRadius: 4,
                pointBackgroundColor: "hsl(var(--primary))",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "hsl(var(--foreground))",
                },
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    color: "hsl(var(--foreground))",
                },
                grid: {
                    color: "hsl(var(--border))",
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}
