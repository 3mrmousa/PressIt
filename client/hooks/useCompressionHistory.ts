import { getHistory } from "@/lib/compress";
import { useQuery } from "@tanstack/react-query";

export function useCompressionHistory({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: ["compression-history", page, limit],
    queryFn: () => getHistory({ page, limit }),
  });
}
