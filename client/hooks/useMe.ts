import type { MeResponse } from "@/lib/types/types";
import { getMe } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: getMe,
  });
}
