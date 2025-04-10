'use client';

import Link from "next/link";

interface MostFrequentExercisesProps {
    mostFrequent: [string, number][];
    userId: string;
    userName?: string;
}

export default function MostFrequentExercises({
    mostFrequent,
    userId,
    userName,
}: MostFrequentExercisesProps) {
    return (
        <div className="card bg-base-200 shadow">
            <div className="card-body">
                <h2 className="card-title text-lg">💪 Most Frequent Exercises</h2>
                {mostFrequent.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-3">
                        {mostFrequent.map(([name, count]) => (
                            <li
                                key={name}
                                className="rounded bg-base-100 p-2 flex justify-between items-center"
                            >
                                <span>{name}</span>
                                <span className="badge badge-outline">{count}x</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No exercises logged yet. How old is this account{userName ? ` ${userName}` : ""}? Let's GO 💪!
                    </p>
                )}
                <Link
                    href={`/profile/${userId}/stats`}
                    className="btn btn-outline border-base-content text-base-content hover:bg-base-200 mt-4"
                >
                    View Exercise Stats
                </Link>
            </div>
        </div>
    );
}
