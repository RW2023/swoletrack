// components/dashboard/StatCard.tsx
type StatCardProps = {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
};

export default function StatCard({ title, value, icon }: StatCardProps) {
    return (
        <div className="flex items-center gap-4 p-4 bg-base-100 border rounded shadow-sm">
            {icon && <div className="text-3xl">{icon}</div>}
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-xl font-semibold">{value}</p>
            </div>
        </div>
    );
}
