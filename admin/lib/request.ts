export async function request<T>(
  baseUrl: string,
  endPoint: string,
  options?: RequestInit,
): Promise<T> {
  const headers = new Headers(options?.headers);

  if (!(options?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${baseUrl}${endPoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const {message} = await res.json();
    throw new Error(message || "Something went wrong");
  }

  try {
    const data = await res.json();
    return data;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return {} as T;
    }
    throw e;
  }
}