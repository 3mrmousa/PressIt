"use client";
import { Switch } from "@/components/ui/switch";
import { useMe } from "@/hooks/useMe";
import { toggleHistory } from "@/features/user";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function SaveHistoryToggle() {
  const { data } = useMe();
  const userInfo = data?.data;
  const queryClient = useQueryClient();

  const handleToggleHistory = async () => {
    try {
      const res: any = await toggleHistory();
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(`History ${res.data.history ? "enabled" : "disabled"}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update setting");
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg transition-colors">
      <div>
        <p className="font-medium text-gray-700">Save History</p>
        <p className="text-xs text-gray-500">Store compressed images in your account</p>
      </div>
      <Switch 
        checked={userInfo?.history ?? true} 
        onCheckedChange={handleToggleHistory}
      />
    </div>
  );
}
