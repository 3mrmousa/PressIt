"use client";

import { googleLogin } from "@/features/auth";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function GoogleButton() {
  const [error, setError] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const googleMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/");
    },
    onError: (err: any) => {
      setError(err.message || "Google login failed");
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
