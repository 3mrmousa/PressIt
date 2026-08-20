import Image from "next/image";

export default function SidebarLogo() {
  return (
    <div className="px-6 mb-8 flex items-center">
      <Image src="/logo.svg" alt="PressIt Logo" width={140} height={36} priority />
    </div>
  );
}
