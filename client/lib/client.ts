import { request } from "./request";

export function client<T>(
  endpoint: string,
  options?: RequestInit,
  responseType: "json" | "blob" = "json",
): Promise<T> {
  return request<T>(process.env.NEXT_PUBLIC_API_URL!, endpoint, {
    credentials: "include",
    ...options,
  }, responseType);
}
