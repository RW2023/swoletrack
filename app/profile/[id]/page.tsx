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
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {/* Header with Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Link
                    href={`/profile/${id}/dashboard`}
                    className="btn btn-primary btn-sm self-start sm:self-auto"
                >
                    Go to Dashboard
                </Link>
            </div>

            {/* Profile Card */}
            <div className="card bg-base-200 shadow-md">
                <div className="card-body items-center text-center">
                    <div className="avatar mb-4">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" />
                            ) : (
                                <span className="text-sm">No Avatar</span>
                            )}
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold">Name</h2>
                    <p className="text-base-content">{profile.name}</p>
                </div>
            </div>

            {/* Upload Form */}
            <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                    <h2 className="text-lg font-semibold mb-2">Update Avatar</h2>
                    <AvatarUploadForm />
                </div>
            </div>
        </div>
    );
}
