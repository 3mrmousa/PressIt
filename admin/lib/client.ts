import { request } from "./request";

export function client<T>(endPoint: string, options?: RequestInit): Promise<T> {
  return request<T>(process.env.NEXT_PUBLIC_API_URL!, endPoint, {
    credentials: "include",
    ...options,
  });
}
