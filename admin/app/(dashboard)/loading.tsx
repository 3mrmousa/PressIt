import { Loader2Icon } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2Icon className="w-10 h-10 animate-spin text-purple-600 mb-4" />
      <p className="text-gray-500 font-medium">Loading data...</p>
    </div>
  );
}
