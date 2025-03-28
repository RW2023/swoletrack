import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

/**
 * Next 15 expects `params` to be a Promise if
 * the page is async. So define your type accordingly:
 */
type ProfilePageProps = {
    // 'params' is actually a Promise that resolves to your param object
    params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
    // Now you must 'await' params
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
            <h1 className="text-2xl font-bold">Profile</h1>
            <p>ID: {profile.id}</p>
            <p>Name: {profile.name}</p>
            {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" />}
        </div>
    );
}
