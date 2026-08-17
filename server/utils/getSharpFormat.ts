export const getSharpFormat = (mimetype: string): "jpeg" | "png" | "webp" => {
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  return "jpeg";
};
