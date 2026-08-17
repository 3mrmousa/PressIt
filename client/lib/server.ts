import { cookies } from "next/headers";
import { request } from "./request";

export async function server<T>(
  endpoint: string,
  options?: RequestInit,
  responseType: "json" | "blob" = "json",
): Promise<T> {
  const headers = new Headers(options?.headers);
  headers.set("Cookie", (await cookies()).toString());

  return request<T>(
    process.env.NEXT_PUBLIC_API_URL!,
    endpoint,
    {
      ...options,
      headers,
    },
    responseType,
  );
}
