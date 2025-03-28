import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type ProfilePageProps = {
    params: { id: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
    const supabase = await createClient();

    // Fetch the profile from Supabase
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", params.id)
        .single();

    if (error || !profile) {
        // If profile doesn't exist or there's an error, show a 404
        notFound();
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p>ID: {profile.id}</p>
            <p>Name: {profile.name}</p>
            {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" />}
        </div>
    );
}
