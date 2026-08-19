"use client";
import { faPen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { uploadProfilePicture } from "@/features/user";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export function EditProfilePictureButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be less than 20MB");
      return;
    }

    setIsUploading(true);
    try {
      await uploadProfilePicture(file);
      toast.success("Profile picture updated!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload picture");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/jpg, image/png, image/webp"
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        title="Upload new profile picture"
        className="absolute bottom-0 right-0 text-white 
          bg-purple-600 p-2 rounded-full shadow-lg hover:text-purple-600 hover:bg-white
          cursor-pointer hover:scale-110 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon icon={isUploading ? faSpinner : faPen} spin={isUploading} />
      </button>
    </>
  );
}
