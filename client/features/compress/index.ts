import { client } from "@/lib/client";

export async function compress({
  image,
  percent,
}: {
  image: File;
  percent: number;
}) {
  const formData = new FormData();

  formData.append("compress-image", image);
  formData.append("percent", String(percent));

  const blob = await client<Blob>(
    "/compress/compress",
    {
      method: "POST",
      body: formData,
    },
    "blob",
  );

  return {
    originalSize: image.size,
    compressedSize: blob.size,
    blob,
  };
}

export async function getHistory({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  return client(`/compress/history?page=${page}&limit=${limit}`, {
    method: "GET",
  });
}

export async function getImageById(id: string) {
  return client(`/compress/image/${id}`, {
    method: "GET",
  });
}

export async function deleteImage(id: string) {
  return client(`/compress/image/${id}`, {
    method: "DELETE",
  });
}
