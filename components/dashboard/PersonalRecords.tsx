'use client';

interface PersonalRecordsProps {
    records: [string, number][];
    name?: string;
}

export default function PersonalRecords({ records, name }: PersonalRecordsProps) {
    return (
        <div className="card bg-base-200 shadow">
            <div className="card-body">
                <h2 className="card-title flex items-center gap-2 text-lg">
                    <span>🏆</span>
                    {name ? `${name}'s Personal Records` : 'Personal Records'}
                </h2>
                {records.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm">
                        {records.map(([name, weight]) => (
                            <li key={name} className="flex justify-between">
                                <span>{name}</span>
                                <span className="font-semibold">{weight} lbs</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No PRs yet. Set the first one today!
                    </p>
                )}
            </div>
        </div>
    );
}
