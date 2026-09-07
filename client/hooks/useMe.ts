import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/features/auth";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await getMe();
        return res;
      } catch (err: any) {
        throw new Error(err.message || "Failed to fetch user");
      }
    },
    retry: false,
  });
}
