"use client";

import React, { useState } from "react";
import { updateAvatarAction } from "./actions";

export default function AvatarUploadForm() {
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        setSuccess(false);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            await updateAvatarAction(formData);
            setSuccess(true);
        } catch (err: any) {
            console.error("Avatar upload failed:", err);
            setError("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleUpload}>
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
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {success && <p className="text-green-600 mt-2">Upload successful!</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
    );
}
