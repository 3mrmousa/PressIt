import { api } from "./api";

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

  const res = await api<Response>(
    "/compress/compress",
    {
      method: "POST",
      body: formData,
    },
    "response",
  );

  const blob = await res.blob();

  return {
    originalSize: image.size,
    compressedSize: blob.size,
    blob,
  };
}

// export async function getHistory({
//   page,
//   limit,
// }: {
//   page: number;
//   limit: number;
// }) {
//   return api(`/compress/history?page=${page}&limit=${limit}`, {
//     method: "GET",
//   });
// }

// export async function getImageById(id: string) {
//   return api(`/compress/image/${id}`, {
//     method: "GET",
//   });
// }

// export async function deleteImage(id: string) {
//   return api(`/compress/image/${id}`, {
//     method: "DELETE",
//   });
// }
