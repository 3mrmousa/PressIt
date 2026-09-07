"use client";
import { faPen, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { uploadProfilePicture } from "@/features/user";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function EditProfilePictureButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: () => {
      toast.success("Profile picture updated!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload picture");
    },
    onSettled: () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be less than 20MB");
      return;
    }

    uploadMutation.mutate(file);
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
        disabled={uploadMutation.isPending}
        title="Upload new profile picture"
        className="absolute bottom-0 right-0 text-white 
          bg-purple-600 p-2 rounded-full shadow-lg hover:text-purple-600 hover:bg-white
          cursor-pointer hover:scale-110 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon icon={uploadMutation.isPending ? faSpinner : faPen} spin={uploadMutation.isPending} />
      </button>
    </>
  );
}
