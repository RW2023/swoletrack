import Link from "next/link";

type ProfileHeaderProps = {
    userId: string;
};

export default function ProfileHeader({ userId }: ProfileHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold">Profile</h1>
            <Link
                href={`/profile/${userId}/dashboard`}
                className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition"
            >
                Go to Dashboard
            </Link>
        </div>
    );
}
