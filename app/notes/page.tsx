'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [notes, setNotes] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            // Get user session
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push('/sign-in'); // Redirect if not authenticated
                return;
            }

            // Fetch notes if user is authenticated
            const { data } = await supabase.from('notes').select();
            setNotes(data);
            setLoading(false);
        };

        fetchData();
    }, [supabase, router]);

    if (loading) return <p>Loading...</p>;

    return <pre>{JSON.stringify(notes, null, 2)}</pre>;
}
