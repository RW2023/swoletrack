"use client";

import { updateNameAction } from "@/app/profile/[id]/actions";

type UpdateNameFormProps = {
    currentName: string;
};

export default function UpdateNameForm({ currentName }: UpdateNameFormProps) {
    return (
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
                        defaultValue={currentName}
                        className="input input-bordered w-full max-w-sm"
                    />
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}
