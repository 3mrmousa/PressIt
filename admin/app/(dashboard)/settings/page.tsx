import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getAdminSettings } from "../../../features/admin/serverIndex";
import UpdateAdminSettings from "../../../components/ui/UpdateAdminSettings";

export default async function SettingsPage() {
  const settingsRes = await getAdminSettings();
  const webSettingsData = settingsRes?.data;
  
  return (
    <div className="min-h-screen flex flex-col flex-1 font-sans p-8">
      <main className="flex flex-1 w-full flex-col max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-shadow-lg">
            Settings Page
          </h1>
        </div>

        <div className="bg-white rounded-md shadow-lg p-6">
            <UpdateAdminSettings webSettingsData={webSettingsData} />
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
