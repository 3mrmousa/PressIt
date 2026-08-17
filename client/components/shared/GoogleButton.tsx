"use client";

import { googleLogin } from "@/features/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function GoogleButton() {
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const googleMutation = useMutation({
    mutationFn: googleLogin,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });
      router.push("/");
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (!credentialResponse.credential) return;

          googleMutation.mutate(credentialResponse.credential);
        }}
        onError={() => {
          setError("Google login failed");
        }}
      />
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
