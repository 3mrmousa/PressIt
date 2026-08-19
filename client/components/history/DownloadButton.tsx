"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

interface DownloadButtonProps {
  url: string;
  imageName: string;
}

export default function DownloadButton({
  url,
  imageName,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const safeImageName = imageName || "compressed_image";
  const baseName =
    safeImageName.split(".").slice(0, -1).join(".") || safeImageName;
  const dateStr = new Date().toISOString().split("T")[0];
  const downloadName = `${baseName}_${dateStr}`;
  const downloadUrl = url.replace(
    "/upload/",
    `/upload/fl_attachment:${encodeURIComponent(downloadName)}/`,
  );

  const handleClick = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <a
      href={downloadUrl}
      onClick={handleClick}
      className={`text-sm bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 duration-300 cursor-pointer inline-flex items-center justify-center ${
        isDownloading ? "opacity-50 pointer-events-none" : ""
      }`}
      title="Download"
    >
      <FontAwesomeIcon 
        icon={isDownloading ? faCircleNotch : faDownload} 
        spin={isDownloading} 
      />
    </a>
  );
}
