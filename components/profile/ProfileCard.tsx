type ProfileCardProps = {
    name: string;
    avatarUrl: string | null;
};

export default function ProfileCard({ name, avatarUrl }: ProfileCardProps) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-border ring ring-primary ring-offset-2 ring-offset-background">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                            No Avatar
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Name</h2>
                    <p className="text-foreground">{name}</p>
                </div>
            </div>
        </div>
    );
}
