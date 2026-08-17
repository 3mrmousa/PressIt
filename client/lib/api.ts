const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
  responseType: "json" | "blob" | "response"= "json",
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw {
      message: body.message || res.statusText,
      statusCode: res.status,
    };
  }

  if (responseType === "response") {
    return res as T;
  }

  if (responseType === "blob") {
    return (await res.blob()) as T;
  }

  return res.json();
}
