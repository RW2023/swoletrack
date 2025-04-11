import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCard from "@/components/profile/ProfileCard";
import UpdateNameForm from "@/components/profile/UpdateNameForm";
import UpdateAvatarCard from "@/components/profile/UpdateAvatarCard";

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
            <ProfileHeader userId={id} />
            <ProfileCard name={profile.name} avatarUrl={profile.avatar_url} />
            <UpdateAvatarCard />
            <UpdateNameForm currentName={profile.name} />
        </div>
    );
}
