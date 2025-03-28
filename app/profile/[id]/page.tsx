import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

// Tell Next.js we want *no* static pre-rendering:
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

// Optional: Return an empty array to confirm no static paths exist
export async function generateStaticParams() {
    return [];
}

// Our fully async page:
export default async function ProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = await createClient();

    // (Optional) Ensure only the owner sees this page
    const {
        data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser || authUser.id !== params.id) {
        notFound(); // or redirect("/sign-in")
    }

    // Fetch the user's profile row
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
