import { client } from "@/lib/client";

export async function getAdminSettings() {
  return client<any>("/admin/settings",{
    method: "GET",
  });
}
