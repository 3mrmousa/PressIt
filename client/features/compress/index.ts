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

  const response = await client<any>(
    "/compress/compress",
    {
      method: "POST",
      body: formData,
    },
    "json",
  );

  return {
    originalSize: response.data.originalSize,
    compressedSize: response.data.compressedSize,
    secureUrl: response.data.images.compressedImage.secureUrl,
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
  return client(`/compress/${id}`, {
    method: "GET",
  });
}

export async function deleteImage(id: string) {
  return client(`/compress/${id}`, {
    method: "DELETE",
  });
}
