"use client";
import Image from "next/image";
import { compress } from "@/features/compress";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export function DropZone() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");

  const [compressedPreview, setCompressedPreview] = useState<string>("");
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const [quality, setQuality] = useState(50);

  const [loading, setLoading] = useState(false);

  async function downloadCompressed() {
    if (!compressedPreview) return;

    const response = await fetch(compressedPreview);

    const link = document.createElement("a");
    link.href = compressedPreview;
    link.download = "compressed-" + originalImage?.name;

    document.body.appendChild(link);
    link.click();
    link.remove();
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

        setCompressedPreview(result.secureUrl);
        setCompressedSize(result.compressedSize);
        toast.success("Image compressed successfully!");
      } catch (error: any) {
        setCompressedPreview("");
        setCompressedSize(0);
        setOriginalPreview("");
        setOriginalImage(null);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [originalImage, quality]);

  return (
    <div className="w-full max-w-80 md:max-w-none min-h-75 md:min-h-115 flex flex-col items-center justify-center transition-all duration-300">
      {originalPreview && compressedPreview ? (
        <div className="mt-10 space-y-4 mb-8 w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold mb-3">Original</h3>

              <div className="relative h-64 w-full flex items-center justify-center">
                <Image
                  src={originalPreview}
                  alt="Original"
                  priority
                  unoptimized
                  width={1000}
                  height={1000}
                  className={`max-w-full h-full object-contain rounded-lg border ${loading ? "blur-sm" : ""}`}
                />
                {loading && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="absolute top-1/2 left-1/2 
              transform -translate-x-1/2 -translate-y-1/2 text-2xl text-purple-600"
                  />
                )}
              </div>
              <p className="mt-3 text-sm text-gray-600">
                {(originalImage!.size / 1024).toFixed(2)} KB
              </p>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="font-semibold mb-3">Compressed</h3>

              <div className="relative h-64 w-full flex items-center justify-center">
                <Image
                  src={compressedPreview}
                  alt="Compressed"
                  priority
                  unoptimized
                  width={1000}
                  height={1000}
                  className={`max-w-full h-full object-contain rounded-lg border ${loading ? "blur-sm" : ""}`}
                />
                {loading && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="absolute top-1/2 left-1/2 
                transform -translate-x-1/2 -translate-y-1/2 text-2xl text-purple-600"
                  />
                )}
              </div>

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
              <div className="relative h-64 w-full flex items-center justify-center">
                <Image
                  src={originalPreview}
                  alt="Original"
                  priority
                  unoptimized
                  width={1000}
                  height={1000}
                  className={`max-w-full h-full object-contain rounded-lg border ${loading ? "blur-sm" : ""}`}
                />
                {loading && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="absolute top-1/2 left-1/2 
                transform -translate-x-1/2 -translate-y-1/2 text-2xl text-purple-600"
                  />
                )}
              </div>

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
      )}
    </div>
  );
}
