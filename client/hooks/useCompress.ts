import { compress } from "@/features/compress";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCompress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: compress,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compression-history"] });
    },
  });
}
