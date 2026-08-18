import {
  getFakeSubscriptionStatus,
  SubscriptionStatusResponse,
} from "@/features/fake-subscription";
import { useQuery } from "@tanstack/react-query";

export function useSubscription(enabled = true) {
  return useQuery<SubscriptionStatusResponse>({
    queryKey: ["subscription"],
    queryFn: getFakeSubscriptionStatus,
    enabled,
  });
}
