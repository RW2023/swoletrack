import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
            <h1 className="text-4xl font-bold mb-4 text-red-600">404 - Not Found</h1>
            <p className="text-lg text-gray-300 mb-6 max-w-md">
                The page you’re trying to access is only available to authorized users.
                You may have been logged out due to inactivity. It could be the page is no longer available.
            </p>
            <Link
                href="/sign-in"
                className="text-blue-500 font-semibold underline hover:text-blue-400 transition"
            >
                ➜ Click here to sign back in
            </Link>
        </div>
    );
}
