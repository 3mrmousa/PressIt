import {
  getSubscriptionStatus,
  SubscriptionStatusResponse,
} from "@/lib/subscription";
import { useQuery } from "@tanstack/react-query";

export function useSubscription(enabled = true) {
  return useQuery<SubscriptionStatusResponse>({
    queryKey: ["subscription"],
    queryFn: getSubscriptionStatus,
    enabled,
  });
}
