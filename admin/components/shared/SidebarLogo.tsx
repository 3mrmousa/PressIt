import Image from "next/image";

interface SidebarLogoProps {
  logoUrl?: string;
  siteName?: string;
}

export default function SidebarLogo({ logoUrl, siteName }: SidebarLogoProps) {
  return (
    <div className="px-6 mb-8 flex items-center">
        <Image
          src={logoUrl || "/logo.png"}
          alt={`${siteName || "PressIt"} Logo`}
          width={140}
          height={36}
          className="object-contain"
          priority
        />

    </div>
  );
}
