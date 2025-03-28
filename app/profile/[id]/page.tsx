import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import AvatarUploadForm from "@/app/profile/[id]/avatar-upload-form";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

/**
 * Next 15 expects `params` to be a Promise if
 * the page is async. So define your type accordingly:
 */
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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>

            {/* Avatar section */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Avatar</label>
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-32 h-32 object-cover rounded-full border"
                    />
                ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full" />
                )}
            </div>

            {/* Name */}
            <p className="text-lg font-medium mb-6">Name: {profile.name}</p>

            {/* Avatar upload form */}
            <AvatarUploadForm />
        </div>
    );
}
