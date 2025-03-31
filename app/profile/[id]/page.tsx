import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import AvatarUploadForm from "@/app/profile/[id]/avatar-upload-form";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

type ProfilePageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;

    const supabase = await createClient();
    const {
        data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser || authUser.id !== id) {
        notFound();
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", id)
        .single();

    if (error || !profile) {
        notFound();
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                <Link
                    href={`/profile/${id}/dashboard`}
                    className="btn btn-primary btn-sm"
                >
                    Go to Dashboard
                </Link>
            </div>

            {/* Avatar Display */}
            <div className="flex items-center gap-6 mb-6">
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-24 h-24 object-cover rounded-full border border-border"
                    />
                ) : (
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-sm text-muted-foreground">
                        No avatar
                    </div>
                )}
                <div>
                    <p className="text-xl font-medium text-foreground">
                        Name: {profile.name}
                    </p>
                </div>
            </div>

            {/* Avatar Upload Form */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-foreground">
                    Update Avatar
                </h2>
                <div className="bg-muted p-4 rounded-lg">
                    <AvatarUploadForm />
                </div>
            </div>
        </div>
    );
}
