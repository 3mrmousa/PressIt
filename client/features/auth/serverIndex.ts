import { server } from "@/lib/server";
import type { MeResponse } from "@/lib/types/types";

export async function getMe() {
  return server<MeResponse>("/auth/me");
}