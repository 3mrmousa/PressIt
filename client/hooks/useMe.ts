import type { MeResponse } from "@/lib/types/types";
import { getMe } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: getMe,
  });
}
