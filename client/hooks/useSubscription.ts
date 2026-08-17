import {
  getSubscriptionStatus,
  SubscriptionStatusResponse,
} from "@/features/subscription";
import { useQuery } from "@tanstack/react-query";

export function useSubscription(enabled = true) {
  return useQuery<SubscriptionStatusResponse>({
    queryKey: ["subscription"],
    queryFn: getSubscriptionStatus,
    enabled,
  });
}
