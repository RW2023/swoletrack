'use client';

import AvatarUploadForm from "@/app/profile/[id]/avatar-upload-form";

export default function UpdateAvatarCard() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Update Avatar</h2>
                <AvatarUploadForm />
            </div>
        </div>
    );
}
