import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getMe } from "../../../features/auth/serverIndex";

export default async function ProfilePage() {
    const user = await getMe();
    return (
        <div className="min-h-screen flex flex-col flex-1 font-sans p-8">
            <main className="flex flex-1 w-full flex-col max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-shadow-lg">
                        Profile Details
                    </h1>
                </div>
                <div className="mb-8">
                    {user?.data?.profilePicture?.secure_url ? (
                        <Image
                            src={user.data.profilePicture.secure_url}
                            alt={`${user?.data?.firstName} ${user?.data?.lastName}'s Avatar`}
                            width={160}
                            height={160}
                            className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-white"
                        />
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-purple-100 border-4 border-white shadow-md flex items-center justify-center">
                            <span className="text-4xl font-bold text-purple-600">
                                {(user?.data?.firstName?.[0] || "").toUpperCase()}
                                {(user?.data?.lastName?.[0] || "").toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full bg-white rounded-xl p-8 
        shadow-lg shadow-purple-500/10 border border-purple-100"
                >
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Name
                        </span>
                        <span className="text-base font-medium text-gray-900">
                            {user?.data?.firstName} {user?.data?.lastName}
                        </span>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Email
                        </span>
                        <span className="text-base font-medium text-gray-900">
                            {user?.data?.email}
                        </span>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Email Verified
                        </span>
                        <span className="text-base font-medium text-gray-900">
                            {user?.data?.emailVerified ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Unverified
                                </span>
                            )}
                        </span>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Role
                        </span>
                        <span className="text-base font-medium text-gray-900 capitalize">
                            {user?.data?.role}
                        </span>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Created At
                        </span>
                        <span className="text-base font-medium text-gray-900">
                            {user?.data?.createdAt
                                ? new Date(user.data.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "N/A"}
                        </span>
                    </div>
                </div>
                <Link
                    href="/"
                    className="mt-5 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md cursor-pointer w-fit"
                >
                    <ArrowLeftIcon />
                    <p> Back to Dashboard</p>
                </Link>
            </main>
        </div>
    );
}