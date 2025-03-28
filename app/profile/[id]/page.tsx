import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

/**
 * Our top-level page is a normal function that
 * receives props synchronously (non-async).
 */
export default function ProfilePage(props: {
    params: { id: string };
    searchParams?: any;
}) {
    // Just pass all props to the async child
    return <ProfileServer {...props} />;
}

async function ProfileServer({
    params,
}: {
    params: { id: string };
    searchParams?: any;
}) {
    const supabase = await createClient();

    // Check the currently authenticated user
    const {
        data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser || authUser.id !== params.id) {
        notFound();
    }

    // Fetch the profile
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", params.id)
        .single();

    if (error || !profile) {
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
