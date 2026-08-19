"use client";

import { useState } from "react";
import { deleteImage } from "@/features/compress";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id?: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete =async () => {
    try {
      setIsDeleting(true);
      const res = await deleteImage(id!)
      toast.success("Image deleted successfully");  
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  } 
  
  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-white text-sm px-3 py-2 rounded-lg bg-red-400 font-medium cursor-pointer hover:bg-red-600 duration-300 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete"
    >
      <FontAwesomeIcon icon={isDeleting ? faCircleNotch : faTrash} spin={isDeleting} />
    </button>
  );
}
