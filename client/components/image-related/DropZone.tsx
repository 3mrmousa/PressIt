"use client";
import { compress } from "@/features/compress";
// import { useCompress } from "@/hooks/useCompress";
import { useEffect, useRef, useState } from "react";

export function DropZone() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");

  const [compressedPreview, setCompressedPreview] = useState<string>("");
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  const [quality, setQuality] = useState(80);

  const [loading, setLoading] = useState(false);



  async function downloadCompressed() {
    if (!compressedPreview) return;

    const response = await fetch(compressedPreview);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${originalImage?.name}`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const file = files[0];

    setOriginalImage(file);
    setOriginalPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!originalImage) return;

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const result = await compress({
          image: originalImage,
          percent: quality,
        });

        if (compressedPreview.startsWith("blob:")) {
          URL.revokeObjectURL(compressedPreview);
        }
        setCompressedPreview(result.secureUrl);
        setCompressedSize(result.compressedSize);
        setError(null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [originalImage, quality]);

  return originalPreview && compressedPreview ? (
    <div className="mt-10 space-y-4 mb-8">
      {error && (
        <div className="text-red-600 font-semibold text-center">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <h3 className="font-semibold mb-3">Original</h3>

          <img
            src={originalPreview}
            alt="Original"
            className={`w-2/4 mx-auto object-contain rounded-lg border ${loading ? "animate-pulse" : ""}`}
          />

          <p className="mt-3 text-sm text-gray-600">
            {(originalImage!.size / 1024).toFixed(2)} KB
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="font-semibold mb-3">Compressed</h3>

          <img
            src={compressedPreview}
            alt="Compressed"
            className={`w-2/4 mx-auto object-contain rounded-lg border ${loading ? "animate-pulse" : ""}`}
          />

          <p className="mt-3 text-sm text-gray-600">
            {compressedSize ? (compressedSize / 1024).toFixed(2) : "0"} KB
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <label className="block font-medium">
          Compression Quality: {quality}%
        </label>

        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-3/4"
        />
      </div>

      <button
        onClick={downloadCompressed}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mx-auto block cursor-pointer"
      >
        Download Compressed Image
      </button>
    </div>
  ) : (
    <div className="bg-white rounded-2xl px-10 md:px-20 py-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {originalImage ? (
        <div className="flex flex-col items-center">
          <img
            src={originalPreview}
            alt="Original"
            className={`w-2/4 mx-auto object-contain rounded-lg border ${loading ? "animate-pulse" : ""}`}
          />

          <p className="mt-3 text-sm text-gray-600">
            {(originalImage!.size / 1024).toFixed(2)} KB
          </p>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl px-15 md:px-80 py-20 flex flex-col items-center gap-4 cursor-pointer transition-colors duration-300
          ${
            isDragging
              ? "border-purple-600 bg-purple-50"
              : "border-purple-400/40 hover:border-purple-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-12 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>

          <p className="text-center text-gray-600 font-medium">
            Drag & drop your images here
          </p>
          <p className="text-center text-sm text-gray-400">
            or click to browse files
          </p>
        </div>
      )}
    </div>
  );
}
