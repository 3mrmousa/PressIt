import { server } from "@/lib/server";

export async function getAdminSettings() {
  return server<any>("/admin/settings");
}
