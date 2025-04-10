'use client';

interface DashboardStatsProps {
    totalWorkouts: number;
    totalSets: number;
    totalVolume: number;
}

export default function DashboardStats({
    totalWorkouts,
    totalSets,
    totalVolume,
}: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-base-200 p-4 rounded shadow">
            <div className="stat">
                <div className="stat-title">Total Workouts</div>
                <div className="stat-value">{totalWorkouts}</div>
            </div>
            <div className="stat">
                <div className="stat-title">Total Sets</div>
                <div className="stat-value">{totalSets}</div>
            </div>
            <div className="stat">
                <div className="stat-title">Total Volume</div>
                <div className="stat-value">{totalVolume.toLocaleString()} lbs</div>
            </div>
        </div>
    );
}
