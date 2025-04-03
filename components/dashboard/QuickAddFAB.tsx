'use client';

import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function QuickAddFAB() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/exercises/quick-add')}
            className="fixed bottom-6 right-6 z-50 bg-primary text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:scale-105 transition-all"
            aria-label="Quick Add Exercise"
        >
            <PlusIcon className="h-6 w-6" />
        </button>
    );
}
