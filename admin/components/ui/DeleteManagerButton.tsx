"use client";
import { TrashIcon } from "lucide-react";
import { deleteManager } from "../../features/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteManagerButton({ userId }: { userId: string }) {
  const router = useRouter();
  async function handleDeleteManager() {
    try {
      await deleteManager(userId);
      toast.success("Manager deleted successfully!");
      router.push("/managers");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete manager");
    }
  }
  return (
    <button
      onClick={handleDeleteManager}
      className="mt-5 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer w-fit"
    >
      Delete Manager <TrashIcon />
    </button>
  );
}
