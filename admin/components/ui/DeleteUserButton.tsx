"use client";
import { TrashIcon } from "lucide-react";
import { deleteUser } from "../../features/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({ userId }: { userId: string }) {
  const router = useRouter();
  async function handleDeleteUser() {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully!");
      router.push("/users");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete user");
    }
  }
  return (
    <button
      onClick={handleDeleteUser}
      className="mt-5 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer w-fit"
    >
      Delete User <TrashIcon />
    </button>
  );
}
