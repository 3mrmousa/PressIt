import { server } from "@/lib/server";

export async function getHistory({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  return server<any>(`/compress/history?page=${page}&limit=${limit}`, {
    method: "GET",
  });
}


export async function getImageById(id: string) {
  return server(`/compress/${id}`, {
    method: "GET",
  });
}

export async function deleteImage(id: string) {
  return server(`/compress/${id}`, {
    method: "DELETE",
  });
}
