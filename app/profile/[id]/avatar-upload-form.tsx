// app/profile/[id]/avatar-upload-form.tsx
"use client";

import React from "react";
import { updateAvatarAction } from "./actions";

export default function AvatarUploadForm() {
    return (
        <form action={updateAvatarAction}>
            <label htmlFor="avatarUpload" className="block mb-1 font-semibold">
                Upload Avatar
            </label>
            <input
                id="avatarUpload"
                name="avatar"
                type="file"
                accept="image/*"
                required
                className="mb-2"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
                Upload
            </button>
        </form>
    );
}
