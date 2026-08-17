export async function request<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit,
  responseType: "json" | "blob" = "json",
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${baseUrl}/${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = res.statusText || "Something went wrong";

    try {
      const data = await res.json();

      message = data.error || data.message || message;
    } catch {
      // Response wasn't JSON might be something else like blob
    }

    throw new Error(message);
  }

  if (responseType === "blob") {
    return (await res.blob()) as T;
  }

  return (await res.json()) as T;
}
