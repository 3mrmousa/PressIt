"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateAdminSettings } from "../../features/admin";
import { AdminSettings } from "../../features/admin/types";
import { CloudUploadIcon } from "lucide-react";

interface UpdateAdminSettingsProps {
  webSettingsData?: AdminSettings;
}

export default function UpdateAdminSettings({
  webSettingsData,
}: UpdateAdminSettingsProps) {
  const [siteName, setSiteName] = useState(webSettingsData?.siteName || "");
  const [plusPrice, setPlusPrice] = useState(
    webSettingsData?.subscriptionPrices?.plus || 0,
  );
  const [proPrice, setProPrice] = useState(
    webSettingsData?.subscriptionPrices?.pro || 0,
  );

  const [logo, setLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(
    webSettingsData?.logo?.secure_url,
  );
  const [faviconPreviewUrl, setFaviconPreviewUrl] = useState(
    webSettingsData?.favicon?.secure_url,
  );

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFavicon(file);
      setFaviconPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFaviconDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFavicon(file);
      setFaviconPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (logo) formData.append("logo", logo);
    if (favicon) formData.append("favicon", favicon);
    if (siteName) formData.append("siteName", siteName);
    if (plusPrice) formData.append("plusPrice", plusPrice.toString());
    if (proPrice) formData.append("proPrice", proPrice.toString());

    try {
      await updateAdminSettings(formData);
      toast.success("Settings updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-lg">
      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Site Name</label>
        <input
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 outline-none focus:border-purple-600"
          required
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <label className="font-medium text-gray-700">
            Plus Plan Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={plusPrice}
            onChange={(e) => setPlusPrice(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 outline-none focus:border-purple-600"
            required
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="font-medium text-gray-700">
            Pro Plan Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={proPrice}
            onChange={(e) => setProPrice(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 outline-none focus:border-purple-600"
            required
          />
        </div>
      </div>

      <div
        className="flex flex-col items-center justify-center gap-3 cursor-pointer 
        border-2 border-dashed border-purple-600 
        rounded-md p-4 min-h-40 shadow-lg shadow-purple-500 hover:bg-purple-50 
        transition-colors duration-300"
        onClick={() => logoInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleLogoDrop(e)}
        onDragLeave={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        {logoPreviewUrl ? (
          <div>
            <Image
              src={logoPreviewUrl}
              alt="Logo Preview"
              width={120}
              height={120}
              className="object-contain border border-gray-200 rounded-md p-2 bg-gray-50"
            />
          </div>
        ) : (
          <CloudUploadIcon className="w-12 h-12 text-purple-600" />
        )}
        <div className="text-center">
          <p className="text-sm font-semibold text-purple-900">
            {logoPreviewUrl ? "Click to change logo" : "Click to upload logo"}
            <span className="text-gray-500 font-normal"> or drag and drop</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or WEBP (MAX. 20MB)</p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          ref={logoInputRef}
          hidden
        />
      </div>
      <div
        className="flex flex-col items-center justify-center gap-3 cursor-pointer 
        border-2 border-dashed border-purple-600 
        rounded-md p-4 min-h-40 shadow-lg shadow-purple-500 hover:bg-purple-50 
        transition-colors duration-300"
        onClick={() => faviconInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleFaviconDrop(e)}
        onDragLeave={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        {faviconPreviewUrl ? (
          <div>
            <Image
              src={faviconPreviewUrl}
              alt="Favicon Preview"
              width={120}
              height={120}
              className="object-contain border border-gray-200 rounded-md p-2 bg-gray-50"
            />
          </div>
        ) : (
          <CloudUploadIcon className="w-12 h-12 text-purple-600" />
        )}
        <div className="text-center">
          <p className="text-sm font-semibold text-purple-900">
            {faviconPreviewUrl ? "Click to change favicon" : "Click to upload favicon"}
            <span className="text-gray-500 font-normal"> or drag and drop</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or WEBP (MAX. 20MB)</p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFaviconChange}
          ref={faviconInputRef}
          hidden
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white font-medium py-2 px-6 rounded-md hover:bg-purple-700 transition-colors w-fit disabled:opacity-70 disabled:cursor-not-allowed mt-2"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
