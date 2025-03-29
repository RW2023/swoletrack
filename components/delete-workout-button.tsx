"use client";

import { useTransition } from "react";
import { deleteWorkoutAction } from "@/app/profile/[id]/actions";

export function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <form
            action={async () => {
                const confirmed = confirm("Are you sure you want to delete this workout?");
                if (!confirmed) return;

                startTransition(() => {
                    deleteWorkoutAction(workoutId);
                });
            }}
        >
            <button
                type="submit"
                className="text-red-500 hover:underline text-xs disabled:opacity-50"
                disabled={isPending}
            >
                {isPending ? "Deleting..." : "Delete"}
            </button>
        </form>
    );
}
