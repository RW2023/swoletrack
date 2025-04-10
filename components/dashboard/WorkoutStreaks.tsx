'use client';

interface WorkoutStreaksProps {
    currentStreak: number;
    longestStreak: number;
}

export default function WorkoutStreaks({
    currentStreak,
    longestStreak,
}: WorkoutStreaksProps) {
    return (
        <div className="card bg-base-200 shadow">
            <div className="card-body">
                <h2 className="card-title flex items-center gap-2 text-lg">
                    <span>🔥</span>
                    Streaks
                </h2>
                <div className="mt-2 text-sm">
                    <p>
                        Current:{" "}
                        <span className="text-xl font-bold text-primary">{currentStreak}</span> days
                    </p>
                    <p>
                        Longest:{" "}
                        <span className="text-xl font-bold text-primary">{longestStreak}</span> days
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Streaks are counted by consecutive workout days.
                        {(!currentStreak && !longestStreak) && (
                            <span className="block mt-1 italic">
                                Every journey begins with a single step. Start today! 💪
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
