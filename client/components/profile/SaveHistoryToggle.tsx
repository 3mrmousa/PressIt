"use client";
import { Switch } from "@/components/ui/switch";
import { useMe } from "@/hooks/useMe";
import { toggleHistory } from "@/features/user";
import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function SaveHistoryToggle() {
  const { data } = useMe();
  const userInfo = data?.data;
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: toggleHistory,
    onSuccess: (res: any) => {
      queryClient.setQueryData(["me"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            history: res.data.history,
          },
        };
      });
      toast.success(`History ${res.data.history ? "enabled" : "disabled"}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update setting");
    },
  });

  const handleToggleHistory = () => toggleMutation.mutate();

  return (
    <div className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg transition-colors">
      <div>
        <p className="font-medium text-gray-700">Save History</p>
        <p className="text-xs text-gray-500">
          Store compressed images in your account
        </p>
      </div>
      <Switch
        checked={userInfo?.history ?? true}
        onCheckedChange={handleToggleHistory}
      />
    </div>
  );
}
