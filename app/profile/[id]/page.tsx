import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import AvatarUploadForm from "@/app/profile/[id]/avatar-upload-form";
import { updateNameAction } from "@/app/profile/[id]/actions";
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
                    className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition"
                >
                    Go to Dashboard
                </Link>
            </div>

            {/* Profile Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-border ring ring-primary ring-offset-2 ring-offset-background">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
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
                        <p className="text-foreground">{profile.name}</p>
                    </div>
                </div>
            </div>

            {/* Avatar Upload */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Update Avatar</h2>
                    <AvatarUploadForm />
                </div>
            </div>

            {/* Update Name Form */}
            <div className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Update Name</h2>
                    <form
                        action={updateNameAction}
                        className="flex flex-col sm:flex-row gap-2"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            defaultValue={profile.name}
                            className="input input-bordered w-full max-w-sm"
                        />
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
